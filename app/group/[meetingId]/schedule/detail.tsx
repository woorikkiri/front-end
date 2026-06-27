import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import MemberItem from '@/components/ui/MemberItem';
import ServerErrorModal from '@/components/ui/ServerErrorModal';
import { API } from '@/constants/api';
import { CalendarTheme, Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { ChevronDown } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
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

// memberAvailabilities용
interface DateMember {
    userId: number,
    userName: string,
    availableDates: string[],
}

// getDateMembers API 응답용
interface DateMemberSimple {
    userId: number,
    nickname: string,
    profileImageUrl: string | null,
}

// getMembers API 응답용
interface Member {
    userId: number,
    nickname: string,
    role: string,
}

export default function SchedulePollDetailScreen() {
    // ───── 인증 / 라우팅 ─────
    const { userId, userToken } = useAuthStore();
    const { meetingId, schedulePollId } = useLocalSearchParams();

    // ───── 상태 ─────
    const [mode, setMode] = useState<'view' | 'select'>('view');         // 조회/선택 모드
    const [schedulePoll, setSchedulePoll] = useState<SchedulePoll | null>(null);
    const [members, setMembers] = useState<Member[]>([]);                // 모임 전체 멤버
    const [loading, setLoading] = useState(false);
    const [serverErrorModal, setServerErrorModal] = useState(false);

    // 선택 모드
    const [selectedDates, setSelectedDates] = useState<string[]>([]);   // 내가 선택한 날짜들

    // 조회 모드 - 날짜 클릭
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [dateMembers, setDateMembers] = useState<DateMemberSimple[]>([]); // 해당 날짜 선택한 멤버

    // 필수참여자
    const [selectedMember, setSelectedMember] = useState<DateMember | null>(null);
    const [showMemberDropdown, setShowMemberDropdown] = useState(false);

    // ───── 데이터 fetch ─────
    const fetchSchedulePoll = async () => {
        try {
            setLoading(true);
            const response = await fetch(API.getSchedulePoll(Number(meetingId), Number(schedulePollId)), {
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            if (!response.ok) { setServerErrorModal(true); return; }
            const data = await response.json();
            setSchedulePoll(data);
        } catch (e) {
            setServerErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    const fetchMembers = async () => {
        try {
            const res = await fetch(API.getMembers(Number(meetingId)), {
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            if (!res.ok) return;
            const data = await res.json();
            setMembers(data.members ?? []);
        } catch (e) { }
    };

    useFocusEffect(
        useCallback(() => {
            fetchSchedulePoll();
            fetchMembers();
        }, [])
    );

    // ───── 캘린더 헬퍼 ─────
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
            return { ...acc, [date]: { selected: true, selectedColor: bg, selectedTextColor: text } };
        }, {} as any) ?? {};

        const myDates = mode === 'view'
            ? (schedulePoll?.myAvailableDates ?? []).reduce((acc, date) => {
                const existing = heatmap[date] ?? {};
                return { ...acc, [date]: { ...existing, marked: true, dotColor: '#7BC67A' } };
            }, {} as any)
            : {};

        const selected = selectedDates.reduce((acc, date) => {
            const existing = heatmap[date] ?? {};
            return { ...acc, [date]: { ...existing, marked: true, dotColor: '#7BC67A' } };
        }, {} as any);

        return { ...heatmap, ...myDates, ...selected };
    };

    // ───── 이벤트 핸들러 ─────
    const handleDayPress = async (date: string) => {
        if (mode === 'view') {
            setSelectedDate(date);
            try {
                const response = await fetch(
                    API.getDateMembers(Number(meetingId), Number(schedulePollId), date),
                    { headers: { 'Authorization': `Bearer ${userToken}` } }
                );
                const data = await response.json();
                setDateMembers(data.members ?? []);
            } catch (e) {
                setServerErrorModal(true);
            }
        } else {
            setSelectedDates(prev =>
                prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
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
            if (!response.ok) { setServerErrorModal(true); return; }
            setMode('view');
            setSelectedDate(null);
            setDateMembers([]);
            setSelectedMember(null);
            fetchSchedulePoll();
        } catch (e) {
            setServerErrorModal(true);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <Header title="가능한 날짜" />

            {/* 타이틀 + 버튼 고정 영역 */}
            <View style={styles.fixedTop}>
                <Text style={styles.title}>{schedulePoll?.title}</Text>
                <Text style={styles.subtitle}>
                    {mode === 'view' ? '날짜를 눌러 참여자를 확인해보세요' : '가능한 날짜를 선택해주세요'}
                </Text>

                {mode === 'view' && (
                    <View style={styles.btnRow}>
                        <Button
                            label={schedulePoll?.myAvailableDates.length ? '수정' : '참석 가능일 선택'}
                            onPress={() => {
                                if (schedulePoll?.myAvailableDates.length) {
                                    setSelectedDates(schedulePoll.myAvailableDates);
                                }
                                setSelectedMember(null);
                                setShowMemberDropdown(false);
                                setMode('select');
                            }}
                            variant='warning'
                            size='sm'
                            fullWidth={false}
                            style={{ borderRadius: Radius.full }}
                        />

                        {/* 필수참여자 드롭다운 */}
                        <View style={styles.dropdownWrap}>
                            <TouchableOpacity
                                style={[
                                    styles.dropdownTrigger,
                                    showMemberDropdown && styles.dropdownTriggerActive
                                ]}
                                onPress={() => setShowMemberDropdown(prev => !prev)}
                            >
                                <Text style={[
                                    styles.dropdownTriggerText,
                                    showMemberDropdown && styles.dropdownTriggerTextActive
                                ]}>
                                    {selectedMember ? selectedMember.userName : '필수참여자'}
                                </Text>
                                <ChevronDown
                                    size={14}
                                    color={showMemberDropdown ? Colors.white : Colors.primary}
                                />
                            </TouchableOpacity>

                            {showMemberDropdown && (
                                <View style={styles.dropdownMenu}>
                                    {selectedMember && (
                                        <TouchableOpacity
                                            style={[styles.dropdownItem, styles.dropdownDivider]}
                                            onPress={() => {
                                                setSelectedMember(null);
                                                setShowMemberDropdown(false);
                                            }}
                                        >
                                            <Text style={[styles.dropdownItemText, { color: Colors.gray500 }]}>
                                                선택 해제
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                    {members
                                        .filter(member => member.userId !== userId)
                                        .map((member, index, arr) => (
                                            <TouchableOpacity
                                                key={member.userId}
                                                style={[
                                                    styles.dropdownItem,
                                                    index < arr.length - 1 && styles.dropdownDivider
                                                ]}
                                                onPress={() => {
                                                    const found = schedulePoll?.memberAvailabilities
                                                        .find(m => m.userId === member.userId);
                                                    setSelectedMember(found ?? {
                                                        userId: member.userId,
                                                        userName: member.nickname,
                                                        availableDates: []
                                                    });
                                                    setShowMemberDropdown(false);
                                                }}
                                            >
                                                <Text style={[
                                                    styles.dropdownItemText,
                                                    selectedMember?.userId === member.userId && styles.dropdownItemTextSelected
                                                ]}>
                                                    {member.nickname}
                                                </Text>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </View>
                            )}
                        </View>
                    </View>
                )}
            </View>

            {/* 스크롤 영역 */}
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: Spacing['3xl'] }}
            >
                {/* 캘린더 */}
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

                {/* 필수참여자 가능한 날짜 칩 */}
                {selectedMember && mode === 'view' && (
                    <View style={styles.requiredSection}>
                        <Text style={styles.requiredLabel}>
                            {selectedMember.userName}님이 가능한 날짜
                        </Text>
                        {selectedMember.availableDates.length === 0 ? (
                            <Text style={styles.emptyText}>아직 날짜를 선택하지 않았어요</Text>
                        ) : (
                            <View style={styles.chipRow}>
                                {selectedMember.availableDates.map(date => (
                                    <View key={date} style={styles.chip}>
                                        <Text style={styles.chipText}>
                                            {`${Number(date.split('-')[1])}/${Number(date.split('-')[2])}`}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                )}

                {/* 날짜 클릭 시 참여자 패널 */}
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
                                    name={member.nickname}
                                    profileImage={null}
                                />
                            ))
                        )}
                    </View>
                )}

                {/* 선택 완료 버튼 */}
                {mode === 'select' && (
                    <Button
                        label='선택 완료'
                        onPress={handleSubmit}
                    />
                )}
            </ScrollView>

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
    fixedTop: {
        paddingHorizontal: Spacing['2xl'],
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.md,
        gap: Spacing.sm,
        zIndex: 100,
        backgroundColor: Colors.white,
    },
    container: {
        paddingHorizontal: Spacing['2xl'],
    },
    title: {
        fontSize: Typography['2xl'],
        fontWeight: '900',
        color: Colors.black,
    },
    subtitle: {
        fontSize: Typography.base,
        color: Colors.gray500,
    },
    btnRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: Spacing.sm,
    },
    calendarSection: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.lg,
        overflow: 'hidden',
        padding: Spacing['2xl'],
        marginBottom: Spacing.lg,
    },
    dateMemberPanel: {
        backgroundColor: Colors.gray100,
        borderRadius: Radius.lg,
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.md,
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
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
    dropdownWrap: {
        position: 'relative',
    },
    dropdownTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 7,
        paddingHorizontal: 14,
        borderRadius: Radius.full,
        borderWidth: 1.5,
        borderColor: Colors.primary,
        backgroundColor: Colors.white,
    },
    dropdownTriggerActive: {
        backgroundColor: Colors.primary,
    },
    dropdownTriggerText: {
        fontSize: Typography.sm,
        fontWeight: '600',
        color: Colors.primary,
    },
    dropdownTriggerTextActive: {
        color: Colors.white,
    },
    dropdownMenu: {
        position: 'absolute',
        right: 0,
        top: 36,
        zIndex: 100,
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        borderWidth: 1,
        borderColor: Colors.border,
        minWidth: 140,
        ...Shadow.md,
    },
    dropdownItem: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.base,
    },
    dropdownDivider: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    dropdownItemText: {
        fontSize: Typography.base,
        fontWeight: '600',
        color: Colors.black,
    },
    dropdownItemTextSelected: {
        color: Colors.primary,
    },
    requiredSection: {
        marginBottom: Spacing.lg,
        gap: Spacing.sm,
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        padding: Spacing.base,
        borderWidth: 1.5,
        borderColor: Colors.primaryBorder,
    },
    requiredLabel: {
        fontSize: Typography.sm,
        fontWeight: '600',
        color: Colors.black,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    chip: {
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.md,
        borderRadius: Radius.full,
        backgroundColor: Colors.primaryLight,
    },
    chipText: {
        fontSize: Typography.sm,
        fontWeight: '700',
        color: Colors.primary,
    },
});