import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import TextInput from '@/components/ui/TextInput';
import { API } from '@/constants/api';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import useError from '@/hooks/useError';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

const TODAY = new Date().toISOString().split('T')[0];

export default function CreateFinalScheduleScreen() {
    const router = useRouter();
    const { meetingId } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [selecting, setSelecting] = useState<'start' | 'end' | null>(null);

    const [time, setTime] = useState<Date | null>(null);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [location, setLocation] = useState('');

    const { showError } = useError();

    const handleDateSelect = (date: string) => {
        if (selecting === 'start') {
            setStartDate(date);
            if (endDate && endDate < date) setEndDate(null);
        } else if (selecting === 'end') {
            setEndDate(date);
        }
        setShowCalendar(false);
        setSelecting(null);
    };

    // Date → "20:00:00" 변환
    const formatTime = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}:00`;
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const response = await fetch(API.createFinalSchedule(Number(meetingId)), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    startDate,
                    endDate,
                    time: time ? formatTime(time) : null,  // 선택사항
                    location: location || null,             // 선택사항
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                showError(data.message);
                return;
            }

            router.back();
        } catch (e) {
            showError('네트워크 오류가 발생했어요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <Header title='일정 생성' />
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                scrollEnabled={!showTimePicker}  // ← 타임피커 열리면 스크롤 막기
            >
                <View style={styles.titleSection}>
                    <TextInput
                        label='제목'
                        placeholder='예: 나들이 가는날~'
                        value={title}
                        onChangeText={setTitle}
                        error={''}
                    />
                </View>

                <View style={styles.dateSection}>
                    <Text style={styles.dateLabel}>날짜</Text>

                    {/* 시작/종료 날짜 버튼 */}
                    <View style={styles.dateRow}>
                        {/* 시작일 버튼 */}
                        <TouchableOpacity
                            style={[
                                styles.dateButton,
                                selecting === 'start' && styles.dateButtonActive  // 선택중이면 강조
                            ]}
                            onPress={() => {
                                // 이미 열려있고 시작일 선택중이면 닫기
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
                                <Text style={styles.dateBtnValue}>
                                    {startDate ?? '날짜 선택'}
                                </Text>
                            </View>
                            {/* 열려있으면 위 화살표, 닫혀있으면 아래 화살표 */}
                            <Ionicons
                                name={showCalendar && selecting === 'start' ? 'chevron-up' : 'chevron-down'}
                                size={16}
                                color={Colors.gray500}
                                style={{ marginLeft: 'auto' }}
                            />
                        </TouchableOpacity>

                        {/* 종료일 버튼 */}
                        <TouchableOpacity
                            style={[
                                styles.dateButton,
                                selecting === 'end' && styles.dateButtonActive
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
                                <Text style={styles.dateBtnValue}>
                                    {endDate ?? '날짜 선택'}
                                </Text>
                            </View>
                            <Ionicons
                                name={showCalendar && selecting === 'end' ? 'chevron-up' : 'chevron-down'}
                                size={16}
                                color={Colors.gray500}
                                style={{ marginLeft: 'auto' }}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* 캘린더 - showCalendar가 true일 때만 보여줌 */}
                    {showCalendar && (
                        <Calendar
                            onDayPress={(day) => handleDateSelect(day.dateString)}
                            minDate={selecting === 'end' && startDate ? startDate : TODAY}
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

                {/* 시간 섹션 */}
                <View style={styles.timeSection}>
                    <Text style={styles.dateLabel}>시간 (선택)</Text>
                    <TouchableOpacity
                        style={[styles.dateButton, showTimePicker && styles.dateButtonActive]}
                        onPress={() => setShowTimePicker(!showTimePicker)}
                    >
                        <Ionicons name="time-outline" size={16} color={Colors.gray500} />
                        <Text style={styles.dateBtnValue}>
                            {time ? time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }) : '시간 선택'}
                        </Text>
                        <Ionicons
                            name={showTimePicker ? 'chevron-up' : 'chevron-down'}
                            size={16}
                            color={Colors.gray500}
                            style={{ marginLeft: 'auto' }}
                        />
                    </TouchableOpacity>

                    {/* 시간 선택 휠 */}
                    {showTimePicker && (
                        <DateTimePicker
                            value={time ?? new Date()}  // 선택된 시간 없으면 현재 시간
                            mode="time"
                            is24Hour={true}             // 24시간제
                            display="spinner"           // 휠 스타일
                            onChange={(event, selectedTime) => {
                                if (selectedTime) setTime(selectedTime);
                            }}
                        />
                    )}
                </View>

                <View style={styles.placeSection}>
                    <TextInput
                        label='장소'
                        placeholder='예: 예은이 집'
                        value={location}
                        onChangeText={setLocation}
                        error={''}
                    />
                </View>

                <View style={styles.buttonSection}>
                    <Button
                        label='취소'
                        onPress={() => router.back()}
                        variant='cancel'
                        style={{ flex: 1 }}
                        fullWidth={false}
                    />

                    <Button
                        disabled={!title || !startDate || !endDate}  // 다 있어야 활성화
                        label='생성'
                        onPress={handleSubmit}
                        loading={loading}
                        style={{ flex: 1 }}
                        fullWidth={false}
                    />

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    container: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing['3xl'],
    },

    // ── 타이틀 ──
    titleSection: {
        marginTop: Spacing.lg,
        alignItems: "flex-start",
        gap: Spacing.xs,
    },

    // ── 날짜 섹션 ──
    dateSection: {
        marginTop: Spacing.lg,
        gap: Spacing.sm,
    },
    dateLabel: {
        fontSize: Typography.sm,
        fontWeight: '600',
        color: Colors.gray900,
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
    dateHint: {
        fontSize: Typography.xs,
        color: Colors.gray500,
    },

    timeSection: {
        marginTop: Spacing.lg,
        gap: Spacing.sm
    },

    placeSection: {
        marginTop: Spacing.lg,
        gap: Spacing.sm
    },

    // ── 버튼 ──
    buttonSection: {
        flexDirection: 'row',
        gap: Spacing.base,
        marginTop: Spacing['2xl'],
    },
});