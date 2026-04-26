// VoteTab.tsx
import Button from '@/components/ui/Button';
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


interface VoteTabProps {
  meetingId: number;
}

export default function VoteTab({ meetingId }: VoteTabProps) {
  const [vote, setVote] = useState([]);
  return (
    <View style={styles.container}>
      <FlatList
        // 1. 데이터
        data={vote}

        // 2. 각 항목 렌더링
        keyExtractor={(item, index) => index.toString()} // ← 나중에 item.scheduleId.toString()으로 바꿔주기
        renderItem={({ item }) => (
          // 나중에 일정 카드
          <Text>{item}</Text>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}

        // 3. 헤더/빈상태
        ListHeaderComponent={() => (
          <Text style={styles.titleText}>투표</Text>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            icon={
              <View style={{ position: 'relative' }}>
                {/* 아이콘 바꾸기.. 마땅한게 안보임 */}
                <Ionicons name="calendar-clear-outline" size={40} color={Colors.gray500} />
                <Ionicons
                  name="close"
                  size={25}
                  color={Colors.gray500}
                  style={{ position: 'absolute', right: 8, bottom: 5 }}
                />
              </View>
            }
            title="아직 진행되는 투표가 없어요"
            description={"원하는 메뉴를 투표로 정해볼까요?"}
            variant='card'
          >
            <Button
              label="투표 생성하기"
              onPress={() => { }}
              fullWidth={false}
            />
          </EmptyState>

        )}

        // 4. 스타일/옵션
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.lg,
  },

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