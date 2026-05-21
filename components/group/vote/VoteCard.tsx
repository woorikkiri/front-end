import MenuGroup from '@/components/ui/MenuGroup';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
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
    deadline: string;
    options: VoteOption[];
}

export interface VoteOption {
    optionId: number;
    text: string;    // 선택지
    count: number;   // 투표수
}

interface VoteCardProps {
    item: VoteItem;
    onPress: () => void;  // 카드 눌렸을 때 (상세 화면으로)
}

export default function VoteCard({ item, onPress }: VoteCardProps) {
    return (
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
                                label: '투표 현황',
                                onPress: () => { },
                                labelStyle: { fontSize: Typography.sm },
                                rightIcon: <Ionicons name="checkmark" size={18} color={Colors.gray500} />,
                                showChevron: false
                            },
                            { 
                                label: '투표 수정', 
                                onPress: () => { }, 
                                labelStyle: { fontSize: Typography.sm },
                                rightIcon: <Ionicons name="pencil-outline" size={18} color={Colors.gray500} />, 
                                showChevron: false 
                            },
                            { 
                                label: '공지 등록', 
                                onPress: () => { }, 
                                labelStyle: { fontSize: Typography.sm },
                                rightIcon: <Ionicons name="pin-outline" size={18} color={Colors.gray500} />, 
                                showChevron: false 
                            },
                            { 
                                label: '투표 삭제', 
                                onPress: () => { }, 
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
                        <Text style={styles.optionText}>{option.text}</Text>
                        <Text style={styles.countText}>{option.count}표</Text>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
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