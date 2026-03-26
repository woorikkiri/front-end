import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import React, { forwardRef, useState } from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from 'react-native';

interface TextInputProps extends RNTextInputProps {
  label?: string; // 인풋 위에 표시되는 텍스트
  error?: string; // 에러 메시지 (에러가 있으면 빨간색으로 표시)
  hint?: string; // 도움말 메시지
  rightElement?: React.ReactNode; // 인풋 오른쪽에 들어갈 컴포넌트 (예: 비밀번호 보기 버튼)
  containerStyle?: ViewStyle; // 컨테이너 스타일
  required?: boolean; // 필수 입력 여부
  editable?: boolean;
}

const TextInput = forwardRef<RNTextInput, TextInputProps>(
  (
    {
      label,
      error,
      hint,
      rightElement,
      containerStyle,
      required,
      style,
      editable,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        )}
        <View
          style={[
            styles.inputWrap,
            focused && editable !== false && styles.inputWrapFocused,
            !!error && styles.inputWrapError,
          ]}
        >
          <RNTextInput
            ref={ref}
            style={[styles.input, editable === false && styles.inputDisabled, style]}
            placeholderTextColor={Colors.placeholder}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoCapitalize="none"
            autoCorrect={false}
            editable={editable}
            {...props}
          />
          {rightElement && (
            <View style={styles.rightElement}>{rightElement}</View>
          )}
        </View>
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : hint ? (
          <Text style={styles.hint}>{hint}</Text>
        ) : null}
      </View>
    );
  }
);

TextInput.displayName = 'TextInput';
export default TextInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: Spacing.xs,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: 2,
  },
  required: {
    color: Colors.primary,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingHorizontal: Spacing.base,
  },
  inputWrapFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  inputWrapError: {
    borderColor: Colors.error,
    backgroundColor: Colors.errorLight,
  },
  inputDisabled: {
    color: Colors.gray500,
  },
  input: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.black,
    paddingVertical: 14,
    letterSpacing: -0.2,
  },
  rightElement: {
    marginLeft: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  error: {
    fontSize: Typography.xs,
    color: Colors.error,
    marginTop: 2,
  },
  hint: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginTop: 2,
  },
});
