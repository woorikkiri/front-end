// 네비게이터 설정 (화면 전환), 폰트로딩, 전역 상태 관리, 로그인 여부 체크 등
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import useAuth from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from "react";
import { Text, View } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

export const unstable_settings = {
  anchor: '(tabs)',
};

const toastConfig = {
    error: ({ text1 }: { text1?: string }) => (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: Radius.xl,
        padding: Spacing.md,
        paddingHorizontal: Spacing.lg,
        gap: Spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
        marginHorizontal: Spacing.lg,
      }}>
        <Ionicons name="alert-circle" size={22} color={Colors.error} />
        <Text style={{
          fontSize: Typography.sm,
          fontWeight: '600',
          color: Colors.black,
          flex: 1,
        }}>{text1}</Text>
      </View>
    )
  };
  
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { loading, userToken, hasLaunched } = useAuth();

  useEffect(() => {
    // 화면 이동 로직
    if (!loading) {
      if (userToken) { // 토큰 있으면 홈으로
        router.replace('/(tabs)/home');
      } else if (hasLaunched === false) {
        router.replace('/');
      } else {
        router.replace('/login');
      }
    }
  }, [loading, userToken, hasLaunched])

  // 로딩중이면 화면 그리지x
  if (loading) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          {/* 1. 첫 화면 (랜딩 페이지) */}
          <Stack.Screen name="index" />

          {/* 2. 로그인 화면 등록 */}
          <Stack.Screen name="login" />

          {/* 3. 회원가입 화면 등록 */}
          <Stack.Screen name="signup" />

          {/* 3. 홈 화면 */}
          <Stack.Screen name="home" />

          {/* 4. 메인 탭 화면 */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* 5. 기타 모달 창 */}
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
      <Toast config={toastConfig} />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
