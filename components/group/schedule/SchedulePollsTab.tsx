// SchedulePollsTab.tsx
import SchedulePollCard from '@/components/group/schedule/SchedulePollCard';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import ServerErrorModal from '@/components/ui/ServerErrorModal';
import { API } from '@/constants/api';
import { Colors, Spacing, Typography } from '@/constants/theme';
import useError from '@/hooks/useError';
import { useAuthStore } from '@/store/useAuthStore';
import { useMeetingStore } from '@/store/useMeetingStore';
import { formatFinalScheduleMeta, getDaysUntilDeadline } from '@/utils/date';
import { useFocusEffect, useRouter } from 'expo-router';
import { CalendarX2 } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface SchedulePollsTabProps {
    meetingId: number;
}

interface SchedulePoll {
    schedulePollId: number;
    title: string;
    startDate: string;
    endDate: string;
    deadlineAt: string;
    status: string;
    isOwner: boolean;
    closedAt: string | null;
}

export default function SchedulePollsTab({ meetingId }: SchedulePollsTabProps) {
    // ── 인증 ──
    const router = useRouter();
    const { userToken } = useAuthStore();
    const { myRole } = useMeetingStore();
    const { showError } = useError();

    // ── 데이터 ──
    const [polls, setPolls] = useState<SchedulePoll[]>([]);

    // ── 로딩 ──
    const [loading, setLoading] = useState(false);

    // ── 서버 오류 ──
    const [serverErrorModal, setServerErrorModal] = useState(false);

    // ── 삭제 모달 ──
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // ── 마감된 목록 더보기 ──
    const [showAll, setShowAll] = useState(false);

    // ── 파생 값 ──
    const selectedPoll = polls.find(p => p.schedulePollId === selectedId);

    // 마감 여부 (서버 status 기준 - 자동 마감 스케줄러 적용됨)
    const isClosed = (poll: SchedulePoll) =>
        poll.status === 'CLOSED';

    // 이 카드에 수정/삭제 버튼을 보여줄지 (방장 또는 작성자)
    const canManage = (poll: SchedulePoll) =>
        myRole === 'HOST' || poll.isOwner === true;

    const inProgressPolls = polls.filter(p => !isClosed(p));

    // 마감된 것 중 최근 마감(closedAt 기준) 순으로 정렬
    const closedPolls = polls
        .filter(isClosed)
        .sort((a, b) => new Date(b.closedAt!).getTime() - new Date(a.closedAt!).getTime());

    const visibleClosedPolls = showAll ? closedPolls : closedPolls.slice(0, 3);

    // ── 목록 조회 ──
    const fetchPolls = async () => {
        setLoading(true);
        try {
            const response = await fetch(API.getSchedulePolls(meetingId), {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`,
                }
            });
            const data = await response.json();

            if (!response.ok) {
                setServerErrorModal(true);
                return;
            }

            setPolls(data.schedulePolls);

        } catch (e) {
            setServerErrorModal(true);
        } finally {
            setLoading(false);
        }
    };
    // ── 화면 포커스될 때마다 새로고침 ──
    useFocusEffect(
        useCallback(() => {
            fetchPolls();
        }, [])
    );

    // ── 삭제 ──
    const handleDelete = async () => {
        if (!selectedId) return;
        try {
            const response = await fetch(API.deleteSchedulePoll(meetingId, selectedId), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                }
            });

            if (!response.ok) {
                const body = await response.json().catch(() => null);
                if (__DEV__) {
                    console.error('deleteSchedulePoll failed:', response.status, body);
                }
                showError('이 작업을 수행할 권한이 없습니다');
                return;
            }

            fetchPolls();

        } catch (e) {
            if (__DEV__) {
                console.error('deleteSchedulePoll exception:', e);
            }
            showError('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요');
        }
    };

    if (loading) return <ActivityIndicator style={{ marginTop: Spacing['2xl'] }} color={Colors.primary} />;

    return (
        <>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            >
                {/* 빈 상태 */}
                {polls.length === 0 && (
                    <EmptyState
                        icon={
                            <View style={{ position: 'relative' }}>
                                <CalendarX2 size={35} color={Colors.primary} />
                            </View>
                        }
                        title="아직 조율중인 일정이 없어요"
                        description={"새 일정조율을 만들어\n멤버들의 가능한 날짜를 받아보세요."}
                        variant='card'
                    />
                )}

                {/* 조율중인 일정 */}
                {polls.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>조율중인 일정</Text>
                        {inProgressPolls.length > 0 ? (
                            <View style={styles.list}>
                                {inProgressPolls.map((item) => (
                                    <SchedulePollCard
                                        key={item.schedulePollId}
                                        title={item.title}
                                        meta={formatFinalScheduleMeta(item.startDate, item.endDate)}
                                        deadline={getDaysUntilDeadline(item.deadlineAt)}
                                        status={item.status}
                                        showActions={canManage(item)}
                                        onPress={() => router.push({
                                            pathname: `/group/${meetingId}/schedule/detail` as any,
                                            params: { schedulePollId: item.schedulePollId }
                                        })}
                                        onEdit={() => router.push({
                                            pathname: `/group/${meetingId}/schedule/create-poll` as any,
                                            params: { schedulePollId: item.schedulePollId }
                                        })}
                                        onDelete={() => {
                                            setSelectedId(item.schedulePollId);
                                            setDeleteModal(true);
                                        }}
                                    />
                                ))}
                            </View>
                        ) : (
                            <Text style={styles.emptyHint}>조율중인 일정이 없어요</Text>
                        )}
                    </View>
                )}

                {/* 마감된 일정 */}
                {closedPolls.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>마감된 일정</Text>
                        <View style={styles.list}>
                            {visibleClosedPolls.map((item) => (
                                <SchedulePollCard
                                    key={item.schedulePollId}
                                    title={item.title}
                                    meta={formatFinalScheduleMeta(item.startDate, item.endDate)}
                                    deadline={getDaysUntilDeadline(item.deadlineAt)}
                                    status="CLOSED"
                                    showActions={canManage(item)}
                                    onPress={() => router.push({
                                        pathname: `/group/${meetingId}/schedule/detail` as any,
                                        params: { schedulePollId: item.schedulePollId }
                                    })}
                                    onEdit={() => { }}
                                    onDelete={() => {
                                        setSelectedId(item.schedulePollId);
                                        setDeleteModal(true);
                                    }}
                                />
                            ))}
                        </View>
                        {closedPolls.length > 3 && (
                            <TouchableOpacity onPress={() => setShowAll(!showAll)} style={styles.moreButton}>
                                <Text style={styles.moreText}>
                                    {showAll ? '접기' : `더보기 (${closedPolls.length - 3}개)`}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </ScrollView>

            <Modal
                visible={deleteModal}
                message={`"${selectedPoll?.title}" 조율을\n삭제하시겠습니까?`}
                showLeftBtn={true}
                leftBtnText="취소"
                rightBtnText="삭제"
                onLeftBtnPress={() => setDeleteModal(false)}
                onRightBtnPress={() => {
                    setDeleteModal(false);
                    setTimeout(() => {
                        handleDelete();
                    }, 300);
                }}
                onBackDropPress={() => setDeleteModal(false)}
                rightBtnVariant="danger"
            />

            {/* 서버 오류 모달 */}
            <ServerErrorModal
                visible={serverErrorModal}
                onClose={() => setServerErrorModal(false)}
            />
        </>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: Typography.sm,
        fontWeight: '700',
        color: Colors.black,
        marginBottom: Spacing.md,
    },
    emptyHint: {
        fontSize: Typography.sm,
        color: Colors.gray500,
        marginTop: Spacing.xs,
        textAlign: 'center',
    },
    list: {
        gap: Spacing.md,
    },
    moreButton: {
        alignItems: 'center',
        paddingVertical: Spacing.md,
    },
    moreText: {
        fontSize: Typography.sm,
        color: Colors.primary,
        fontWeight: '600',
    },
    listContainer: {
        flexGrow: 1,
    },
});