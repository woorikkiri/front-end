import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';

interface DatePickerProps {
    label?: string;         // "시작", "마감" 등
    value: string | null;  // 선택된 날짜
    onChange: (date: string) => void;  // 날짜 선택됐을 때
    minDate?: string;      // 선택 가능한 최소 날짜
    maxDate?: string;    // 선택 가능한 최대 날짜 (마감일에 있었음!)
    markedDates?: MarkedDates;      // 선택된 날짜 표시
}

export default function DatePicker({
    label = '시작',
    value,
    onChange,
    minDate,
    maxDate,
    markedDates,
}: DatePickerProps) {
    const [showCalendar, setShowCalendar] = useState(false);

    return (
        <View>
            {/* 1. 버튼 */}
            <TouchableOpacity
                style={[
                    styles.dateButton,
                    showCalendar && styles.dateButtonActive
                ]}
                onPress={() => setShowCalendar(!showCalendar)}
            >
                <Ionicons name="calendar-outline" size={16} color={Colors.gray500} />
                <View>
                    <Text style={styles.dateBtnLabel}>{label}</Text>
                    <Text style={styles.dateBtnValue}>{value ?? '날짜 선택'}</Text>
                </View>
                <Ionicons name={showCalendar ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.gray500} />
            </TouchableOpacity>

            {/* 2. 캘린더 (showCalendar가 true일 때만) */}
            {showCalendar && (
                <Calendar
                    onDayPress={(day) => {
                        onChange(day.dateString)
                        setShowCalendar(false)
                    }}
                    minDate={minDate}
                    maxDate={maxDate}
                    markedDates={markedDates}
                    theme={{
                        todayTextColor: Colors.primary,
                        selectedDayBackgroundColor: Colors.primary,
                        arrowColor: Colors.primary,
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    dateButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        backgroundColor: Colors.inputBg,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    dateButtonActive: {
        borderColor: Colors.primary,      // 선택중이면 주황 테두리
        backgroundColor: Colors.white,
    },
    dateBtnLabel: {
        fontSize: Typography.xs,
        color: Colors.gray500,
    },
    dateBtnValue: {
        fontSize: Typography.base,
        fontWeight: '600',
        color: Colors.black,
    },
});