// components/ui/NotificationCard.tsx
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import { formatTimeAgo } from '@/utils/date';
import { CalendarCheck2, Megaphone, Vote, X } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type NotificationType = 'schedule' | 'vote' | 'notice';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  groupName: string;
  isRead: boolean;
  createdAt: string;
}

interface Props {
  item: NotificationItem;
  mode?: 'list' | 'banner';
  onPress?: (id: string) => void;
  onDismiss?: () => void;
}

const TYPE_ICON = {
  schedule: <CalendarCheck2 size={20} color={Colors.primary} />,
  vote: <Vote size={20} color={Colors.primary} />,
  notice: <Megaphone size={20} color={Colors.primary} />,
};

export default function NotificationCard({ item, mode = 'list', onPress, onDismiss }: Props) {
  const isBanner = mode === 'banner';
  const isNew = !item.isRead;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        !isBanner && styles.containerList,  // list면 구분선
        isBanner && styles.containerBanner, // banner면 네모
        isNew && styles.containerNew,
      ]}
      onPress={() => onPress?.(item.id)}
      activeOpacity={0.7}
    >
      {/* 아이콘 영역 */}

      <View style={[styles.iconWrap, isNew && styles.iconWrapNew]}>
        {TYPE_ICON[item.type]}
      </View>


      {/* 텍스트 영역 */}
      <View style={styles.content}>
        <Text style={[styles.title, isNew && styles.titleNew]} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{item.groupName}</Text>
          <Text style={styles.meta}> · </Text>
          <Text style={styles.meta}>{formatTimeAgo(item.createdAt)}</Text>
        </View>
      </View>

      {/* 읽지 않음 뱃지 */}
      {isNew && isBanner && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>N</Text>
        </View>
      )}

      {/* 배너 닫기 버튼 */}
      {isBanner && onDismiss && (
        <TouchableOpacity
          onPress={onDismiss}
          style={styles.dismissBtn}
          hitSlop={8}
        >
          <X size={18} color={Colors.gray500} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  containerList: {
    // list일 때만 구분선
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  containerBanner: {
    // banner일 때만 네모
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.sm,
    ...Shadow.md,
  },
  containerNew: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },

  // 아이콘
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapNew: {
    backgroundColor: '#FDE8C8',
  },

  // 텍스트
  content: {
    flex: 1,
    gap: Spacing.xs,
  },
  title: {
    fontSize: Typography.base,
    color: Colors.gray700,
    fontWeight: '400',
  },
  titleNew: {
    color: Colors.black,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meta: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },

  // N 뱃지
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: Typography.xs,
    fontWeight: '700',
  },

  // 배너 닫기
  dismissBtn: {
    padding: Spacing.xs,
    justifyContent: 'center',
  },
});