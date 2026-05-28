import MenuGroup from '@/components/ui/MenuGroup';
import Modal from '@/components/ui/modal';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Popover from 'react-native-popover-view';

export interface VoteItem {
    voteId: number;
    title: string;
    multipleChoice: boolean;
    status: 'IN_PROGRESS' | 'CLOSED';
    deadline: string;
    remainingDays: number;
    totalVoteCount: number;
    participated: boolean; // 내가 투표했는지 여부
    options: VoteOption[];
}

export interface VoteOption {
    optionId: number;
    content: string;    // 선택지
    voteCount: number;   // 투표수
    voters?: string[]; // 투표한 사람 목록 (나중에 API에서 받아올 때 추가)
}

interface VoteCardProps {
    item: VoteItem;
    onPress: () => void;  // 카드 눌렸을 때 (상세 화면으로)
}

export default function VoteCard({ item, onPress }: VoteCardProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    return (
        <>
            <TouchableOpacity onPress={onPress} style={styles.card}>
                {/* 1. 마감일 */}
                <View style={styles.deadlineRow}>
                    <Ionicons name="time-outline" size={16} color={'gray'} />
                    <Text style={styles.deadlineText}>{item.deadline}</Text>
                </View>


                {/* 2. 제목 */}
                <View style={styles.titleRow}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Popover
                        arrowSize={{ width: 0, height: 0 }}
                        backgroundStyle={{ backgroundColor: 'transparent' }}
                        from={(
                            <TouchableOpacity>
                                <Ionicons name="ellipsis-horizontal" size={20} color={Colors.gray500} />
                            </TouchableOpacity>
                        )}
                    >
                        <View style={styles.menu}>
                            <MenuGroup items={[
                                {
                                    label: '투표 수정',
                                    onPress: () => { },
                                    labelStyle: { fontSize: Typography.sm },
                                    rightIcon: <Ionicons name="pencil-outline" size={18} color={Colors.gray500} />,
                                    showChevron: false
                                },
                                {
                                    label: '투표 삭제',
                                    onPress: () => setShowDeleteModal(true),
                                    labelStyle: { fontSize: Typography.sm, color: Colors.error },
                                    rightIcon: <Ionicons name="trash-outline" size={18} color={Colors.error} />,
                                    showChevron: false
                                },
                            ]} />
                        </View>
                    </Popover>
                </View>

                {/* 3. 선택지 목록 */}
                <View style={styles.optionsContainer}>
                    {item.options.map((option) => (
                        <View key={option.optionId} style={styles.optionRow}>
                            <Text style={styles.optionText}>{option.content}</Text>
                            <Text style={styles.countText}>{option.voteCount}표</Text>
                        </View>
                    ))}
                </View>
            </TouchableOpacity>
            <Modal
                visible={showDeleteModal}
                message='투표를 삭제하시겠습니까?'
                rightBtnText='삭제'
                onLeftBtnPress={() => setShowDeleteModal(false)}
                onRightBtnPress={() => {
                    setShowDeleteModal(false);
                }}
                rightBtnVariant='danger'
            />
        </>
    );
}

const styles = StyleSheet.create({
    deadlineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    deadlineText: {
        fontSize: Typography.sm,
        color: Colors.gray500,
        fontWeight: '700',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: Typography.base,
        fontWeight: '700',
    },
    menu: {
        width: 160,
        borderRadius: Radius.lg,
        overflow: 'hidden',
    },
    card: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.xl,
        padding: Spacing.lg,
        gap: Spacing.md,
        backgroundColor: Colors.white,
    },
    optionsContainer: {
        gap: Spacing.sm,
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.gray100,
        borderRadius: Radius.lg,
        padding: Spacing.md,
    },
    optionText: {
        fontSize: Typography.base,
        color: Colors.gray900,
    },
    countText: {
        backgroundColor: Colors.primaryLight,
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        fontSize: Typography.sm,
        color: Colors.primary,
        fontWeight: '600',
    }
});