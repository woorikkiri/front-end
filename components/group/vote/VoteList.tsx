import VoteCard, { VoteItem } from '@/components/group/vote/VoteCard';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { Plus, Vote } from 'lucide-react-native';
import {
    FlatList,
    StyleSheet,
    Text,
    View
} from 'react-native';

interface VoteListProps {
    votes: VoteItem[];
    onCreatePress: () => void;
    onVotePress: (vote: VoteItem) => void;
    onDelete: () => void;
}

export default function VoteList({ votes, onCreatePress, onVotePress, onDelete }: VoteListProps) {
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={votes}
                keyExtractor={(item) => item.voteId.toString()}
                renderItem={({ item }) => (
                    <VoteCard
                        item={item}
                        onPress={() => onVotePress(item)}
                        onDelete={onDelete}
                    />
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListHeaderComponent={() => (
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
                )}
                ListEmptyComponent={() => (
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
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    titleSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: Spacing.sm,
        marginBottom: Spacing.lg
    },
    titleText: {
        fontSize: Typography.xl,
        fontWeight: '800',
        color: Colors.black,
    },
    separator: {
        height: Spacing.md,
    },
});