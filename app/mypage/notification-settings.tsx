import Header from '@/components/ui/Header';
import MenuGroup, { MenuItem } from '@/components/ui/MenuGroup';
import ServerErrorModal from '@/components/ui/ServerErrorModal';
import { API } from '@/constants/api';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import {
    Alert,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationSettingsScreen() {
    const router = useRouter();
    const { userToken } = useAuthStore();

    // ───── 알림 설정 상태 ─────
    const [noticeEnabled, setNoticeEnabled] = useState(true);
    const [pushEnabled, setPushEnabled] = useState(true);
    const [scheduleEnabled, setScheduleEnabled] = useState(true);
    const [voteEnabled, setVoteEnabled] = useState(true);
    const [serverErrorModal, setServerErrorModal] = useState(false);

    // ───── 알림 설정 불러오기 ─────
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(API.getNotificationSettings, {
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });
                if (!response.ok) {
                    Alert.alert('실패', String(response.status));
                    setServerErrorModal(true);
                    return;
                }
                Alert.alert('status', String(response.status));
                const data = await response.json();
                console.log('data:', data);
                setNoticeEnabled(data.noticeEnabled);
                setPushEnabled(data.pushEnabled);
                setScheduleEnabled(data.scheduleEnabled);
                setVoteEnabled(data.voteEnabled);
            } catch (e) {
                setServerErrorModal(true);
                Alert.alert('에러', String(e));
            }
        };
        fetchSettings();
    }, []);

    // ───── 알림 설정 변경 ─────
    const updateSetting = async (key: string, value: boolean) => {
        try {
            const response = await fetch(API.updateNotificationSettings, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                body: JSON.stringify({ [key]: value }),
            });
            if (!response.ok) { setServerErrorModal(true); }
        } catch (e) {
            setServerErrorModal(true);
        }
    };

    const handleToggle = (key: string, value: boolean, setter: (v: boolean) => void) => {
        setter(value);
        updateSetting(key, value);
    };

    const menuItems: MenuItem[] = [
        {
            label: '공지 알림',
            onPress: () => handleToggle('noticeEnabled', !noticeEnabled, setNoticeEnabled),
            rightIcon: (
                <Switch
                    value={noticeEnabled}
                    onValueChange={(v) => handleToggle('noticeEnabled', v, setNoticeEnabled)}
                    trackColor={{ false: Colors.gray300, true: Colors.primary }}
                />
            )
        },
        {
            label: '일정 알림',
            onPress: () => handleToggle('scheduleEnabled', !scheduleEnabled, setScheduleEnabled),
            rightIcon: (
                <Switch
                    value={scheduleEnabled}
                    onValueChange={(v) => handleToggle('scheduleEnabled', v, setScheduleEnabled)}
                    trackColor={{ false: Colors.gray300, true: Colors.primary }}
                />
            )
        },
        {
            label: '투표 알림',
            onPress: () => handleToggle('voteEnabled', !voteEnabled, setVoteEnabled),
            rightIcon: (
                <Switch
                    value={voteEnabled}
                    onValueChange={(v) => handleToggle('voteEnabled', v, setVoteEnabled)}
                    trackColor={{ false: Colors.gray300, true: Colors.primary }}
                />
            )
        },
        {
            label: '푸시 알림',
            onPress: () => handleToggle('pushEnabled', !pushEnabled, setPushEnabled),
            rightIcon: (
                <Switch
                    value={pushEnabled}
                    onValueChange={(v) => handleToggle('pushEnabled', v, setPushEnabled)}
                    trackColor={{ false: Colors.gray300, true: Colors.primary }}
                />
            )
        },
    ];

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <Header title='알림 설정' />
            <View style={styles.container}>
                <MenuGroup items={menuItems} />
                <Text style={styles.infoText}>기기 알림 설정은 휴대폰 설정에서 변경할 수 있어요.</Text>
            </View>
            <ServerErrorModal
                visible={serverErrorModal}
                onClose={() => setServerErrorModal(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    container: {
        paddingTop: Spacing['2xl'],
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing['3xl'],
    },
    infoText: {
        marginTop: Spacing.base,
        fontSize: Typography.sm,
        color: Colors.gray500,
        lineHeight: 20,
    },
});