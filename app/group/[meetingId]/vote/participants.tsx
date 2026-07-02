import Header from '@/components/ui/Header';
import ServerErrorModal from '@/components/ui/ServerErrorModal';
import { API } from '@/constants/api';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

interface Participant {
    userId: number;
    nickname: string;
}

interface VoteOption {
    optionId: number;
    content: string;
    voteCount: number;
    participants: Participant[];
}

interface VoteParticipantsData {
    voteId: number;
    title: string;
    totalVoteCount: number;
    options: VoteOption[];
}

const COLORS = [Colors.primary, '#F9C97A', '#FDDBA8', Colors.gray300];

function DonutChart({ options, total }: { options: VoteOption[]; total: number }) {
    const SIZE = 130;
    const RADIUS = 50;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
    const CENTER = SIZE / 2;
    const STROKE_WIDTH = 18;

    // 득표 많은 순 정렬
    const sortedOptions = [...options].sort((a, b) => b.voteCount - a.voteCount);
    const topOption = sortedOptions[0];
    const topPct = total > 0 ? Math.round((topOption.voteCount / total) * 100) : 0;

    // 도넛 세그먼트 (정렬된 순서로)
    let offset = 0;
    const segments = sortedOptions.map((option, i) => {
        const pct = total > 0 ? option.voteCount / total : 0;
        const dash = pct * CIRCUMFERENCE;
        const gap = CIRCUMFERENCE - dash;
        const rotation = -90 + (offset / CIRCUMFERENCE) * 360;
        offset += dash;
        return { dash, gap, rotation, color: COLORS[i] ?? Colors.gray200 };
    });

    // 득표 있는 것만, 상위 3개 + 나머지
    const votedOptions = sortedOptions.filter(o => o.voteCount > 0);
    const topThree = votedOptions.slice(0, 3);
    const restCount = votedOptions.length - topThree.length;

    return (
        <View style={styles.chartSection}>
            <Svg width={SIZE} height={SIZE}>
                <Circle
                    cx={CENTER} cy={CENTER} r={RADIUS}
                    fill="none"
                    stroke={Colors.gray200}
                    strokeWidth={STROKE_WIDTH}
                />
                {segments.map((seg, i) => (
                    seg.dash > 0 && (
                        <Circle
                            key={i}
                            cx={CENTER} cy={CENTER} r={RADIUS}
                            fill="none"
                            stroke={seg.color}
                            strokeWidth={STROKE_WIDTH}
                            strokeDasharray={`${seg.dash} ${seg.gap}`}
                            strokeLinecap="butt"
                            transform={`rotate(${seg.rotation} ${CENTER} ${CENTER})`}
                        />
                    )
                ))}
            </Svg>

            <View style={styles.topInfo}>
                {topOption.voteCount > 0 ? (
                    <>
                        <Text style={styles.topLabel}>🏆 현재 1위</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: Spacing.xs }}>
                            <Text style={styles.topName}>
                                {(() => {
                                    const tied = sortedOptions.filter(o => o.voteCount === topOption.voteCount);
                                    const shown = tied.slice(0, 2).map(o => o.content).join(', ');
                                    const rest = tied.length - 2;
                                    return rest > 0 ? `${shown} 외 ${rest}개` : shown;
                                })()}
                            </Text>
                            <Text style={styles.topMeta}>{topOption.voteCount}표</Text>
                        </View>
                    </>
                ) : (
                    <Text style={styles.topLabel}>아직 투표가 없어요</Text>
                )}
            </View>

            <View style={styles.legend}>
                {topThree.map((option, i) => {
                    const pct = total > 0 ? Math.round((option.voteCount / total) * 100) : 0;
                    return (
                        <View key={option.optionId} style={styles.legendItem}>
                            <View style={[styles.dot, { backgroundColor: COLORS[i] ?? Colors.gray200 }]} />
                            <Text style={styles.legendName}>{option.content}</Text>
                            <Text style={styles.legendPct}>{pct}%</Text>
                        </View>
                    );
                })}
                {restCount > 0 && (
                    <View style={styles.legendItem}>
                        <Text style={styles.legendPct}>외 {restCount}개</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

// ───── 아바타 ─────
function Avatar({ nickname }: { nickname: string }) {
    return (
        <View style={styles.avatar}>
            <Text style={styles.avatarText}>{nickname[0]}</Text>
        </View>
    );
}

export default function VoteParticipantsScreen() {
    const { userToken } = useAuthStore();
    const { voteId } = useLocalSearchParams();

    const [data, setData] = useState<VoteParticipantsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [serverErrorModal, setServerErrorModal] = useState(false);

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const res = await fetch(API.getVoteParticipants(Number(voteId)), {
                    headers: { 'Authorization': `Bearer ${userToken}` },
                });
                if (!res.ok) { setServerErrorModal(true); return; }
                const json = await res.json();
                setData(json);
            } catch {
                setServerErrorModal(true);
            } finally {
                setLoading(false);
            }
        };
        fetchParticipants();
    }, []);

    const getRank = (options: VoteOption[], voteCount: number) => {
        const sorted = [...new Set(options.map(o => o.voteCount))].sort((a, b) => b - a);
        return sorted.indexOf(voteCount) + 1;
    };

    const sortedOptions = data
        ? [...data.options].sort((a, b) => b.voteCount - a.voteCount)
        : [];

    const useDonut = (data?.options.length ?? 0) <= 3;

    const uniqueParticipants = data ? new Set(
        data.options.flatMap(o => o.participants.map(p => p.userId))
    ).size : 0;

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <Header title="투표 참여자" />

            {loading ? (
                <ActivityIndicator style={{ marginTop: Spacing['2xl'] }} color={Colors.primary} />
            ) : data && (
                <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                    <Text style={styles.voteTitle}>{data.title}</Text>
                    <Text style={styles.voteMeta}>총 {uniqueParticipants}명 참여</Text>

                    <DonutChart options={data.options} total={data.totalVoteCount} />

                    <View style={styles.divider} />

                    {sortedOptions.map((option) => {
                        const rank = getRank(data.options, option.voteCount);
                        const pct = data.totalVoteCount > 0
                            ? Math.round((option.voteCount / data.totalVoteCount) * 100)
                            : 0;
                        const isTop = rank === 1 && option.voteCount > 0;

                        return (
                            <View key={option.optionId} style={styles.rankItem}>
                                <View style={styles.rankTop}>
                                    <Text style={[styles.rankNum, isTop && styles.rankNumFirst]}>{rank}</Text>
                                    <Text style={[styles.rankName, !isTop && { color: Colors.gray500 }]}>
                                        {option.content}
                                    </Text>
                                </View>

                                <View style={styles.barWrap}>
                                    <View style={styles.barBg}>
                                        <View style={[
                                            styles.barFill,
                                            { width: `${pct}%` },
                                            !isTop && styles.barFillDim,
                                        ]} />
                                    </View>
                                    <Text style={styles.barPct}>{pct}%</Text>
                                </View>

                                <View style={styles.participants}>
                                    {option.participants.length > 0 ? (
                                        option.participants.map((p) => (
                                            <View key={p.userId} style={styles.person}>
                                                <Avatar nickname={p.nickname} />
                                                <Text style={styles.personName}>{p.nickname}</Text>
                                            </View>
                                        ))
                                    ) : (
                                        <Text style={styles.emptyText}>아직 없어요</Text>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
            )}

            <ServerErrorModal
                visible={serverErrorModal}
                onClose={() => setServerErrorModal(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    container: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xl,
        paddingBottom: Spacing['3xl'],
        gap: Spacing.base,
    },
    voteTitle: {
        fontSize: Typography.lg,
        fontWeight: '800',
        color: Colors.black,
    },
    voteMeta: {
        fontSize: Typography.sm,
        color: Colors.gray500,
    },

    // 도넛 섹션
    chartSection: {
        alignItems: 'center',
        gap: Spacing.md,
        paddingVertical: Spacing.sm,
    },
    topInfo: {
        alignItems: 'center',
        gap: Spacing.xs,
    },
    topLabel: {
        fontSize: Typography.sm,
        color: Colors.primary,
        fontWeight: '600',
    },
    topName: {
        fontSize: Typography.xl,
        fontWeight: '800',
        color: Colors.black,
    },
    topMeta: {
        fontSize: Typography.sm,
        color: Colors.gray500,
    },
    legend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: Spacing.md,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    dot: {
        width: 9,
        height: 9,
        borderRadius: Radius.full,
    },
    legendName: {
        fontSize: Typography.sm,
        fontWeight: '500',
        color: Colors.black,
    },
    legendPct: {
        fontSize: Typography.sm,
        color: Colors.gray500,
    },

    // 요약 카드
    summaryCard: {
        backgroundColor: Colors.primaryLight,
        borderRadius: Radius.lg,
        padding: Spacing.base,
        gap: Spacing.xs,
        alignItems: 'center',
    },

    divider: {
        height: 1,
        backgroundColor: Colors.border,
    },

    // 순위 리스트
    rankItem: {
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        gap: Spacing.sm,
    },
    rankTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    rankNum: {
        fontSize: Typography.lg,
        fontWeight: '500',
        color: Colors.gray500,
        width: 22,
        textAlign: 'center',
    },
    rankNumFirst: {
        color: Colors.primary,
    },
    rankName: {
        fontSize: Typography.base,
        fontWeight: '500',
        color: Colors.black,
        flex: 1,
    },
    barWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        paddingLeft: 38,
    },
    barBg: {
        flex: 1,
        height: 5,
        backgroundColor: Colors.gray200,
        borderRadius: Radius.full,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: Radius.full,
    },
    barFillDim: {
        backgroundColor: Colors.gray300,
    },
    barPct: {
        fontSize: Typography.xs,
        color: Colors.gray500,
        width: 32,
        textAlign: 'right',
    },
    participants: {
        paddingLeft: 38,
        gap: Spacing.sm,
    },
    person: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    avatar: {
        width: 26,
        height: 26,
        borderRadius: Radius.full,
        backgroundColor: Colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: Typography.xs,
        fontWeight: '700',
        color: Colors.primary,
    },
    personName: {
        fontSize: Typography.sm,
        color: Colors.gray700,
    },
    emptyText: {
        fontSize: Typography.sm,
        color: Colors.gray500,
        fontStyle: 'italic',
    },
});
