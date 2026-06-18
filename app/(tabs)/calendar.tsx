// 개인 캘린더 화면
import { API } from '@/constants/api';
import { CalendarTheme, Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { useFocusEffect } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

const CARD_COLORS = ['#5ab8ac', '#7BC67A', '#fca944'];
const today = new Date().toISOString().split('T')[0];
const todayDate = new Date();

interface MarkedDay {
    date: string;
    scheduleCount: number;
}

interface DailySchedule {
    finalScheduleId: number;
    meetingId: number;
    meetingName: string;
    title: string;
    startDate: string;
    endDate: string;
    time: string | null;
    location: string | null;
}

export default function CalendarScreen() {
    const { userToken } = useAuthStore();
    const [selectDate, setSelectDate] = useState(today);
    const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth() + 1);
    const [markedDays, setMarkedDays] = useState<MarkedDay[]>([]);
    const [dailySchedules, setDailySchedules] = useState<DailySchedule[]>([]);
    const [loading, setLoading] = useState(false);

    // ───── 날짜 포맷 ─────
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        return `${date.getMonth() + 1}월 ${date.getDate()}일 ${days[date.getDay()]}요일`;
    };

    // ───── 월별 일정 조회 ─────
    const fetchMonthlySchedules = async (year: number, month: number) => {
        try {
            const res = await fetch(API.getMyCalendar(year, month), {
                headers: { 'Authorization': `Bearer ${userToken}` },
            });
            if (!res.ok) return;
            const data = await res.json();
            setMarkedDays(data);
        } catch (e) {
            console.error(e);
        }
    };

    // ───── 특정 날짜 일정 조회 ─────
    const fetchDailySchedules = async (date: string) => {
        try {
            setLoading(true);
            const res = await fetch(API.getDailySchedule(date), {
                headers: { 'Authorization': `Bearer ${userToken}` },
            });
            if (!res.ok) return;
            const data = await res.json();
            setDailySchedules(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // ───── 화면 진입 시 현재 월 + 오늘 일정 불러오기 ─────
    useFocusEffect(
        useCallback(() => {
            fetchMonthlySchedules(currentYear, currentMonth);
            fetchDailySchedules(today);
        }, [currentYear, currentMonth])
    );

    // ───── 캘린더 마킹 데이터 ─────
    const markedDates = (() => {
        const marks: any = {};
        markedDays.forEach(({ date }) => {
            marks[date] = { marked: true, dotColor: Colors.primary };
        });
        if (selectDate) {
            marks[selectDate] = {
                ...marks[selectDate],
                selected: true,
                selectedColor: selectDate === today ? Colors.primary : Colors.primaryLight,
                selectedTextColor: selectDate === today ? Colors.white : Colors.primary,
            };
        }
        return marks;
    })();

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>일정</Text>
            </View>
            <ScrollView>
                <View style={styles.calendarSection}>
                    <Calendar
                        theme={CalendarTheme}
                        onDayPress={(day) => {
                            setSelectDate(day.dateString);
                            fetchDailySchedules(day.dateString);
                        }}
                        onMonthChange={(month) => {
                            setCurrentYear(month.year);
                            setCurrentMonth(month.month);
                            fetchMonthlySchedules(month.year, month.month);
                        }}
                        markedDates={markedDates}
                    />
                </View>

                {selectDate && (
                    <View style={styles.scheduleSection}>
                        <Text style={styles.dateLabel}>{formatDate(selectDate)}</Text>

                        {loading ? (
                            <ActivityIndicator color={Colors.primary} />
                        ) : dailySchedules.length === 0 ? (
                            <Text style={styles.noScheduleText}>일정 없음</Text>
                        ) : (
                            dailySchedules.map((schedule, index) => (
                                <View
                                    key={schedule.finalScheduleId}
                                    style={[styles.scheduleCard, { borderLeftColor: CARD_COLORS[index % CARD_COLORS.length] }]}
                                >
                                    <View style={styles.scheduleTop}>
                                        <View>
                                            <Text style={styles.scheduleTitle}>{schedule.title}</Text>
                                            <Text style={styles.scheduleGroup}>{schedule.meetingName}</Text>
                                        </View>
                                        <View style={[styles.scheduleTimeBadge, { backgroundColor: CARD_COLORS[index % CARD_COLORS.length] + '20' }]}>
                                            <Text style={[styles.scheduleTimeText, { color: CARD_COLORS[index % CARD_COLORS.length] }]}>
                                                {schedule.time?.slice(0, 5) ?? ''}
                                            </Text>
                                        </View>
                                    </View>
                                    {schedule.location && (
                                        <Text style={styles.schedulePlace}>
                                            <MapPin size={12} color={Colors.gray500} /> {schedule.location}
                                        </Text>
                                    )}
                                </View>
                            ))
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.base,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTitle: {
        fontSize: Typography.lg,
        fontWeight: '800',
        color: Colors.black,
        letterSpacing: -0.5,
    },
    calendarSection: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.lg,
        marginHorizontal: Spacing.base,
        marginVertical: Spacing.md,
        padding: Spacing.md,
        overflow: 'hidden',
    },

    scheduleSection: {
        padding: Spacing.lg,
    },
    dateLabel: {
        fontSize: Typography.base,
        fontWeight: '600',
        color: Colors.gray700,
        marginBottom: Spacing.md,
    },
    scheduleCard: {
        borderRadius: Radius.lg,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
        borderLeftWidth: 3,

        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
    },
    scheduleTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    scheduleTitle: {
        fontSize: Typography.base,
        fontWeight: '600',
        color: Colors.black,
    },
    scheduleGroup: {
        fontSize: Typography.sm,
        color: Colors.gray500,
    },
    scheduleTimeBadge: {
        backgroundColor: Colors.primaryLight,
        borderRadius: Radius.lg,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
    },
    schedulePlace: {
        fontSize: Typography.sm,
        color: Colors.gray500,
    },
    scheduleTimeText: {
        fontSize: Typography.sm,
        fontWeight: '600',
        color: Colors.primary,
    },
    noScheduleText: {
        fontSize: Typography.base,
        color: Colors.gray500,
        fontStyle: 'italic',
    },
});