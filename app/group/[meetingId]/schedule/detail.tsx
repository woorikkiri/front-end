import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import MemberItem from '@/components/ui/MemberItem';
import ServerErrorModal from '@/components/ui/ServerErrorModal';
import { API } from '@/constants/api';
import { CalendarTheme, Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from "react-native-safe-area-context";

interface SchedulePoll {
    title: string,
    startDate: string,
    endDate: string,
    myAvailableDates: string[],
    dateCounts: DateCount[],
    memberAvailabilities: DateMember[],
    deadlineAt: string,
    status: string,
}

interface DateCount {
    count: number,
    date: string,
}

interface DateMember {
    userId: number,
    nickname: string,
    profileImageUrl: string | null,
}

export default function SchedulePollDetailScreen() {
    const { userId, userToken } = useAuthStore();

    const router = useRouter();

    const { meetingId, schedulePollId } = useLocalSearchParams();
    const [mode, setMode] = useState<'view' | 'select'>('view');
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null); // 조회 모드에서 누른 날짜
    const [schedulePoll, setSchedulePoll] = useState<SchedulePoll | null>(null);
    const [dateMembers, setDateMembers] = useState<DateMember[]>([]); // 날짜 눌렀을 때 참여자 목록
    const [serverErrorModal, setServerErrorModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // ───── 데이터 fetch ─────
    const fetchSchedulePoll = async () => {
        try {
            setLoading(true);
            const response = await fetch(API.getSchedulePoll(Number(meetingId), Number(schedulePollId)), {
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            if (!response.ok) {
                setServerErrorModal(true);
                return;
            }
            const data = await response.json();
            setSchedulePoll(data);

        } catch (e) {
            setServerErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchSchedulePoll();
        }, [])
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    const getColorByCount = (count: number) => {
        if (count >= 4) return { bg: 'rgba(242, 154, 46, 1.0)', text: Colors.white };
        if (count === 3) return { bg: 'rgba(242, 154, 46, 0.75)', text: Colors.white };
        if (count === 2) return { bg: 'rgba(242, 154, 46, 0.5)', text: Colors.black };
        return { bg: 'rgba(242, 154, 46, 0.25)', text: Colors.black };
    };

    const getMarkedDates = () => {
        const heatmap = schedulePoll?.dateCounts.reduce((acc, { date, count }) => {
            const { bg, text } = getColorByCount(count);
            return {
                ...acc,
                [date]: { selected: true, selectedColor: bg, selectedTextColor: text }
            };
        }, {} as any) ?? {};

        // 내가 이미 선택한 날짜 (서버에서 온 것)
        const myDates = mode === 'view'
            ? (schedulePoll?.myAvailableDates ?? []).reduce((acc, date) => {
                const existing = heatmap[date] ?? {};
                return {
                    ...acc,
                    [date]: { ...existing, marked: true, dotColor: '#7BC67A' }
                };
            }, {} as any)
            : {};

        // select 모드에서 새로 선택한 날짜
        const selected = selectedDates.reduce((acc, date) => {
            const existing = heatmap[date] ?? {};
            return {
                ...acc,
                [date]: { ...existing, marked: true, dotColor: '#7BC67A' }
            };
        }, {} as any);

        return { ...heatmap, ...myDates, ...selected };
    };

    const handleDayPress = async (date: string) => {
        if (mode === 'view') {
            setSelectedDate(date);
            try {
                const response = await fetch(
                    API.getDateMembers(Number(meetingId), Number(schedulePollId), date), {
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });
                const data = await response.json();
                setDateMembers(data.members ?? []);
            } catch (e) {
                setServerErrorModal(true);
            }
        } else {
            setSelectedDates(prev =>
                prev.includes(date)
                    ? prev.filter(d => d !== date)
                    : [...prev, date]
            );
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(API.submitAvailability(Number(meetingId), Number(schedulePollId)), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                body: JSON.stringify({ availableDates: selectedDates }),
            });
            if (!response.ok) {
                setServerErrorModal(true);
                return;
            }
            setMode('view');
            setSelectedDate(null);
            setDateMembers([]);
            fetchSchedulePoll();

        } catch (e) {
            setServerErrorModal(true);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <Header
                title="가능한 날짜"
            />
            <ScrollView style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.titleSection}>
                    <View>
                        <Text style={styles.title}>{schedulePoll?.title}</Text>
                        <Text style={styles.subtitle}>{mode === 'view' ? '날짜를 눌러 참여자를 확인해보세요' : '가능한 날짜를 선택해주세요'}</Text>
                    </View>
                    {mode === 'view' && (
                        <Button
                            label={schedulePoll?.myAvailableDates.length ? '수정' : '참석 가능일 선택'}
                            onPress={() => {
                                if (schedulePoll?.myAvailableDates.length) {
                                    // 수정 모드: 기존 선택 날짜로 초기화
                                    setSelectedDates(schedulePoll.myAvailableDates);
                                }
                                setMode('select');
                            }}
                            variant='warning'
                            size='sm'
                            fullWidth={false}
                            style={{ borderRadius: Radius.full }}
                        />
                    )}
                </View>

                <View style={styles.calendarSection}>
                    <Calendar
                        theme={{
                            ...CalendarTheme,
                            todayBackgroundColor: 'transparent',
                            todayTextColor: Colors.gray300,
                        }}
                        minDate={schedulePoll?.startDate}
                        maxDate={schedulePoll?.endDate}
                        onDayPress={(day) => handleDayPress(day.dateString)}
                        markedDates={getMarkedDates()}
                    />
                </View>
                {selectedDate && mode === 'view' && (
                    <View style={styles.dateMemberPanel}>
                        <View style={styles.dateText}>
                            <Text style={styles.dateLabel}>{formatDate(selectedDate)}</Text>
                            {dateMembers.length > 0 && (
                                <Text style={styles.dateLabel}> · {dateMembers.length}명 선택</Text>
                            )}
                        </View>

                        {dateMembers.length === 0 ? (
                            <Text style={styles.emptyText}>아직 선택한 멤버가 없어요</Text>
                        ) : (
                            dateMembers.map((member) => (
                                <MemberItem
                                    key={member.userId}
                                    name={member?.nickname ?? ''}
                                    profileImage={null}
                                />
                            ))
                        )}
                    </View>
                )}

                {mode === 'select' && (
                    <Button
                        label='선택 완료'
                        onPress={handleSubmit}
                    />
                )}
            </ScrollView>

            {/* 서버 오류 모달 */}
            <ServerErrorModal
                visible={serverErrorModal}
                onClose={() => setServerErrorModal(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    container: {
        paddingHorizontal: Spacing['2xl'],
        paddingBottom: Spacing['3xl'],
    },

    titleSection: {
        flexDirection: 'row',
        marginTop: Spacing.lg,
        marginBottom: Spacing['2xl'],
        alignItems: "center",
        justifyContent: "space-between",
        gap: Spacing.xs,
    },
    title: {
        fontSize: Typography['2xl'],
        fontWeight: "900",
        color: Colors.black,
    },
    subtitle: {
        fontSize: Typography.base,
        color: Colors.gray500,
    },
    calendarSection: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.lg,
        overflow: 'hidden',
        padding: Spacing['2xl'],
        marginBottom: Spacing.lg
    },

    dateMemberPanel: {
        backgroundColor: Colors.gray100,
        borderRadius: Radius.lg,
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.md,
        gap: Spacing.sm,
    },
    dateText: {
        flexDirection: 'row',
        marginBottom: Spacing.xs,
    },
    dateLabel: {
        fontSize: Typography.base,
        fontWeight: '700',
        color: Colors.black,
    },

    emptyText: {
        fontSize: Typography.sm,
        color: Colors.gray500,
        paddingVertical: Spacing.xs,
        fontStyle: 'italic',
    },
});