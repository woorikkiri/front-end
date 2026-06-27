import BoardTab from '@/components/group/board/BoardTab';
import MembersTab from '@/components/group/member/MembersTab';
import ScheduleTab from '@/components/group/schedule/ScheduleTab';
import VoteTab from '@/components/group/vote/VoteTab';
import Header from '@/components/ui/Header';
import { API } from '@/constants/api';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Pencil } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TABS = ['게시판', '일정조율', '투표', '멤버'];

export default function GroupScreen() {
  const { userToken } = useAuthStore();
  const router = useRouter();
  const { meetingId } = useLocalSearchParams();
  const [meetingName, setMeetingName] = useState("");
  const [activeTab, setActiveTab] = useState('게시판');
  const [showFab, setShowFab] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchMeeting = async () => {
        try {
          const response = await fetch(API.getMeeting(Number(meetingId)), {
            headers: {
              'Authorization': `Bearer ${userToken}`,
            }
          });
          const data = await response.json();
          setMeetingName(data.meetingName);
        } catch (error) {
          router.back();
        }
      }
      fetchMeeting();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <Header title={meetingName} />

      {/* 탭바 */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={styles.tabItem}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* 탭 컨텐츠 - View 하나로 단순하게 */}
      <View style={styles.container}>
        {activeTab === '게시판' && <BoardTab
          meetingId={Number(meetingId)}
          onHasPosts={setShowFab}
        />}
        {activeTab === '일정조율' && <ScheduleTab meetingId={Number(meetingId)} />}
        {activeTab === '투표' && <VoteTab meetingId={Number(meetingId)} />}
        {activeTab === '멤버' && <MembersTab meetingId={Number(meetingId)} meetingName={meetingName} />}
      </View>
      {/* FAB - 게시판일 때만 */}
      {activeTab === '게시판' && showFab && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push(`/group/${meetingId}/post/create`)}
        >
          <Pencil size={24} color={Colors.white} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  // ── 탭바 ──
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  tabText: {
    fontSize: Typography.md,
    fontWeight: '700',
    color: Colors.gray500,
  },
  tabTextActive: {
    color: Colors.primary,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: '60%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },

  // ── View ──
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['3xl'],
  },

  // 게시판일때만 보여지는 FAB 버튼 스타일
  fab: {
    position: 'absolute',  // 공중에 떠있는 느낌
    bottom: Spacing['5xl'],    // 아래에서 얼마나
    right: Spacing.xl,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    padding: Spacing.base,
    ...Shadow.lg,
  },
});
