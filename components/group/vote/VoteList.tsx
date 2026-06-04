import VoteCard, { VoteItem } from '@/components/group/vote/VoteCard';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { Plus, Vote } from 'lucide-react-native';
import { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View
} from 'react-native';

interface VoteListProps {
    onCreatePress: () => void;
    onVotePress: (vote: VoteItem) => void;
}

export default function VoteList({ onCreatePress, onVotePress }: VoteListProps) {

    // 나중에 api 연동후에 바꿔야함. 지금은 테스트용 더미 데이터
    const [vote, setVote] = useState<VoteItem[]>([
        {
            voteId: 1,
            title: "점심 뭐 먹을래?",
            multipleChoice: false,
            status: 'IN_PROGRESS',
            deadline: "2026-03-12 20:00",
            remainingDays: 2,
            totalVoteCount: 3,
            participated: false,
            options: [
                { optionId: 1, content: "김밥천국", voteCount: 2 },
                { optionId: 2, content: "맥도날드", voteCount: 0 },
                { optionId: 3, content: "피자헛", voteCount: 1 },
            ]
        },
        {
            voteId: 2,
            title: "모임 장소 어디로?",
            multipleChoice: true,
            status: 'CLOSED',
            deadline: "2026-03-10 23:59",
            remainingDays: 0,
            totalVoteCount: 5,
            participated: true,
            options: [
                { optionId: 4, content: "홍대", voteCount: 3 },
                { optionId: 5, content: "강남", voteCount: 2 },
            ]
        }
    ]);

    /* 나중에 (API 연동 후)
    const [vote, setVote] = useState<VoteItem[]>([]);  // 빈 배열로 시작

    useEffect(() => {
        // 서버에서 투표 목록 가져오기
        fetch(API.getVotes(meetingId))
            .then(res => res.json())
            .then(data => setVote(data));
    }, []); */

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                // 1. 데이터
                data={vote}

                // 2. 각 항목 렌더링
                keyExtractor={(item) => item.voteId.toString()}
                renderItem={({ item }) => (
                    <VoteCard item={item} onPress={() => onVotePress(item)} />
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}

                // 3. 헤더/빈상태
                ListHeaderComponent={() => (
                    <View style={styles.titleSection}>
                        <Text style={styles.titleText}>투표</Text>
                        {vote.length > 0 &&
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
                        icon={
                            <View style={{ position: 'relative' }}>
                                <Vote size={40} color={Colors.gray500} />
                            </View>
                        }
                        title="아직 진행되는 투표가 없어요"
                        description={"원하는 메뉴를 투표로 정해볼까요?"}
                        variant='card'
                    >
                        <Button
                            label="투표 생성하기"
                            onPress={onCreatePress}
                            fullWidth={false}
                        />
                    </EmptyState>

                )}

                // 4. 스타일/옵션
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