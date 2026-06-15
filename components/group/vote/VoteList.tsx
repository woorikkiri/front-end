import VoteCard, { VoteItem } from '@/components/group/vote/VoteCard';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { Plus, Vote } from 'lucide-react-native';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface VoteListProps {
    votes: VoteItem[];
    onCreatePress: () => void;
    onVotePress: (vote: VoteItem) => void;
    onSuccess: () => void;
}

export default function VoteList({ votes, onCreatePress, onVotePress, onSuccess }: VoteListProps) {
    const [showAll, setShowAll] = useState(false);

    const inProgress = votes.filter(v => v.status === 'IN_PROGRESS');
    const completed = votes.filter(v => v.status === 'COMPLETED');
    const visibleCompleted = showAll ? completed : completed.slice(0, 3);

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            {/* 헤더 */}
            <View style={styles.titleSection}>
                <Text style={styles.titleText}>투표</Text>
                {votes.length > 0 &&
                    <Button
                        label='투표 생성'
                        onPress={onCreatePress}
                        variant="warning"
                        size="sm"
                        fullWidth={false}
                        icon={<Plus size={18} color={Colors.primary} />}
                        style={{ borderRadius: Radius.full }}
                    />
                }
            </View>

            {/* 빈 상태 */}
            {votes.length === 0 && (
                <EmptyState
                    icon={<Vote size={40} color={Colors.gray500} />}
                    title="아직 진행되는 투표가 없어요"
                    description="원하는 메뉴를 투표로 정해볼까요?"
                    variant='card'
                >
                    <Button
                        label="투표 생성하기"
                        onPress={onCreatePress}
                        fullWidth={false}
                    />
                </EmptyState>
            )}

            {/* 진행 중인 투표 */}
            {inProgress.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>진행 중인 투표</Text>
                    <View style={styles.list}>
                        {inProgress.map((item) => (
                            <VoteCard
                                key={item.voteId}
                                item={item}
                                onPress={() => onVotePress(item)}
                                onSuccess={onSuccess}
                            />
                        ))}
                    </View>
                </View>
            )}

            {/* 종료된 투표 */}
            {completed.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>종료된 투표</Text>
                    <View style={styles.list}>
                        {visibleCompleted.map((item) => (
                            <VoteCard
                                key={item.voteId}
                                item={item}
                                onPress={() => onVotePress(item)}
                                onSuccess={onSuccess}
                            />
                        ))}
                    </View>
                    {completed.length > 3 && (
                        <TouchableOpacity
                            onPress={() => setShowAll(!showAll)}
                            style={styles.moreButton}
                        >
                            <Text style={styles.moreText}>
                                {showAll ? '접기' : `더보기 (${completed.length - 3}개)`}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    titleSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
    },
    titleText: {
        fontSize: Typography.xl,
        fontWeight: '800',
        color: Colors.black,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: Typography.sm,
        fontWeight: '700',
        color: Colors.gray500,
        marginBottom: Spacing.md,
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
});