import MenuGroup from '@/components/ui/MenuGroup';
import Modal from '@/components/ui/Modal';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useMeetingStore } from '@/store/useMeetingStore';
import { getDaysUntilDeadline } from '@/utils/date';
import { CalendarClock, Ellipsis, Pencil, PointerOff, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Popover from 'react-native-popover-view';

export interface VoteItem {
    voteId: number;
    title: string;
    multipleChoice: boolean;
    anonymous: boolean;
    status: 'IN_PROGRESS' | 'COMPLETED';
    deadline: string;
    remainingDays: number;
    totalVoteCount: number;
    participantCount: number;
    participated: boolean;
    myOptionIds?: number[];
    owner: boolean;
    options: VoteOption[];
}

export interface VoteOption {
    optionId: number;
    content: string;
    voteCount: number;
}

interface VoteCardProps {
    item: VoteItem;
    onPress: () => void;
    onDelete: () => void;
    onClose: () => void;
    onEdit: () => void;
}

export default function VoteCard({ item, onPress, onDelete, onClose, onEdit }: VoteCardProps) {
    const { myRole } = useMeetingStore();
    const canManage = item.owner || myRole === 'HOST';

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCloseModal, setShowCloseModal] = useState(false);
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [pendingDeleteModal, setPendingDeleteModal] = useState(false);
    const [pendingCloseModal, setPendingCloseModal] = useState(false);

    const maxCount = item.options.reduce((max, o) => o.voteCount > max ? o.voteCount : max, 0);
    const topOptions = item.options.filter(o => o.voteCount === maxCount);

    const handleDeletePress = async () => {
        setShowDeleteModal(false);
        setPopoverVisible(false);
        await new Promise(resolve => setTimeout(resolve, 300));
        onDelete();
    };

    const handleClosePress = async () => {
        setShowCloseModal(false);
        await new Promise(resolve => setTimeout(resolve, 300));
        onClose();
    };

    const handleEditPress = async () => {
        setPopoverVisible(false);
        await new Promise(resolve => setTimeout(resolve, 300));
        onEdit();
    };

    return (
        <>
            <TouchableOpacity onPress={onPress} style={styles.card}>
                {item.status === 'COMPLETED' ? (
                    <View style={{ gap: Spacing.sm }}>
                        <View style={styles.titleRow}>
                            <Text style={styles.title}>Q. {item.title}</Text>
                            {canManage && (
                                <Popover
                                    isVisible={popoverVisible}
                                    onRequestClose={() => setPopoverVisible(false)}
                                    onCloseComplete={() => {
                                        if (pendingDeleteModal) { setPendingDeleteModal(false); setShowDeleteModal(true); }
                                        if (pendingCloseModal) { setPendingCloseModal(false); setShowCloseModal(true); }
                                    }}
                                    arrowSize={{ width: 0, height: 0 }}
                                    backgroundStyle={{ backgroundColor: 'transparent' }}
                                    from={(
                                        <TouchableOpacity onPress={() => setPopoverVisible(true)}>
                                            <Ellipsis size={20} color={Colors.gray500} />
                                        </TouchableOpacity>
                                    )}
                                >
                                    <View style={styles.menu}>
                                        <MenuGroup items={[{
                                            label: '투표 삭제',
                                            onPress: () => { setPendingDeleteModal(true); setPopoverVisible(false); },
                                            labelStyle: { fontSize: Typography.sm, color: Colors.error },
                                            rightIcon: <Trash2 size={18} color={Colors.error} />,
                                            showChevron: false
                                        }]} />
                                    </View>
                                </Popover>
                            )}
                        </View>
                        <View style={{ alignItems: 'center', gap: Spacing.sm }}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>1위</Text>
                            </View>
                            {topOptions.map((option) => (
                                <Text key={option.optionId} style={styles.topOptionText}>
                                    {option.content}
                                </Text>
                            ))}
                        </View>
                    </View>
                ) : (
                    <View style={{ gap: Spacing.md }}>
                        <View style={styles.deadlineRow}>
                            <CalendarClock size={16} color={'gray'} />
                            <Text style={styles.deadlineText}>{getDaysUntilDeadline(item.deadline)}</Text>
                        </View>
                        <View style={styles.titleRow}>
                            <Text style={styles.title}>{item.title}</Text>
                            {canManage && (
                                <Popover
                                    isVisible={popoverVisible}
                                    onRequestClose={() => setPopoverVisible(false)}
                                    onCloseComplete={() => {
                                        if (pendingDeleteModal) { setPendingDeleteModal(false); setShowDeleteModal(true); }
                                        if (pendingCloseModal) { setPendingCloseModal(false); setShowCloseModal(true); }
                                    }}
                                    arrowSize={{ width: 0, height: 0 }}
                                    backgroundStyle={{ backgroundColor: 'transparent' }}
                                    from={(
                                        <TouchableOpacity onPress={() => setPopoverVisible(true)}>
                                            <Ellipsis size={20} color={Colors.gray500} />
                                        </TouchableOpacity>
                                    )}
                                >
                                    <View style={styles.menu}>
                                        <MenuGroup items={[
                                            ...(item.totalVoteCount === 0 ? [{
                                                label: '투표 수정',
                                                onPress: handleEditPress,
                                                labelStyle: { fontSize: Typography.sm },
                                                rightIcon: <Pencil size={18} color={Colors.gray500} />,
                                                showChevron: false
                                            }] : []),
                                            {
                                                label: '투표 종료',
                                                onPress: () => { setPendingCloseModal(true); setPopoverVisible(false); },
                                                labelStyle: { fontSize: Typography.sm },
                                                rightIcon: <PointerOff size={18} color={Colors.gray500} />,
                                                showChevron: false
                                            },
                                            {
                                                label: '투표 삭제',
                                                onPress: () => { setPendingDeleteModal(true); setPopoverVisible(false); },
                                                labelStyle: { fontSize: Typography.sm, color: Colors.error },
                                                rightIcon: <Trash2 size={18} color={Colors.error} />,
                                                showChevron: false
                                            },
                                        ]} />
                                    </View>
                                </Popover>
                            )}
                        </View>
                        <View style={styles.optionsContainer}>
                            {item.options.map((option) => (
                                <View key={option.optionId} style={styles.optionRow}>
                                    <Text style={styles.optionText}>{option.content}</Text>
                                    <Text style={styles.countText}>{option.voteCount}표</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </TouchableOpacity>

            <Modal
                visible={showDeleteModal}
                message='투표를 삭제하시겠습니까?'
                rightBtnText='삭제'
                onLeftBtnPress={() => setShowDeleteModal(false)}
                onRightBtnPress={handleDeletePress}
                rightBtnVariant='danger'
            />
            <Modal
                visible={showCloseModal}
                message='투표를 종료하시겠습니까?'
                rightBtnText='종료'
                onLeftBtnPress={() => setShowCloseModal(false)}
                onRightBtnPress={handleClosePress}
                rightBtnVariant='warning'
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
    },

    badge: {
        backgroundColor: Colors.primary,
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.xs,
    },
    badgeText: {
        color: Colors.white,
        fontWeight: '700',
        fontSize: Typography.sm,
    },
    topOptionText: {
        fontSize: Typography.base,
        fontWeight: '600',
        color: Colors.black,
    },
});