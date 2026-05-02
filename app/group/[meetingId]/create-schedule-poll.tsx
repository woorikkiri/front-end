import Button from '@/components/ui/Button';
import DatePicker from '@/components/ui/DatePicker';
import Header from '@/components/ui/Header';
import TextInput from '@/components/ui/TextInput';
import { API } from '@/constants/api';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import useError from '@/hooks/useError';
import { Ionicons } from '@expo/vector-icons';
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

export default function CreateSchedulePollScreen() {
    const router = useRouter();
    const { meetingId } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);    // 시작/종료용

    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [deadlineDate, setDeadlineDate] = useState<string | null>(null);
    const [selecting, setSelecting] = useState<'start' | 'end' | null>(null);

    const { showError } = useError();

    // 날짜 선택됐을 때
    const handleDateSelect = (date: string) => {
        if (selecting === 'start') {
            setStartDate(date);
            // 시작일 바꿨는데 종료일이 시작일보다 이전이면 종료일 초기화
            if (endDate && endDate < date) setEndDate(null);
            if (deadlineDate && deadlineDate >= date) setDeadlineDate(null);
        } else if (selecting === 'end') {
            setEndDate(date);
        }
        setShowCalendar(false);
        setSelecting(null);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const response = await fetch(API.createSchedulePoll(Number(meetingId)), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    startDate,
                    endDate,
                    deadlineDate,
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
            <Header title='일정조율 만들기' />
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* 타이틀 */}
                <View style={styles.titleSection}>
                    <Text style={styles.title}>조율을 만들고{"\n"}멤버들에게 공유해요</Text>
                    <Text style={styles.subTitle}>기간을 정하면 그 구간에서만 날짜를 선택할 수 있어요.</Text>
                </View>

                {/* 조율 제목 받는 곳 */}
                <TextInput
                    label='조율 제목'
                    placeholder='조율 제목을 입력해주세요.'
                    value={title}
                    onChangeText={setTitle}
                    error={''}
                />

                {/* 조율 기간 받는 곳 */}
                <View style={styles.dateSection}>
                    <Text style={styles.dateLabel}>조율 기간</Text>

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
                            // 선택된 날짜 표시
                            minDate={
                                selecting === 'end' && startDate
                                    ? startDate
                                    : TODAY
                            }
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

                    <Text style={styles.dateHint}>기간 밖 날짜는 선택할 수 없어요.</Text>
                </View>
                
                {/* 마감일이랑 조율기간 같이 네모안에 넣어둘까 아님 다 뺄까.? 아님 지금처럼? */}
                {/* 마감일 섹션 */}
                <View style={styles.deadlineSection}>
                    <Text style={styles.dateLabel}>마감일</Text>
                    <DatePicker
                        label="마감"
                        value={deadlineDate}
                        onChange={(date) => setDeadlineDate(date)}
                        minDate={TODAY}
                        maxDate={
                            startDate
                                ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() - 1))
                                    .toISOString().split('T')[0]
                                : undefined
                        }
                        markedDates={
                            deadlineDate
                                ? { [deadlineDate]: { selected: true, selectedColor: Colors.primary } }
                                : undefined
                        }
                    />
                </View>

                {/* 버튼 */}
                <View style={styles.buttonSection}>
                    <Button
                        disabled={!title || !startDate || !endDate || !deadlineDate}  // 다 있어야 활성화
                        loading={loading}
                        label='일정조율 만들기'
                        onPress={handleSubmit}
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
        marginBottom: Spacing['2xl'],
        alignItems: "flex-start",
        gap: Spacing.xs,
    },
    title: {
        fontSize: Typography['2xl'],
        fontWeight: "900",
        color: Colors.black,
    },
    subTitle: {
        fontSize: Typography.base,
        color: Colors.gray500,
    },

    // ── 날짜 섹션 ──
    dateSection: {
        marginTop: Spacing.lg,
        gap: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.xl,
        padding: Spacing.lg,
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

    deadlineSection: {
        gap: Spacing.sm,
        marginTop: Spacing.lg,
    },

    // ── 버튼 ──
    buttonSection: {
        gap: Spacing.sm,
        marginTop: Spacing['2xl'],
    },
});