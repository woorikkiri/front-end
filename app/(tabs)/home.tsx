import { API } from "@/constants/api";
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Meeting {
  meetingId: number;
  meetingName: string;
  description: string;
  totalMemberCount: number;
  createdAt: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [groups, setGroups] = useState<Meeting[]>([]);
  const [searchText, setSearchText] = useState('');
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const { userToken } = useAuthStore();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await fetch(API.getMyMeetings, {
          headers: {
            'Authorization': `Bearer ${userToken}`,
          }
        });
        const data = await response.json();
        console.log('API 응답:', data);
        setGroups(data);
      } catch (e) {
        // 네트워크 오류 등
        console.error('모임 목록 불러오기 실패', e);
      }
    };
    fetchMeetings();
  }, []);

  // ───── 검색 필터 ─────
  const filteredGroups = groups.filter((g) =>
    g.meetingName.includes(searchText)
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
          </View>
          <Text style={styles.logoText}>우리끼리</Text>
        </View>
        <TouchableOpacity
          style={styles.bellBtn}
          onPress={() => router.push("/notifications")}
        >
          <Ionicons name="notifications-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* 모임이 하나도 없는 경우 */}
        {groups.length === 0 ? (
          <View style={styles.emptyContainer}>
            {/* 아이콘 */}
            <View style={styles.iconCircle}>
              <Ionicons name="people" size={60} color={Colors.primaryAlpha} />
            </View>

            {/* 텍스트 그룹 */}
            <View style={styles.textGroup}>
              <Text style={styles.emptyTitleText}>아직 참여 중인 모임이 없어요</Text>
              <Text style={styles.emptySubTitleText}>
                우리끼리만의 특별한 공간을 만들어볼까요?{"\n"}
                새로운 모임을 만들거나 초대코드로 참여해보세요!
              </Text>
            </View>
          </View>
        ) : (
          <View>
            {/* 참여중인 모임 n개 */}
            <Text style={styles.groupCount}>참여중인 모임 {groups.length}개</Text>

            {/* 검색창 */}
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={18} color={Colors.gray500} />
              <TextInput
                style={styles.searchInput}
                placeholder="그룹 검색"
                placeholderTextColor={Colors.placeholder}
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            {/* 그룹 목록 */}
            <View style={styles.groupList}>
              {filteredGroups.map((group) => (
                <TouchableOpacity
                  key={group.meetingId}
                  style={styles.groupCard}
                  onPress={() => router.push(`/group/${group.meetingId}`)}
                  activeOpacity={0.7}
                >
                  {/* 이니셜 아바타 */}
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {group.meetingName.charAt(0)}
                    </Text>
                  </View>

                  {/* 모임 정보 */}
                  <View style={styles.groupInfo}>
                    <Text style={styles.groupName}>{group.meetingName}</Text>
                    <Text style={styles.groupSub}>
                      멤버 {group.totalMemberCount}명
                    </Text>
                  </View>

                  {/* 화살표 */}
                  <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* + 버튼 */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowBottomSheet(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>

      {/* 바텀시트 */}
      <Modal
        visible={showBottomSheet}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBottomSheet(false)}
      >
        {/* 배경 어둡게 */}
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowBottomSheet(false)}
        />

        {/* 시트 */}
        <View style={styles.bottomSheet}>
          <TouchableOpacity
            style={styles.sheetItem}
            onPress={() => {
              setShowBottomSheet(false);
              router.push('/create-group');
            }}
          >
            <Text style={styles.sheetItemText}>방 만들기</Text>
            <Ionicons name="add" size={20} color={Colors.black} />
          </TouchableOpacity>

          <View style={styles.sheetDivider} />

          <TouchableOpacity
            style={styles.sheetItem}
            onPress={() => {
              setShowBottomSheet(false);
              router.push('/invite-code');
            }}
          >
            <Text style={styles.sheetItemText}>초대코드 입력</Text>
            <Ionicons name="key-outline" size={20} color={Colors.black} />
          </TouchableOpacity>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  // ───── 헤더 ─────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: Typography.lg,
    fontWeight: '800',
    color: Colors.black,
    letterSpacing: -0.5,
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 모임 0개
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingBottom: 80,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  textGroup: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  emptyTitleText: {
    fontSize: Typography.lg,
    fontWeight: "800",
    color: Colors.black,
    textAlign: 'center',
  },
  emptySubTitleText: {
    fontSize: Typography.base,
    color: Colors.gray500,
    textAlign: 'center',
  },

  // ───── 컨텐츠 ─────
  container: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['5xl'],
  },
  groupCount: {
    fontSize: Typography.xl,
    fontWeight: '800',
    color: Colors.black,
    marginTop: Spacing.xl,
    marginBottom: Spacing.base,
  },

  // ───── 검색창 ─────
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.gray100,
    borderRadius: Radius.full,
    marginBottom: Spacing.lg,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.black,
    padding: 0,
  },

  // ───── 그룹 목록 ─────
  groupList: {
    gap: Spacing.md,
  },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: Typography.base,
    fontWeight: '700',
    color: Colors.primary,
  },
  groupInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  groupName: {
    fontSize: Typography.base,
    fontWeight: '700',
    color: Colors.black,
  },
  groupSub: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },

  // ───── + 버튼 ─────
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.lg,
  },

  // ───── 바텀시트 ─────
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 90,
    left: Spacing['2xl'],
    right: Spacing['2xl'],
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    ...Shadow.md,
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  sheetItemText: {
    fontSize: Typography.base,
    fontWeight: '500',
    color: Colors.black,
  },
  sheetDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.xl,
  },
});
