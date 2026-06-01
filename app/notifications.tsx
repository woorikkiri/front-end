import EmptyState from '@/components/ui/EmptyState';
import Header from "@/components/ui/Header";
import NotificationCard, { NotificationItem } from "@/components/ui/NotificationCard";
import { Colors, Spacing } from "@/constants/theme";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import {
    FlatList,
    StatusBar,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const dummyNotifications: NotificationItem[] = [
    {
        id: '1',
        type: 'schedule',
        title: '새로운 일정이 확정되었어요',
        groupName: '고등학교 동창회',
        isRead: false,
        createdAt: '2024-07-16T12:00:00Z',
    },
    {
        id: '2',
        type: 'schedule',
        title: '새로운 일정이 확정되었어요',
        groupName: '고등학교 동창회',
        isRead: false,
        createdAt: '2024-07-15T19:00:00Z',
    },
];

export default function Notifications() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]); // 알림 데이터는 나중에 API 연동해서 가져올 예정

    useEffect(() => {
        setNotifications(dummyNotifications);
    }, []);

    const handlePressNotification = (id: string) => {
        // 알림 클릭 시 상세 페이지로 이동하거나, 관련 액션 수행
        console.log('알림 클릭:', id);
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === id ? { ...n, isRead: true } : n
            )
        );
    };

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
                                    <Ionicons name="notifications-off" size={40} color={Colors.primaryAlpha} />
                                </View>
                            }
                            title="아직 알림이 없어요"
                            description={"새로운 알림이 도착하면 여기에 표시됩니다."}
                        />
                    </View>
                ) : (
                    // 알림 리스트
                    <FlatList
                        data={notifications}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <NotificationCard item={item} onPress={handlePressNotification} mode="list" />}
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