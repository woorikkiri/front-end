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

const TODAY = new Date().toISOString().split('T')[0];

interface DateRangePickerProps {
    startDate: string | null;
    endDate: string | null;
    onStartChange: (date: string) => void;
    onEndChange: (date: string) => void;
    minDate?: string;
}

export default function DateRangePicker({
    startDate,
    endDate,
    onStartChange,
    onEndChange,
    minDate = TODAY,
}: DateRangePickerProps) {
    const [showCalendar, setShowCalendar] = useState(false);
    const [selecting, setSelecting] = useState<'start' | 'end' | null>(null);

    const handleDateSelect = (date: string) => {
        if (selecting === 'start') {
            onStartChange(date);
            if (endDate && endDate < date) onEndChange('');
        } else if (selecting === 'end') {
            onEndChange(date);
        }
        setShowCalendar(false);
        setSelecting(null);
    };

    return (
        <View style={styles.container}>
            {/* 1. 시작/종료 버튼 */}
            <View style={styles.dateRow}>
                {/* 시작 버튼 */}
                <TouchableOpacity
                    style={[
                        styles.dateButton,
                        selecting === 'start' && showCalendar && styles.dateButtonActive
                    ]}
                    onPress={() => {
                        if (showCalendar && selecting === 'start') {
                            setShowCalendar(false);
                            setSelecting(null);
                        } else {
                            setSelecting('start');
                            setShowCalendar(true);
                        }
                    }}
                >
                    <Ionicons name="calendar-outline" size={16} color={Colors.gray500} />
                    <View>
                        <Text style={styles.dateBtnLabel}>시작</Text>
                        <Text style={styles.dateBtnValue}>{startDate ?? '날짜 선택'}</Text>
                    </View>
                    <Ionicons
                        name={showCalendar && selecting === 'start' ? 'chevron-up' : 'chevron-down'}
                        size={16}
                        color={Colors.gray500}
                        style={{ marginLeft: 'auto' }}
                    />
                </TouchableOpacity>

                {/* 종료 버튼 */}
                <TouchableOpacity
                    style={[
                        styles.dateButton,
                        selecting === 'end' && showCalendar && styles.dateButtonActive
                    ]}
                    onPress={() => {
                        if (showCalendar && selecting === 'end') {
                            setShowCalendar(false);
                            setSelecting(null);
                        } else {
                            setSelecting('end');
                            setShowCalendar(true);
                        }
                    }}
                >
                    <Ionicons name="calendar-outline" size={16} color={Colors.gray500} />
                    <View>
                        <Text style={styles.dateBtnLabel}>종료</Text>
                        <Text style={styles.dateBtnValue}>{endDate ?? '날짜 선택'}</Text>
                    </View>
                    <Ionicons
                        name={showCalendar && selecting === 'end' ? 'chevron-up' : 'chevron-down'}
                        size={16}
                        color={Colors.gray500}
                        style={{ marginLeft: 'auto' }}
                    />
                </TouchableOpacity>
            </View>

            {/* 2. 캘린더 */}
            {showCalendar && (
                <Calendar
                    onDayPress={(day) => handleDateSelect(day.dateString)}
                    minDate={selecting === 'end' && startDate ? startDate : minDate}
                    markedDates={{
                        ...(startDate ? { [startDate]: { selected: true, selectedColor: Colors.primary } } : {}),
                        ...(endDate ? { [endDate]: { selected: true, selectedColor: Colors.primary } } : {}),
                    }}
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
    container: {
        gap: Spacing.sm,
    },
    dateRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
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
        borderColor: Colors.primary,
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