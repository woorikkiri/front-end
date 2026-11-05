// FinalScheduleTab.tsx
import ScheduleCard from '@/components/group/schedule/ScheduleCard';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import ServerErrorModal from '@/components/ui/ServerErrorModal';
import { API } from '@/constants/api';
import { Colors, Spacing, Typography } from '@/constants/theme';
import useError from '@/hooks/useError';
import { useAuthStore } from '@/store/useAuthStore';
import { useMeetingStore } from '@/store/useMeetingStore';
import { formatFinalScheduleMeta } from '@/utils/date';
import { useFocusEffect, useRouter } from 'expo-router';
import { CalendarX2 } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface FinalSchedule {
    finalScheduleId: number;
    title: string;
    startDate: string;
    endDate: string;
    time: string | null;
    location: string | null;
    isOwner: boolean;
}

interface FinalScheduleTabProps {
    meetingId: number;
}

const TODAY = new Date().toISOString().split('T')[0];

export default function FinalScheduleTab({ meetingId }: FinalScheduleTabProps) {
    // ── 인증 ──
    const { userToken } = useAuthStore();
    const { myRole } = useMeetingStore();
    const { showError } = useError();
    const router = useRouter();

    // ── 데이터 ──
    const [schedules, setSchedules] = useState<FinalSchedule[]>([]);

    // ── 로딩 ──
    const [loading, setLoading] = useState(false);

    // ── 서버 오류 ──
    const [serverErrorModal, setServerErrorModal] = useState(false);

    // ── 삭제 모달 ──
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // ── 지난 일정 더보기 ──
    const [showAll, setShowAll] = useState(false);

    // ── 파생 값 ──
    const selectedSchedule = schedules.find(s => s.finalScheduleId === selectedId);

    // 지난 일정 여부 (endDate 없으면 startDate 기준)
    const isPast = (schedule: FinalSchedule) =>
        (schedule.endDate || schedule.startDate) < TODAY;

    // 이 카드에 수정/삭제 버튼을 보여줄지 (방장 또는 작성자)
    const canManage = (schedule: FinalSchedule) =>
        myRole === 'HOST' || schedule.isOwner === true;

    const upcomingSchedules = schedules
        .filter(s => !isPast(s))
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    // 지난 일정은 최근 것부터
    const pastSchedules = schedules
        .filter(isPast)
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

    const visiblePastSchedules = showAll ? pastSchedules : pastSchedules.slice(0, 3);

    // ── 일정 목록 조회 ──
    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const response = await fetch(API.getFinalSchedules(meetingId), {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`,
                }
            });
            const data = await response.json();

            if (!response.ok) {
                setServerErrorModal(true);
                return;
            }

            setSchedules(data);

        } catch (e) {
            setServerErrorModal(true);
        } finally {
            setLoading(false);
        }
    };
    // ── 화면 포커스될 때마다 새로고침 ──
    useFocusEffect(
        useCallback(() => {
            fetchSchedules();
        }, [])
    );

    // ── 일정 삭제 ──
    const handleDelete = async () => {
        if (!selectedId) return;

        try {
            const response = await fetch(API.deleteFinalSchedule(meetingId, selectedId), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                }
            });

            if (!response.ok) {
                const body = await response.json().catch(() => null);
                if (__DEV__) {
                    console.error('deleteFinalSchedule failed:', response.status, body);
                }
                showError('이 작업을 수행할 권한이 없습니다');
                return;
            }

            fetchSchedules();

        } catch (e) {
            if (__DEV__) {
                console.error('deleteFinalSchedule exception:', e);
            }
            showError('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요');
        }
    };

    if (loading) return <ActivityIndicator style={{ marginTop: Spacing['2xl'] }} color={Colors.primary} />;

    return (
        <>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            >
                {/* 빈 상태 */}
                {schedules.length === 0 && (
                    <EmptyState
                        icon={
                            <View style={{ position: 'relative' }}>
                                <CalendarX2 size={35} color={Colors.primary} />
                            </View>
                        }
                        title="아직 확정된 일정이 없어요"
                        description={"일정조율을 만들거나\n바로 일정을 추가할 수 있어요."}
                        variant='card'
                    />
                )}

                {/* 확정된 일정 */}
                {schedules.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>확정된 일정</Text>
                        {upcomingSchedules.length > 0 ? (
                            <View style={styles.list}>
                                {upcomingSchedules.map((item) => (
                                    <ScheduleCard
                                        key={item.finalScheduleId}
                                        title={item.title}
                                        meta={formatFinalScheduleMeta(item.startDate, item.endDate)}
                                        time={item.time}
                                        location={item.location}
                                        isPast={false}
                                        showActions={canManage(item)}
                                        onEdit={() => router.push(`/group/${meetingId}/schedule/create-final?scheduleId=${item.finalScheduleId}`)}
                                        onDelete={() => {
                                            setSelectedId(item.finalScheduleId);
                                            setDeleteModal(true);
                                        }}
                                    />
                                ))}
                            </View>
                        ) : (
                            <Text style={styles.emptyHint}>예정된 확정일정이 없어요</Text>
                        )}
                    </View>
                )}

                {/* 지난 일정 */}
                {pastSchedules.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>지난 일정</Text>
                        <View style={styles.list}>
                            {visiblePastSchedules.map((item) => (
                                <ScheduleCard
                                    key={item.finalScheduleId}
                                    title={item.title}
                                    meta={formatFinalScheduleMeta(item.startDate, item.endDate)}
                                    time={item.time}
                                    location={item.location}
                                    isPast={true}
                                    showActions={canManage(item)}
                                    onEdit={() => { }}
                                    onDelete={() => {
                                        setSelectedId(item.finalScheduleId);
                                        setDeleteModal(true);
                                    }}
                                />
                            ))}
                        </View>
                        {pastSchedules.length > 3 && (
                            <TouchableOpacity onPress={() => setShowAll(!showAll)} style={styles.moreButton}>
                                <Text style={styles.moreText}>
                                    {showAll ? '접기' : `더보기 (${pastSchedules.length - 3}개)`}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </ScrollView>

            <Modal
                visible={deleteModal}
                message={`"${selectedSchedule?.title}" 일정을\n삭제하시겠습니까?`}
                showLeftBtn={true}
                leftBtnText="취소"
                rightBtnText="삭제"
                onLeftBtnPress={() => setDeleteModal(false)}
                onRightBtnPress={() => {
                    setDeleteModal(false);
                    setTimeout(() => {
                        handleDelete();
                    }, 300);
                }}
                onBackDropPress={() => setDeleteModal(false)}
                rightBtnVariant="danger"
            />
            {/* 서버 오류 모달 */}
            <ServerErrorModal
                visible={serverErrorModal}
                onClose={() => setServerErrorModal(false)}
            />
        </>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: Typography.sm,
        fontWeight: '700',
        color: Colors.black,
        marginBottom: Spacing.md,
    },
    emptyHint: {
        fontSize: Typography.sm,
        color: Colors.gray500,
        marginTop: Spacing.xs,
        textAlign: 'center',
    },
    list: {
        gap: Spacing.md,
    },
    moreButton: {
        alignItems: 'center',
        paddingVertical: Spacing.md,
    },
    moreText: {
        fontSize: Typography.sm,
        color: Colors.primary,
        fontWeight: '600',
    },
    listContainer: {
        flexGrow: 1,
    },
});