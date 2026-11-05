import { API } from '@/constants/api';
import { useAuthStore } from '@/store/useAuthStore';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

async function registerForPushNotificationsAsync(): Promise<string | null> {
    if (!Device.isDevice) {
        console.log('실기기가 아님 (에뮬레이터에선 토큰 발급 불가)');
        return null;
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#F29A2E',
        });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('알림 권한 거부됨');
        return null;
    }

    try {
        const tokenResponse = await Notifications.getDevicePushTokenAsync();
        return tokenResponse.data;
    } catch (e) {
        console.log('푸시 토큰 발급 실패', e);
        return null;
    }
}

export default function usePushToken() {
    const { userToken } = useAuthStore();

    const registerAndSendToken = async () => {
        if (!userToken) return;

        const fcmToken = await registerForPushNotificationsAsync();
        console.log("발급받은 FCM Token:", fcmToken);
        if (!fcmToken) return;

        try {
            const response = await fetch(API.saveFcmToken, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({ fcmToken: fcmToken }),
            });

            if (!response.ok) {
                const error = await response.text();
                console.log('FCM 토큰 저장 실패');
                console.log('status:', response.status);
                console.log('response:', error);
                return;
            }
            console.log('FCM 토큰 저장 성공:', fcmToken);
        } catch (e) {
            console.log('FCM 토큰 전송 에러', e);
        }
    };

    return { registerAndSendToken };
}