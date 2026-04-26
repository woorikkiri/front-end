// ScheduleTab.tsx
import FinalScheduleTab from '@/components/group/schedule/FinalScheduleTab';
import SchedulePollsTab from '@/components/group/schedule/SchedulePollsTab';
import Button from '@/components/ui/Button';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useRouter } from "expo-router";
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const TABS = ['확정일정', '조율중'];

interface ScheduleTabProps {
  meetingId: number;
}

export default function ScheduleTab({ meetingId }: ScheduleTabProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('확정일정');

  return (
    <View style={styles.container}>
      {/* 탭 버튼 */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>


      {/* 탭 내용 */}
      <View style={styles.content}>
        {activeTab === '확정일정' && <FinalScheduleTab meetingId={meetingId} />}
        {activeTab === '조율중' && <SchedulePollsTab meetingId={meetingId}/>}
      </View>

      {/* 하단 버튼 */}
      <View style={styles.buttonSection}>
        <Button
          label="일정 생성"
          onPress={() => {router.push(`/group/${meetingId}/create-final-schedule`)}}
          variant='cancel'
          style={{flex: 1}}
        />
        <Button
          label="일정조율 만들기"
          onPress={() => {router.push(`/group/${meetingId}/create-schedule-poll`)}}
          style={{flex: 1}}
        />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.lg,
  },

  // ── 탭바 ──
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.gray200,
    borderRadius: Radius['2xl'],
    padding: Spacing.xs
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
  tabItemActive: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
  },
  tabTextActive: {
    borderRadius: Radius['2xl'],
    color: Colors.black,
  },

  content: {
    marginTop: Spacing.lg,
  },

  buttonSection: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
});