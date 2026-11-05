import Button from '@/components/ui/Button';
import DatePicker from '@/components/ui/DatePicker';
import DateRangePicker from '@/components/ui/DateRangePicker';
import Header from '@/components/ui/Header';
import MenuGroup from '@/components/ui/MenuGroup';
import Modal from '@/components/ui/Modal';
import ServerErrorModal from '@/components/ui/ServerErrorModal';
import TextInput from '@/components/ui/TextInput';
import { API } from '@/constants/api';
import { Colors, Spacing, Typography } from '@/constants/theme';
import useError from '@/hooks/useError';
import { useAuthStore } from '@/store/useAuthStore';
import { useMeetingStore } from '@/store/useMeetingStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ellipsis } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Popover from 'react-native-popover-view';
import { SafeAreaView } from 'react-native-safe-area-context';

const TODAY = new Date().toISOString().split('T')[0];

export default function CreateSchedulePollScreen() {
    // ── 라우터 / 인증 ──
    const router = useRouter();
    const { meetingId, schedulePollId } = useLocalSearchParams();
    const { userToken } = useAuthStore();
    const { myRole } = useMeetingStore();
    const { showError } = useError();

    // ── 모드 판별 ──
    const isEdit = !!schedulePollId;

    // ── 로딩 ──
    const [fetchLoading, setFetchLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    // ── 서버 오류 ──
    const [serverErrorModal, setServerErrorModal] = useState(false);

    // ── 마감 ──
    const [status, setStatus] = useState<string | null>(null);
    const [isOwner, setIsOwner] = useState(false);
    const [closeModal, setCloseModal] = useState(false);
    const [closeLoading, setCloseLoading] = useState(false);
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [pendingCloseModal, setPendingCloseModal] = useState(false);

    // ── 읽기전용 (마감된 조율은 폼 편집 불가) ──
    const isReadOnly = status === 'CLOSED';

    // ── 폼 데이터 ──
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [deadlineDate, setDeadlineDate] = useState<string | null>(null);

    // ── 수정 모드면 기존 데이터 불러오기 ──
    useEffect(() => {
        if (!isEdit) return;
        setFetchLoading(true);

        const fetchPoll = async () => {
            try {
                const response = await fetch(
                    API.getSchedulePoll(Number(meetingId), Number(schedulePollId)), {
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });
                const data = await response.json();
                if (!response.ok) {
                    setServerErrorModal(true);
                    return;
                }
                setTitle(data.title);
                setStartDate(data.startDate);
                setEndDate(data.endDate);
                setDeadlineDate(data.deadlineAt.split('T')[0]);
                setStatus(data.status);
                setIsOwner(data.isOwner);

            } catch (e) {
                setServerErrorModal(true);
            } finally {
                setFetchLoading(false);
            }
        };

        fetchPoll();
    }, []);

    // ── 생성 / 수정 제출 ──
    const handleSubmit = async () => {
        try {
            setSubmitLoading(true);

            const url = isEdit
                ? API.updateSchedulePoll(Number(meetingId), Number(schedulePollId))
                : API.createSchedulePoll(Number(meetingId));

            const method = isEdit ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
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
                setServerErrorModal(true);
                return;
            }
            router.back();
        } catch (e) {
            setServerErrorModal(true);
        } finally {
            setSubmitLoading(false);
        }
    };

    // ── 마감 처리 ──
    const handleClose = async () => {
        try {
            setCloseLoading(true);
            const response = await fetch(
                API.closeSchedulePoll(Number(meetingId), Number(schedulePollId)),
                {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${userToken}` },
                }
            );

            if (!response.ok) {
                const body = await response.json().catch(() => null);
                if (__DEV__) {
                    console.error('closeSchedulePoll failed:', response.status, body);
                }
                showError('이 작업을 수행할 권한이 없습니다');
                return;
            }

            router.back();
        } catch (e) {
            if (__DEV__) {
                console.error('closeSchedulePoll exception:', e);
            }
            showError('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요');
        } finally {
            setCloseLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

            {/* 마감 버튼 - 수정 모드 & 방장 또는 작성자 & 아직 마감 안 됐을 때만 */}
            <Header
                title={isEdit ? '일정조율 수정' : '일정조율 만들기'}
                rightElement={
                    isEdit && (myRole === 'HOST' || isOwner) && status !== 'CLOSED' ? (
                        <Popover
                            isVisible={popoverVisible}
                            onRequestClose={() => setPopoverVisible(false)}
                            onCloseComplete={() => {
                                if (pendingCloseModal) {
                                    setPendingCloseModal(false);
                                    setCloseModal(true);
                                }
                            }}
                            from={(
                                <TouchableOpacity onPress={() => setPopoverVisible(true)}>
                                    <Ellipsis size={24} color={Colors.gray500} />
                                </TouchableOpacity>
                            )}
                        >
                            <View style={styles.menu}>
                                <MenuGroup items={[{
                                    label: '일정조율 마감',
                                    onPress: () => { setPendingCloseModal(true); setPopoverVisible(false); },
                                }]} />
                            </View>
                        </Popover>
                    ) : undefined
                }
            />
            {fetchLoading ? (
                <ActivityIndicator style={{ marginTop: Spacing['2xl'] }} color={Colors.primary} />
            ) : (
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

                    {/* 읽기전용 그룹 - 마감된 조율이면 터치 막고 흐리게 처리 */}
                    <View
                        pointerEvents={isReadOnly ? 'none' : 'auto'}
                        style={isReadOnly ? styles.readOnlyGroup : undefined}
                    >
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
                                        ? { [deadlineDate]: { selected: true } }
                                        : undefined
                                }
                            />
                        </View>
                    </View>

                    {/* 버튼 */}
                    <View style={styles.buttonSection}>
                        {isReadOnly ? (
                            <Text style={styles.readOnlyHint}>마감된 일정조율이에요</Text>
                        ) : (
                            <Button
                                disabled={!title || !startDate || !endDate || !deadlineDate}
                                loading={submitLoading}
                                label={isEdit ? '저장' : '일정조율 만들기'}
                                onPress={handleSubmit}
                            />
                        )}
                    </View>
                </ScrollView>
            )}
            <ServerErrorModal
                visible={serverErrorModal}
                onClose={() => setServerErrorModal(false)}
            />

            <Modal
                visible={closeModal}
                message={"마감하면 더 이상\n응답을 받을 수 없어요.\n마감하시겠습니까?"}
                showLeftBtn={true}
                leftBtnText="취소"
                rightBtnText="마감"
                rightBtnVariant="warning"
                onLeftBtnPress={() => setCloseModal(false)}
                onRightBtnPress={() => {
                    setCloseModal(false);
                    setTimeout(() => {
                        handleClose();
                    }, 300);
                }}
                onBackDropPress={() => setCloseModal(false)}
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
    menu: {
        width: 150,
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

    // ── 읽기전용 ──
    readOnlyGroup: {
        opacity: 0.55,
    },
    readOnlyHint: {
        textAlign: 'center',
        fontSize: Typography.sm,
        color: Colors.gray300,
    },

    // ── 버튼 ──
    buttonSection: {
        gap: Spacing.sm,
        marginTop: Spacing['2xl'],
    },
});