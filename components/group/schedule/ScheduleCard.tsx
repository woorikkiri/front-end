import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import { Clock, MapPin, Pencil, Trash2 } from 'lucide-react-native';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";


interface ScheduleCardProps {
    title: string;
    meta: string;              // 날짜
    time?: string | null;      // 시간
    location?: string | null;  // 장소
    isPast: boolean;           // 지난 일정 여부
    showActions: boolean;      // 방장 또는 작성자만 true
    onEdit: () => void;
    onDelete: () => void;
}

export default function ScheduleCard({
    title,
    meta,
    time,
    location,
    isPast,
    showActions,
    onEdit,
    onDelete,
}: ScheduleCardProps) {
    return (
        <View style={styles.card}>
            {/* 왼쪽: 제목 + 정보 */}
            <View style={styles.info}>
                <Text style={[styles.title, isPast && styles.titlePast]}>{title}</Text>
                <Text style={[styles.subText, isPast && styles.subTextPast]}>{meta}</Text>
                {(time || location) && (
                    <View style={styles.locationRow}>
                        {location && (
                            <>
                                <MapPin size={12} color={isPast ? Colors.gray300 : Colors.gray500} />
                                <Text style={[styles.locationText, isPast && styles.subTextPast]}>{location}</Text>
                            </>
                        )}
                        {time && (
                            <>
                                <Clock size={12} color={isPast ? Colors.gray300 : Colors.gray500} />
                                <Text style={[styles.locationText, isPast && styles.subTextPast]}>{time.slice(0, 5)}</Text>
                            </>
                        )}
                    </View>
                )}
            </View>

            {/* 방장/작성자만 버튼 노출. 지난 일정은 삭제만 */}
            {showActions && (
                <View style={styles.buttons}>
                    {!isPast && (
                        <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
                            <Pencil size={18} color={Colors.primary} />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
                        <Trash2 size={18} color={Colors.error} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
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
    },
    title: {
        fontWeight: '700',
        fontSize: Typography.base,
    },
    titlePast: {
        color: Colors.gray500,
    },
    subText: {
        color: Colors.gray500,
        fontSize: Typography.sm,
    },
    subTextPast: {
        color: Colors.gray300,
    },
    buttons: {
        flexDirection: 'row',
        gap: Spacing.sm,
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

    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    locationText: {
        color: Colors.gray500,
        fontSize: Typography.sm,
    },
});