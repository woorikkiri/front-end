// SchedulePollsTab.tsx
import EmptyState from '@/components/ui/EmptyState';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function SchedulePollsTab() {
    const [polls, setPolls] = useState([]);

    return (
        <FlatList
            // 1. 데이터
            data={polls}

            // 2. 각 항목 렌더링
            keyExtractor={(item, index) => index.toString()} // ← 나중에 item.pollId.toString()으로 바꿔주기
            renderItem={({ item }) => (
                // 나중에 일정 카드
                <Text>{item}</Text>
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
                            <Ionicons name="calendar-clear-outline" size={40} color={Colors.gray500} />
                            <Ionicons
                                name="close"
                                size={25}
                                color={Colors.gray500}
                                style={{ position: 'absolute', right: 8, bottom: 5 }}
                            />
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