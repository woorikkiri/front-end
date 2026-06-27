// FinalScheduleTab.tsx
import ScheduleCard from '@/components/group/schedule/ScheduleCard';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import ServerErrorModal from '@/components/ui/ServerErrorModal';
import { API } from '@/constants/api';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { formatFinalScheduleMeta } from '@/utils/date';
import { useFocusEffect, useRouter } from 'expo-router';
import { CalendarX2 } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface FinalSchedule {
    finalScheduleId: number;
    title: string;
    startDate: string;
    endDate: string;
    time: string | null;
    location: string | null;
}

interface FinalScheduleTabProps {
    meetingId: number;
}

export default function FinalScheduleTab({ meetingId }: FinalScheduleTabProps) {
    // ── 인증 ──
    const { userToken } = useAuthStore();
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

    // ── 파생 값 ──
    const selectedSchedule = schedules.find(s => s.finalScheduleId === selectedId);

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

            // 날짜 오름차순 정렬
            const sorted = [...data].sort((a, b) =>
                new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
            );

            setSchedules(sorted);  // data 대신 sorted

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
                setServerErrorModal(true);
                return;
            }

            fetchSchedules();  // 일정 목록 새로고침

        } catch (e) {
            setServerErrorModal(true);
        }
    };

    if (loading) return <ActivityIndicator style={{ marginTop: Spacing['2xl'] }} color={Colors.primary} />;

    return (
        <>
            <FlatList
                // 1. 데이터
                data={schedules}

                // 2. 각 항목 렌더링
                keyExtractor={(item) => item.finalScheduleId.toString()}
                renderItem={({ item }) => (
                    // 나중에 일정 카드
                    <ScheduleCard
                        title={item.title}
                        meta={formatFinalScheduleMeta(item.startDate, item.endDate)}
                        time={item.time}
                        location={item.location}
                        onEdit={() => router.push(`/group/${meetingId}/schedule/create-final?scheduleId=${item.finalScheduleId}`)}
                        onDelete={() => {
                            setSelectedId(item.finalScheduleId);
                            setDeleteModal(true);
                        }}
                    />
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}

                // 3. 헤더/빈상태
                ListHeaderComponent={() => (
                    schedules.length > 0 ? (
                        <Text style={styles.titleText}>확정된 일정</Text>
                    ) : null
                )}
                ListEmptyComponent={() => (
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

                // 4. 스타일/옵션
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />

            <Modal
                visible={deleteModal}
                message={`"${selectedSchedule?.title}" 일정을\n삭제하시겠습니까?`}
                showLeftBtn={true}
                leftBtnText="취소"
                rightBtnText="삭제"
                onLeftBtnPress={() => setDeleteModal(false)}
                onRightBtnPress={() => {
                    setDeleteModal(false);
                    handleDelete();
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
    titleText: {
        fontSize: Typography.xl,
        fontWeight: '800',
        color: Colors.black,
        marginBottom: Spacing.lg,
    },
    listContainer: {
        flexGrow: 1,
    },

    separator: {
        height: Spacing.md,
    },
});