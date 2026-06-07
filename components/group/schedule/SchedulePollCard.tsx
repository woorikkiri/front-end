import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import { Pencil, Trash2 } from 'lucide-react-native';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

interface SchedulePollCardProps {
    title: string;
    meta: string;        // 날짜 범위
    deadline: string;    // 몇일 뒤 마감
    status: string;      // OPEN / CLOSED
    onPress: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const getStatusBadge = (deadline: string, status: string) => {
    if (status === 'CLOSED') {
        return { label: '마감', bg: '#F1EFE8', text: '#5F5E5A' };
    }
    if (deadline === '내일 마감') {
        return { label: '마감 임박', bg: '#FAEEDA', text: '#854F0B' };
    }
    return { label: '조율중', bg: '#E1F5EE', text: '#0F6E56' };
};

export default function SchedulePollCard({
    title,
    meta,
    deadline,
    status,
    onPress,
    onEdit,
    onDelete,
}: SchedulePollCardProps) {
    const badge = getStatusBadge(deadline, status);
    const isClosed = status === 'CLOSED';
    const isUrgent = deadline === '내일 마감';
    

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.info}>
                {/* 제목 + 배지 */}
                <View style={styles.titleRow}>
                    <Text style={[styles.title, isClosed && styles.titleClosed]}>
                        {title}
                    </Text>
                    <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                        <Text style={[styles.badgeText, { color: badge.text }]}>
                            {badge.label}
                        </Text>
                    </View>
                </View>

                {/* 날짜 */}
                <Text style={[styles.subText, isClosed && styles.subTextClosed]}>
                    {meta}
                </Text>

                {/* 마감 텍스트 (마감됐으면 안 보임) */}
                {!isClosed && (
                    <Text style={[styles.deadlineText, isUrgent && styles.deadlineUrgent]}>
                        {deadline}
                    </Text>
                )}
            </View>

            <View style={styles.buttons}>
                <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
                    <Pencil size={18} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
                    <Trash2 size={18} color={Colors.error} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.base,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.xl,
        ...Shadow.sm,
    },
    info: {
        flex: 1,
        gap: 2,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap',
    },
    title: {
        fontWeight: '700',
        fontSize: Typography.base,
        color: Colors.black,
    },
    titleClosed: {
        color: Colors.gray500,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: Radius.full,
    },
    badgeText: {
        fontSize: Typography.xs,
        fontWeight: '600',
    },
    subText: {
        fontSize: Typography.sm,
        color: Colors.gray500,
    },
    subTextClosed: {
        color: Colors.gray300,
    },
    deadlineText: {
        fontSize: Typography.sm,
        color: Colors.gray500,
    },
    deadlineUrgent: {
        color: '#854F0B',
    },
    buttons: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginLeft: Spacing.sm,
    },
    editBtn: {
        width: 36,
        height: 36,
        borderRadius: Radius.full,
        backgroundColor: Colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteBtn: {
        width: 36,
        height: 36,
        borderRadius: Radius.full,
        backgroundColor: Colors.errorbackground,
        alignItems: 'center',
        justifyContent: 'center',
    },
});