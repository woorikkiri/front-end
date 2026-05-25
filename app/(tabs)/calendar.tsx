// 개인 캘린더 화면
import { CalendarTheme, Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
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

export default function CalendarScreen() {
    const [selectDate, setSelectDate] = useState(today);
    const [schedules, setSchedules] = useState([
        { id: '1', title: '스터디 모임', groupName: '우리 스터디', date: '2026-05-25', time: '19:00', place: '강남역 스터디카페' },
        { id: '2', title: '소풍', groupName: '친구들', date: '2026-05-25', time: '11:00', place: '한강공원' },
        { id: '3', title: '정기 모임', groupName: '동아리', date: '2026-05-28', time: '21:00', place: '홍대 루프탑바' },
    ]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        return `${date.getMonth() + 1}월 ${date.getDate()}일 ${days[date.getDay()]}요일`;
    };

    // 1. schedules 배열에서 markedDates 객체 만들기
    const markedDates = schedules.reduce((acc, schedule) => {
        return {
            ...acc,
            [schedule.date]: { marked: true, dotColor: Colors.primary }
        };
    }, {} as any);

    // 2. 선택한 날짜 표시
    if (selectDate) {
        markedDates[selectDate] = {
            ...markedDates[selectDate],
            selected: true,
            //  오늘이면 오늘 스타일 유지
            selectedColor: selectDate === today ? Colors.primary : Colors.primaryLight,
            selectedTextColor: selectDate === today ? Colors.white : Colors.primary,
        };
    }

    // 3. 선택한 날짜의 일정만 걸러내기
    const selectedSchedules = schedules.filter(
        (schedule) => schedule.date === selectDate
    );

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>일정</Text>
            </View>
            <ScrollView>
                <View style={styles.calendarSection}>
                    {/* 캘린더 색상 및 일정 띄우기 등 */}
                    <Calendar
                        theme={CalendarTheme}
                        onDayPress={(day) => setSelectDate(day.dateString)}
                        markedDates={{ ...markedDates }}
                    />
                </View>
                {/* 일정 선택하면 밑에 정확한 일정 내용 뜨게 만들어주기 */}
                {selectDate && (
                    <View style={styles.scheduleSection}>
                        {/* 날짜 텍스트 */}
                        <Text style={styles.dateLabel}>{formatDate(selectDate)}</Text>

                        {/* 일정 목록 */}
                        {selectedSchedules.length === 0 ? (
                            // 일정 없을 때
                            <Text style={styles.noScheduleText}>일정 없음</Text>
                        ) : (
                            // 일정 있을 때 → map으로 카드 렌더링
                            selectedSchedules.map((schedule, index) => (
                                <View
                                    key={schedule.id}
                                    style={[
                                        styles.scheduleCard,
                                        { borderLeftColor: CARD_COLORS[index % CARD_COLORS.length] }
                                    ]}
                                >
                                    <View style={styles.scheduleTop}>
                                        <View>
                                            <Text style={styles.scheduleTitle}>{schedule.title}</Text>
                                            <Text style={styles.scheduleGroup}>{schedule.groupName}</Text>
                                        </View>
                                        <View style={[
                                            styles.scheduleTimeBadge,
                                            { backgroundColor: CARD_COLORS[index % CARD_COLORS.length] + '20' }
                                        ]}>
                                            <Text style={[
                                                styles.scheduleTimeText,
                                                { color: CARD_COLORS[index % CARD_COLORS.length] }
                                            ]}>
                                                {schedule.time}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={styles.schedulePlace}><Ionicons name="location-outline" size={12} color={Colors.gray500} /> {schedule.place}</Text>
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
        // 캘린더 아래 전체 영역 패딩
        padding: Spacing.lg,
    },
    dateLabel: {
        // "5월 25일 월요일" 텍스트
        fontSize: Typography.base,
        fontWeight: '600',
        color: Colors.gray700,
        marginBottom: Spacing.md,
    },
    scheduleCard: {
        // 카드 전체 - 테두리, 둥근 모서리, 패딩
        // 왼쪽 색상 바는 borderLeftWidth + borderLeftColor
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
        // 제목이랑 시간뱃지 가로로 배치 → flexDirection: 'row'
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    scheduleTitle: {
        // 카드 제목
        fontSize: Typography.base,
        fontWeight: '600',
        color: Colors.black,
    },
    scheduleGroup: {
        // 모임명 (작은 글씨, 회색)
        fontSize: Typography.sm,
        color: Colors.gray500,
    },
    scheduleTimeBadge: {
        // 시간 뱃지 (연한 배경, 둥근 모서리)
        backgroundColor: Colors.primaryLight,
        borderRadius: Radius.lg,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
    },
    schedulePlace: {
        // 장소 (작은 글씨, 회색)
        fontSize: Typography.sm,
        color: Colors.gray500,
    },
    scheduleTimeText: {
        // 시간
        fontSize: Typography.sm,
        fontWeight: '600',
        color: Colors.primary,
    },

    noScheduleText: {
        // 일정 없을 때 텍스트
        fontSize: Typography.base,
        color: Colors.gray500,
        fontStyle: 'italic',
    },
});