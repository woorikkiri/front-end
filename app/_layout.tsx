// 네비게이터 설정 (화면 전환), 폰트로딩, 전역 상태 관리, 로그인 여부 체크 등
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import useAuth from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AlertCircle } from 'lucide-react-native';
import { useEffect } from "react";
import { Text, View } from 'react-native';
import { LocaleConfig } from 'react-native-calendars';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

// 앱 켜져있을 때 알림 오면 어떻게 보여줄지 (파일 최상단, 컴포넌트 밖)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,  // 알림 배너로 보여줄지
    shouldShowList: true,    // 알림 센터 목록에 넣을지
  }),
});

// 캘린더 한글 로케일 설정 (컴포넌트 밖, 앱 켜질 때 한 번만 실행되면 됨)
LocaleConfig.locales['ko'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
};
LocaleConfig.defaultLocale = 'ko';

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
      <AlertCircle size={22} color={Colors.error} />
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
  const router = useRouter();
  const { loading, hasLaunched } = useAuth();
  const { userToken } = useAuthStore();

  // 화면 이동 로직 (로그인 여부에 따라)
  useEffect(() => {
    if (!loading) {
      if (userToken) {
        router.replace('/(tabs)/home');
      } else if (hasLaunched === false) {
        router.replace('/');
      } else {
        router.replace('/login');
      }
    }
  }, [loading, userToken, hasLaunched]);

  // FCM 알림 리스너 등록
  useEffect(() => {
    // 알림 도착 시 (앱이 켜져있는 상태)
    const receivedSub = Notifications.addNotificationReceivedListener((notification) => {
      console.log('알림 도착:', notification.request.content);
    });

    // 알림 탭했을 때 (탭한 알림 데이터에 meetingId 있으면 해당 그룹으로 이동)
    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      console.log('알림 탭함:', data);

      if (data?.meetingId) {
        router.push(`/group/${data.meetingId}`);
      }
    });

    return () => {
      receivedSub.remove();
      responseSub.remove();
    };
  }, []);

  // 로딩중이면 화면 그리지x
  if (loading) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ThemeProvider value={DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            {/* 첫 화면 */}
            <Stack.Screen name="index" />

            {/* 인증 화면 */}
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />

            {/* 메인 탭 */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
        <Toast config={toastConfig} />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}