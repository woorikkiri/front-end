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
    onEdit: () => void;
    onDelete: () => void;
}

export default function ScheduleCard({
    title,
    meta,
    time,
    location,
    onEdit,
    onDelete,
}: ScheduleCardProps) {
    return (
        <View style={styles.card}>
            {/* 왼쪽: 제목 + 정보 */}
            <View style={styles.info}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subText}>{meta}</Text>
                {(time || location) && (
                    <View style={styles.locationRow}>
                        {location && (
                            <>
                                <MapPin size={12} color={Colors.gray500} />
                                <Text style={styles.locationText}>{location}</Text>
                            </>
                        )}
                        {time && (
                            <>
                                <Clock size={12} color={Colors.gray500} />
                                <Text style={styles.locationText}>{time.slice(0, 5)}</Text>
                            </>
                        )}
                    </View>
                )}
            </View>

            {/* 오른쪽: 수정 + 삭제 버튼 */}
            <View style={styles.buttons}>
                <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
                    <Pencil size={18} color={Colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
                    <Trash2 size={18} color={Colors.error} />
                </TouchableOpacity>
            </View>
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
    subText: {
        color: Colors.gray500,
        fontSize: Typography.sm,
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