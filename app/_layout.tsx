// 네비게이터 설정 (화면 전환), 폰트로딩, 전역 상태 관리, 로그인 여부 체크 등
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
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
  );
}
