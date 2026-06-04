// FinalScheduleTab.tsx
import ScheduleCard from '@/components/group/schedule/ScheduleCard';
import EmptyState from '@/components/ui/EmptyState';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { CalendarX2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface FinalScheduleTabProps {
    meetingId: number;
}

export default function FinalScheduleTab({ meetingId }: FinalScheduleTabProps) {
    const [schedules, setSchedules] = useState([
        {
            finalScheduleId: 1,
            title: "나들이 가는날~",
            startDate: "2026-03-12",
            time: "20:00:00",
            location: "엔이 집",
        },
        {
            finalScheduleId: 2,
            title: "일정입니다람쥐~",
            startDate: "2026-06-12",
            time: "13:00:00",
            location: "장소~",
        }
    ]);

    useEffect(() => {
        // 나중에 API 연동할 때
        // const fetchSchedules = async () => {
        //     const response = await fetch(API.getFinalSchedules(meetingId));
        //     const data = await response.json();
        //     setSchedules(data);
        // };
        // fetchSchedules();
    }, [meetingId]);

    return (
        <FlatList
            // 1. 데이터
            data={schedules}

            // 2. 각 항목 렌더링
            keyExtractor={(item, index) => index.toString()} // ← 나중에 item.scheduleId.toString()으로 바꿔주기
            renderItem={({ item }) => (
                // 나중에 일정 카드
                <ScheduleCard
                    title={item.title}
                    meta={`${item.startDate} ${item.time} | ${item.location}`}
                    onEdit={() => console.log('Edit schedule:', item.finalScheduleId)}
                    onDelete={() => console.log('Delete schedule:', item.finalScheduleId)}
                />
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}

            // 3. 헤더/빈상태
            ListHeaderComponent={() => (
                <Text style={styles.titleText}>확정된 일정</Text>
            )}
            ListEmptyComponent={() => (
                <EmptyState
                    icon={
                        <View style={{ position: 'relative' }}>
                            <CalendarX2 size={40} color={Colors.gray500} />
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