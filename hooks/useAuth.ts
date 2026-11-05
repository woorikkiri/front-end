import AsyncStorage from '@react-native-async-storage/async-storage';
// 실제 빌드할땐 expo-secure-store로 교체하기 
// AsyncStorage는 암호화가 안되서 토큰 저장하기에 좋지 않음
// Expo go에서는 expo-secure-store가 제대로 동작을 안함.
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from "react";

export default function useAuth() {
    const [loading, setLoading] = useState(true);
    const [hasLaunched, setHasLaunched] = useState<boolean | null>(null);
    const { login, logout, userToken } = useAuthStore();

    useEffect(() => {
        const checkToken = async () => {
            //await AsyncStorage.clear();
            //await AsyncStorage.removeItem('hasLaunched');
            const hasLaunched = await AsyncStorage.getItem('hasLaunched');

            if (!hasLaunched) { // 첫설치
                setHasLaunched(false);
            } else { // 두번째부터
                setHasLaunched(true);
                // AsyncStorage에서 토큰 불러오기
                const token = await AsyncStorage.getItem('accessToken');
                const storedUserId = await AsyncStorage.getItem('userId');

                // AsyncStorage에 저장된 토큰으로 자동 로그인
                if (token) {
                    await login(token, Number(storedUserId));
                }
            }
            // 확인 끝나면 loading false로
            setLoading(false);
        };
        checkToken();
    }, []);

    return { loading, hasLaunched };
}