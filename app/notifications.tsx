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
            const res = await fetch(API.getNotifications, {
                headers: { 'Authorization': `Bearer ${userToken}` },
            });
            if (!res.ok) return;
            const data = await res.json();
            console.log('알림 응답:', data); // 실제 필드명 확인용
            setNotifications(data);
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

    const handlePressNotification = async (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );

        try {
            await fetch(API.readNotification(Number(id)), {
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
                        keyExtractor={(item) => item.id}
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