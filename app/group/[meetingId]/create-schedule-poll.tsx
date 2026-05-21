import Button from '@/components/ui/Button';
import DatePicker from '@/components/ui/DatePicker';
import DateRangePicker from '@/components/ui/DateRangePicker';
import Header from '@/components/ui/Header';
import TextInput from '@/components/ui/TextInput';
import { API } from '@/constants/api';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import useError from '@/hooks/useError';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TODAY = new Date().toISOString().split('T')[0];

export default function CreateSchedulePollScreen() {
    const router = useRouter();
    const { meetingId } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [deadlineDate, setDeadlineDate] = useState<string | null>(null);
    const { showError } = useError();

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
                />

                {/* 조율 기간 받는 곳 */}
                <View style={styles.dateSection}>
                    <Text style={styles.dateLabel}>조율 기간</Text>
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onStartChange={setStartDate}
                        onEndChange={setEndDate}
                    />


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