import VoteBottomSheet from '@/components/group/vote/VoteBottomSheet';
import VoteCard, { VoteItem } from '@/components/group/vote/VoteCard';
import VoteCreateForm from '@/components/group/vote/VoteCreateForm';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ServerErrorModal from '@/components/ui/ServerErrorModal';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import useVote from '@/hooks/useVote';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Plus, Vote } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VoteTabProps {
    meetingId: number;
}

export default function VoteTab({ meetingId }: VoteTabProps) {
    const { votes, loading, serverError, setServerError, fetchVotes, fetchVoteDetail, handleDelete, handleClose } = useVote(meetingId);

    const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
    const [editVote, setEditVote] = useState<VoteItem | null>(null);
    const [selectedVote, setSelectedVote] = useState<VoteItem | null>(null);
    const [showAll, setShowAll] = useState(false);

    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const inProgress = votes.filter(v => v.status === 'IN_PROGRESS');
    const completed = votes.filter(v => v.status === 'COMPLETED');
    const visibleCompleted = showAll ? completed : completed.slice(0, 3);

    const handleVotePress = async (vote: VoteItem) => {
        const detail = await fetchVoteDetail(vote);
        if (detail) {
            setSelectedVote(detail);
            bottomSheetRef.current?.present();
        }
    };

    if (loading) return <ActivityIndicator style={{ marginTop: Spacing['2xl'] }} color={Colors.primary} />;

    return (
        <>
            <View style={styles.container}>
                {mode === 'list' ? (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}
                    >
                        {/* 헤더 - 투표 있을 때만 */}
                        {votes.length > 0 && (
                            <View style={styles.titleSection}>
                                <Text style={styles.titleText}>투표</Text>
                                <Button
                                    label='투표 생성'
                                    onPress={() => setMode('create')}
                                    variant="warning"
                                    size="sm"
                                    fullWidth={false}
                                    icon={<Plus size={18} color={Colors.primary} />}
                                    style={{ borderRadius: Radius.full }}
                                />
                            </View>
                        )}

                        {/* 빈 상태 */}
                        {votes.length === 0 && (
                            <View style={styles.emptyWrapper}>
                                <EmptyState
                                    icon={<Vote size={35} color={Colors.primary} />}
                                    title="아직 진행되는 투표가 없어요"
                                    description="원하는 메뉴를 투표로 정해볼까요?"
                                    variant='card'
                                >
                                    <Button label="투표 생성하기" onPress={() => setMode('create')} fullWidth={false} />
                                </EmptyState>
                            </View>
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
                                            onPress={() => handleVotePress(item)}
                                            onDelete={() => handleDelete(item.voteId)}
                                            onClose={() => handleClose(item.voteId)}
                                            onEdit={() => { setEditVote(item); setMode('edit'); }}
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
                                            onPress={() => handleVotePress(item)}
                                            onDelete={() => handleDelete(item.voteId)}
                                            onClose={() => handleClose(item.voteId)}
                                            onEdit={() => { }}
                                        />
                                    ))}
                                </View>
                                {completed.length > 3 && (
                                    <TouchableOpacity onPress={() => setShowAll(!showAll)} style={styles.moreButton}>
                                        <Text style={styles.moreText}>
                                            {showAll ? '접기' : `더보기 (${completed.length - 3}개)`}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </ScrollView>
                ) : mode === 'edit' ? (
                    <VoteCreateForm
                        meetingId={meetingId}
                        isEdit={true}
                        initialData={editVote!}
                        onBack={() => { setMode('list'); fetchVotes(); }}
                    />
                ) : (
                    <VoteCreateForm
                        meetingId={meetingId}
                        onBack={() => { setMode('list'); fetchVotes(); }}
                    />
                )}

                <VoteBottomSheet
                    ref={bottomSheetRef}
                    vote={selectedVote}
                    onSuccess={fetchVotes}
                />
            </View>

            <ServerErrorModal
                visible={serverError}
                onClose={() => setServerError(false)}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: Spacing.lg },
    titleSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm, marginBottom: Spacing.lg },
    titleText: { fontSize: Typography.xl, fontWeight: '800', color: Colors.black },
    section: { marginBottom: Spacing.xl },
    sectionTitle: { fontSize: Typography.sm, fontWeight: '700', color: Colors.gray500, marginBottom: Spacing.md },
    list: { gap: Spacing.md },
    moreButton: { alignItems: 'center', paddingVertical: Spacing.md },
    moreText: { fontSize: Typography.sm, color: Colors.primary, fontWeight: '600' },
    emptyWrapper: {
        flex: 1,
        justifyContent: 'center',
    },
});