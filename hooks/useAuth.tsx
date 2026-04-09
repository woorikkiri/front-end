import AsyncStorage from '@react-native-async-storage/async-storage';
// 실제 빌드할땐 expo-secure-store로 교체하기 
// AsyncStorage는 암호화가 안되서 토큰 저장하기에 좋지 않음
// Expo go에서는 expo-secure-store가 제대로 동작을 안함.

import { useEffect, useState } from "react";

export default function useAuth() {
    const [loading, setLoading] = useState(true);
    const [hasLaunched, setHasLaunched] = useState<boolean | null>(null);
    const [userToken, setUserToken] = useState<string | null>(null);

    useEffect(() => {
        const checkToken = async () => {
            const hasLaunched = await AsyncStorage.getItem('hasLaunched');

            if (!hasLaunched) { // 첫설치
                setHasLaunched(false);
            } else { // 두번째부터
                setHasLaunched(true);
                // 1. AsyncStorage에서 토큰 꺼내기
                const token = await AsyncStorage.getItem('accessToken');

                // 2. 토큰 있으면 userToken에 저장
                if (token) {
                    setUserToken(token);
                }
            }
            // 3. 확인 끝나면 loading false로
            setLoading(false);
        };
        checkToken();
    }, []);

    // 로그인
    const login = async (token: string) => {
        await AsyncStorage.setItem('accessToken', token);
        setUserToken(token);
    }

    // 로그아웃
    const logout =  async () => {
        await AsyncStorage.removeItem('accessToken');
        setUserToken(null);
    }

    return { loading, userToken, hasLaunched, login, logout };
}
