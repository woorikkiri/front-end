// components/ui/NotificationCard.tsx
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type NotificationType = 'schedule' | 'vote' | 'notice' | 'invite';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;       // 기존 groupName + 날짜/이름 조합해서 넣는 용도
  isRead: boolean;
}

interface Props {
  item: NotificationItem;
  mode?: 'list' | 'banner';
  onPress?: (id: string) => void;
  onDismiss?: () => void;
}

const TYPE_ICON: Record<NotificationType, keyof typeof Ionicons.glyphMap> = {
  schedule: 'alarm-outline',
  vote:     'stats-chart-outline',
  notice:   'megaphone-outline',
  invite:   'people-outline',
};

export default function NotificationCard({ item, mode = 'list', onPress, onDismiss }: Props) {
  const isBanner = mode === 'banner';
  const isNew = !item.isRead;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isNew && styles.containerNew,
        isBanner && styles.containerBanner,
      ]}
      onPress={() => onPress?.(item.id)}
      activeOpacity={0.7}
    >
      {/* 아이콘 영역 */}
      <View style={[styles.iconWrap, isNew && styles.iconWrapNew]}>
        <Ionicons
          name={TYPE_ICON[item.type]}
          size={20}
          color={Colors.primary}
        />
      </View>

      {/* 텍스트 영역 */}
      <View style={styles.content}>
        <Text
          style={[styles.title, isNew && styles.titleNew]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text style={styles.body} numberOfLines={isBanner ? 1 : 2}>
          {item.body}
        </Text>
      </View>

      {/* 읽지 않음 뱃지 */}
      {isNew && (
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
          <Ionicons name="close" size={18} color={Colors.gray500} />
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
    marginHorizontal: Spacing.base,
    marginVertical: Spacing.xs,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  containerNew: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  containerBanner: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.sm,
    ...Shadow.md,
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
    backgroundColor: '#FDE8C8',  // primaryLight보다 살짝 진한 오렌지 틴트
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
  body: {
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