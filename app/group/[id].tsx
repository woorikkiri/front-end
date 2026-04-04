import BoardTab from '@/components/group/BoardTab';
import MembersTab from '@/components/group/MembersTab';
import ScheduleTab from '@/components/group/ScheduleTab';
import VoteTab from '@/components/group/VoteTab';
import Header from '@/components/ui/Header';
import { Colors, Spacing } from '@/constants/theme';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TABS = ['게시판', '일정조율', '투표', '멤버'];

// 나중에 API로 받아올 데이터
const currentUserId = 1;
const meeting = { createdBy: 1 };
const isLeader = currentUserId === meeting.createdBy;

export default function GroupScreen() {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('게시판');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <Header title={`그룹 ${id}`} />

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

      {/* 탭 컨텐츠 - ScrollView 하나로 단순하게 */}
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === '게시판'   && <BoardTab />}
        {activeTab === '일정조율' && <ScheduleTab />}
        {activeTab === '투표'     && <VoteTab />}
        {activeTab === '멤버'     && <MembersTab isLeader={isLeader} meetingId={Number(id)} />}
      </ScrollView>
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
    fontSize: 16,
    fontWeight: 'bold',
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

  // ── ScrollView ──
  container: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['3xl'],
  },
});
