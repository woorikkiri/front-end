import Button from '@/components/ui/Button';
import MenuGroup, { MenuItem } from '@/components/ui/MenuGroup';
import Modal from '@/components/ui/modal';
import ProfileCard from '@/components/ui/ProfileCard';
import { API } from "@/constants/api";
import { Colors, Spacing, Typography } from '@/constants/theme';
import useAuth from '@/hooks/useAuth';
import { useRouter } from "expo-router";
//import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function MyPageScreen() {
    const router = useRouter();
    const { logout, userToken} = useAuth();

    // API 연동 후 GET /api/users/me 응답으로 교체 (현재 임시 데이터)
    const [user] = useState({
        name: 'Minji',
        email: 'minji@example.com',
        profileImage: null as string | null,
    });

    const menuItems: MenuItem[] = [
        { label: '내 정보 수정', onPress: () => router.push('/mypage/edit') },
        { label: '알림 설정', onPress: () => router.push('/mypage/notification-settings') },
        { label: '비밀번호 변경', onPress: () => router.push('/mypage/change-password') },
    ];

    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    
    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>마이페이지</Text>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <ProfileCard
                    name={user.name}
                    email={user.email}
                    profileImage={user.profileImage}
                    backgroundColor={Colors.primaryLight}
                />

                <MenuGroup items={menuItems} />

                <Button
                    label='로그아웃'
                    onPress={() => setLogoutModalVisible(true)}
                    variant='ghost'
                    size='md'
                    textStyle={styles.logoutText}
                />
            </ScrollView>

            <Modal
                visible={logoutModalVisible}
                message='로그아웃 하시겠습니까?'
                rightBtnText='로그아웃'
                onLeftBtnPress={() => setLogoutModalVisible(false)}
                onRightBtnPress={async () => {
                    // 서버에 요청
                    try {
                        await fetch(API.logout, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${userToken}`,
                            }
                        });
                    } catch (e) {
                        // 서버 오류가 나도 그냥 넘어가기
                    } finally {
                        // 성공하든 실패하든 무조건 토큰 지우고 로그인화면으로
                        await logout();
                    }
                }}
                rightBtnVariant='warning'
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.base,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTitle: {
        fontSize: Typography.lg,
        fontWeight: '800',
        color: Colors.black,
        letterSpacing: -0.5,
    },
    container: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xl,
        gap: Spacing.base,
    },
    logoutText: {
        fontWeight: '800',
        color: Colors.gray500,
    },
});