// SchedulePollsTab.tsx
import SchedulePollCard from '@/components/group/schedule/SchedulePollCard';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import ServerErrorModal from '@/components/ui/ServerErrorModal';
import { API } from '@/constants/api';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { formatFinalScheduleMeta, getDaysUntilDeadline } from '@/utils/date';
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

interface SchedulePollsTabProps {
    meetingId: number;
}

interface SchedulePoll {
    schedulePollId: number;
    title: string;
    startDate: string;
    endDate: string;
    deadlineAt: string;
    status: string;
}

export default function SchedulePollsTab({ meetingId }: SchedulePollsTabProps) {
    // ── 인증 ──
    const router = useRouter();
    const { userToken } = useAuthStore();

    // ── 데이터 ──
    const [polls, setPolls] = useState<SchedulePoll[]>([]);

    // ── 로딩 ──
    const [loading, setLoading] = useState(false);

    // ── 서버 오류 ──
    const [serverErrorModal, setServerErrorModal] = useState(false);

    // ── 삭제 모달 ──
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // ── 파생 값 ──
    const selectedPoll = polls.find(p => p.schedulePollId === selectedId);

    // ── 목록 조회 ──
    const fetchPolls = async () => {
        setLoading(true);
        try {
            const response = await fetch(API.getSchedulePolls(meetingId), {
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

            const sorted = [...data.schedulePolls].sort((a, b) => {
                const aIsClosed = getDaysUntilDeadline(a.deadlineAt) === '마감됨';
                const bIsClosed = getDaysUntilDeadline(b.deadlineAt) === '마감됨';

                if (aIsClosed && !bIsClosed) return 1;
                if (!aIsClosed && bIsClosed) return -1;
                if (aIsClosed && bIsClosed) return 0;

                return new Date(a.deadlineAt).getTime() - new Date(b.deadlineAt).getTime();
            });
            setPolls(sorted);

        } catch (e) {
            setServerErrorModal(true);
        } finally {
            setLoading(false);
        }
    };
    // ── 화면 포커스될 때마다 새로고침 ──
    useFocusEffect(
        useCallback(() => {
            fetchPolls();
        }, [])
    );

    // ── 삭제 ──
    const handleDelete = async () => {
        if (!selectedId) return;
        try {
            const response = await fetch(API.deleteSchedulePoll(meetingId, selectedId), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                }
            });

            if (!response.ok) {
                setServerErrorModal(true);
                return;
            }

            fetchPolls();

        } catch (e) {
            setServerErrorModal(true);
        }
    };

    if (loading) return <ActivityIndicator style={{ marginTop: Spacing['2xl'] }} color={Colors.primary} />;

    return (
        <>
            <FlatList
                // 1. 데이터
                data={polls}

                // 2. 각 항목 렌더링
                keyExtractor={(item) => item.schedulePollId.toString()}
                renderItem={({ item }) => (
                    <SchedulePollCard
                        title={item.title}
                        meta={formatFinalScheduleMeta(item.startDate, item.endDate)}
                        deadline={getDaysUntilDeadline(item.deadlineAt)}
                        status={getDaysUntilDeadline(item.deadlineAt) === '마감됨' ? 'CLOSED' : item.status}
                        onPress={() => router.push({
                            pathname: `/group/${meetingId}/schedule/detail` as any,
                            params: { schedulePollId: item.schedulePollId }
                        })}
                        onEdit={() => router.push({
                            pathname: `/group/${meetingId}/schedule/create-poll` as any,
                            params: { schedulePollId: item.schedulePollId }
                        })}
                        onDelete={() => {
                            setSelectedId(item.schedulePollId);
                            setDeleteModal(true);
                        }}
                    />
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}

                // 3. 헤더/빈상태
                ListHeaderComponent={() => (
                    <Text style={styles.titleText}>조율중인 일정</Text>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        icon={
                            <View style={{ position: 'relative' }}>
                                <CalendarX2 size={40} color={Colors.gray500} />
                            </View>
                        }
                        title="아직 조율중인 일정이 없어요"
                        description={"새 일정조율을 만들어\n멤버들의 가능한 날짜를 받아보세요."}
                        variant='card'
                    />
                )}

                // 4. 스타일/옵션
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />
            <Modal
                visible={deleteModal}
                message={`"${selectedPoll?.title}" 조율을\n삭제하시겠습니까?`}
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