import Button from '@/components/ui/Button';
import DateRangePicker from '@/components/ui/DateRangePicker';
import Header from '@/components/ui/Header';
import ServerErrorModal from '@/components/ui/ServerErrorModal';
import TextInput from '@/components/ui/TextInput';
import { API } from '@/constants/api';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import useError from '@/hooks/useError';
import { useAuthStore } from '@/store/useAuthStore';
import { formatTime } from '@/utils/date';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronDown, ChevronUp, Clock3 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateFinalScheduleScreen() {
    // ── 라우터 / 인증 ──
    const router = useRouter();
    const { meetingId, scheduleId } = useLocalSearchParams();
    const { userToken } = useAuthStore();
    const { showError } = useError();

    // ── 모드 판별 ──
    const isEdit = !!scheduleId;

    // ── 로딩 ──
    const [fetchLoading, setFetchLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    // ── 서버 오류 ──
    const [serverErrorModal, setServerErrorModal] = useState(false);

    // ── 폼 데이터 ──
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [location, setLocation] = useState('');

    // ── 시간 ──
    const [time, setTime] = useState<Date | null>(null);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // ── 수정 모드면 기존 데이터 불러오기 ──
    useEffect(() => {
        if (!isEdit) return;  // 생성 모드면 스킵
        setFetchLoading(true)

        const fetchSchedule = async () => {
            try {
                const response = await fetch(
                    API.getFinalSchedule(Number(meetingId), Number(scheduleId)), {
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });
                const data = await response.json();
                if (!response.ok) {
                    setServerErrorModal(true);
                    return;
                }
                // 기존 데이터로 폼 채우기
                setTitle(data.title);
                setStartDate(data.startDate);
                setEndDate(data.endDate);
                setLocation(data.location ?? '');
                if (data.time) {
                    // "20:00:00" → Date 객체로 변환
                    const [hours, minutes] = data.time.split(':');
                    const d = new Date();
                    d.setHours(Number(hours));
                    d.setMinutes(Number(minutes));
                    setTime(d);
                }
            } catch (e) {
                setServerErrorModal(true);
            } finally {
                setFetchLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    const handleSubmit = async () => {
        try {
            setSubmitLoading(true);

            // ── 생성 vs 수정 분기 ──
            const url = isEdit
                ? API.updateFinalSchedule(Number(meetingId), Number(scheduleId))
                : API.createFinalSchedule(Number(meetingId));

            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    startDate,
                    endDate,
                    time: time ? formatTime(time) : null,
                    location: location || null,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                showError(data.message);
                return;
            }

            router.back();
        } catch (e) {
            setServerErrorModal(true);
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            {/* 생성/수정에 따라 타이틀 변경 */}
            <Header title={isEdit ? '일정 수정' : '일정 생성'} />

            {fetchLoading ? (
                <ActivityIndicator style={{ marginTop: Spacing['2xl'] }} color={Colors.primary} />
            ) : (
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={!showTimePicker}
                >
                    <View style={styles.titleSection}>
                        <TextInput
                            label='제목'
                            placeholder='예: 나들이 가는날~'
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    <View style={styles.dateSection}>
                        <Text style={styles.dateLabel}>날짜</Text>
                        <DateRangePicker
                            startDate={startDate}
                            endDate={endDate}
                            onStartChange={setStartDate}
                            onEndChange={setEndDate}
                        />
                    </View>

                    <View style={styles.timeSection}>
                        <Text style={styles.dateLabel}>시간 (선택)</Text>
                        <TouchableOpacity
                            style={[styles.timeButton, showTimePicker && styles.timeButtonActive]}
                            onPress={() => setShowTimePicker(!showTimePicker)}
                        >
                            <Clock3 size={16} color={Colors.gray500} />
                            <Text style={styles.timeBtnValue}>
                                {time ? time.toLocaleTimeString('ko-KR', {
                                    hour: '2-digit', minute: '2-digit', hour12: false
                                }) : '시간 선택'}
                            </Text>
                            <View style={{ marginLeft: 'auto' }}>
                                {showTimePicker
                                    ? <ChevronUp size={18} color={Colors.gray500} />
                                    : <ChevronDown size={18} color={Colors.gray500} />}
                            </View>
                        </TouchableOpacity>
                        {showTimePicker && (
                            <DateTimePicker
                                value={time ?? new Date()}
                                mode="time"
                                is24Hour={true}
                                display="spinner"
                                onChange={(event, selectedTime) => {
                                    if (selectedTime) setTime(selectedTime);
                                }}
                            />
                        )}
                    </View>

                    <View style={styles.placeSection}>
                        <TextInput
                            label='장소 (선택)'
                            placeholder='예: 예은이 집'
                            value={location}
                            onChangeText={setLocation}
                            onFocus={() => setShowTimePicker(false)}
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
                            disabled={!title || !startDate || !endDate}
                            label={isEdit ? '저장' : '생성'}  // 버튼 텍스트도 변경
                            onPress={handleSubmit}
                            loading={submitLoading}
                            style={{ flex: 1 }}
                            fullWidth={false}
                        />
                    </View>
                </ScrollView>
            )}
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
    timeButton: {
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
    timeButtonActive: {
        borderColor: Colors.primary,      // 선택중이면 주황 테두리
        backgroundColor: Colors.white,
    },
    timeBtnValue: {
        fontSize: Typography.base,
        fontWeight: '600',
        color: Colors.black,
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