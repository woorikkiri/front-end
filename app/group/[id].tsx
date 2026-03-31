// app/group/[id].tsx
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

export default function GroupScreen() {
  const { id } = useLocalSearchParams();

  const [activeTab, setActiveTab] = useState('게시판');
  const TABS = ['게시판', '일정조율', '투표', '멤버'];

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
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.tabTextActive
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* 탭 내용 */}
        {/* id별로 넘겨줘야함. */}
        {activeTab === '게시판' && <BoardTab />}
        {activeTab === '일정조율' && <ScheduleTab />}
        {activeTab === '투표' && <VoteTab />}
        {activeTab === '멤버' && <MembersTab />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    paddingHorizontal: Spacing['lg'],
    paddingBottom: Spacing['3xl'],
  },
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
  },
  tabTextActive: {
    color: Colors.primary,
  }
})