import EmptyState from '@/components/ui/EmptyState';
import Header from "@/components/ui/Header";
import NotificationCard, { NotificationItem } from "@/components/ui/NotificationCard";
import { API } from '@/constants/api';
import { Colors, Spacing } from "@/constants/theme";
import { useAuthStore } from '@/store/useAuthStore';
import { useFocusEffect } from 'expo-router';
import { BellOff } from 'lucide-react-native';
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StatusBar,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {
    const { userToken } = useAuthStore();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        if (!userToken) return;
        try {
            const response = await fetch(API.getNotifications, {
                headers: { 'Authorization': `Bearer ${userToken}` },
            });
            if (!response.ok) return;
            const data: NotificationItem[] = await response.json();
            setNotifications(data); // 화면엔 원래 read 상태 그대로 보여줌 (강조 유지)

            // 서버엔 바로 읽음 처리
            const unreadIds = data.filter(n => !n.read).map(n => n.id);
            unreadIds.forEach(id => {
                fetch(API.readNotification(id), {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${userToken}` },
                }).catch((e) => {
                    console.error('읽음 처리 실패', id, e);
                });
            });
        } catch (e) {
            console.error('알림 목록 조회 실패', e);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [])
    );

    const handlePressNotification = async (id: number) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );

        try {
            await fetch(API.readNotification(id), {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${userToken}` },
            });
        } catch (e) {
            console.error('읽음 처리 실패', e);
        }
    };

    if (loading) return <ActivityIndicator style={{ marginTop: Spacing['2xl'] }} color={Colors.primary} />;

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <Header title="알림" />
            <View style={styles.container}>
                {notifications.length === 0 ? (
                    <View style={styles.emptyState}>
                        <EmptyState
                            icon={
                                <View style={{ position: 'relative' }}>
                                    <BellOff size={40} color={Colors.primaryAlpha} />
                                </View>
                            }
                            title="아직 알림이 없어요"
                            description={"새로운 알림이 도착하면 여기에 표시됩니다."}
                        />
                    </View>
                ) : (
                    <FlatList
                        data={notifications}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <NotificationCard item={item} onPress={handlePressNotification} mode="list" />
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    container: {
        paddingBottom: Spacing['3xl'],
        flex: 1,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});