import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;  // 버튼 텍스트
  onPress: () => void;  // 클릭 함수
  variant?: Variant;  // 스타일 종류 'primary' | 'outline' | 'ghost' | 'danger'
  size?: Size;  // 크기 'sm' | 'md' | 'lg'
  loading?: boolean; // 로딩 스피너 여부
  disabled?: boolean; // 비활성화 여부
  style?: ViewStyle;  // 추가 스타일
  textStyle?: TextStyle;  // 텍스트 스타일
  icon?: React.ReactNode;  // 아이콘
  fullWidth?: boolean;  // 전체 너비 사용 여부 (꽉 찰지 여부)
}

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  fullWidth = true,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={[
        styles.base,  // 기본 스타일
        styles[variant], // variant에 따라 -> primary/outline/ghost/danger
        styles[`size_${size}`], // size에 따라 -> size_sm/size_md/size_lg
        fullWidth && styles.fullWidth,  // fullWidth가 true면 너비 100% 적용
        isDisabled && styles.disabled,  // disabled면 opacity: 0.45
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? Colors.white : Colors.primary}
        />
      ) : (
        <View style={styles.inner}>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text
            style={[
              styles.text,
              styles[`text_${variant}`],
              styles[`textSize_${size}`],
              textStyle,
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconWrap: {
    marginRight: 2,
  },

  // Variants
  primary: {
    backgroundColor: Colors.primary,
    ...Shadow.lg,
  },
  outline: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: Colors.error,
  },

  // Sizes
  size_sm: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderRadius: Radius.md,
  },
  size_md: {
    paddingVertical: 13,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.lg,
  },
  size_lg: {
    paddingVertical: 16,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.xl,
  },

  // Disabled
  disabled: {
    opacity: 0.45,
  },

  // Text
  text: {
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  text_primary: {
    color: Colors.white,
  },
  text_outline: {
    color: Colors.primary,
  },
  text_ghost: {
    color: Colors.primary,
  },
  text_danger: {
    color: Colors.white,
  },

  textSize_sm: {
    fontSize: Typography.sm,
  },
  textSize_md: {
    fontSize: Typography.base,
  },
  textSize_lg: {
    fontSize: Typography.md,
    fontWeight: '700',
  },
});
