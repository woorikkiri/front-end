import Header from '@/components/ui/Header';
import MenuGroup, { MenuItem } from '@/components/ui/MenuGroup';
import ServerErrorModal from '@/components/ui/ServerErrorModal';
import { API } from '@/constants/api';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationSettingsScreen() {
    const { userToken } = useAuthStore();

    // ───── 알림 설정 상태 ─────
    const [settings, setSettings] = useState<{
        noticeEnabled: boolean;
        pushEnabled: boolean;
        scheduleEnabled: boolean;
        voteEnabled: boolean;
    } | null>(null);
    const [serverErrorModal, setServerErrorModal] = useState(false);

    // ───── 알림 설정 불러오기 ─────
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(API.getNotificationSettings, {
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });
                if (!response.ok) {
                    setServerErrorModal(true);
                    return;
                }
                const data = await response.json();
                setSettings(data);
            } catch (e) {
                setServerErrorModal(true);
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

    const handleToggle = (key: string, value: boolean) => {
        setSettings(prev => prev ? { ...prev, [key]: value } : prev);
        updateSetting(key, value);
    };

    const menuItems: MenuItem[] = settings ? [
        {
            label: '공지 알림',
            onPress: () => handleToggle('noticeEnabled', !settings.noticeEnabled),
            rightIcon: (
                <Switch
                    value={settings.noticeEnabled}
                    onValueChange={(v) => handleToggle('noticeEnabled', v)}
                    trackColor={{ false: Colors.gray300, true: Colors.primary }}
                />
            ),
            showChevron: false,
        },
        {
            label: '일정 알림',
            onPress: () => handleToggle('scheduleEnabled', !settings.scheduleEnabled),
            rightIcon: (
                <Switch
                    value={settings.scheduleEnabled}
                    onValueChange={(v) => handleToggle('scheduleEnabled', v)}
                    trackColor={{ false: Colors.gray300, true: Colors.primary }}
                />
            ),
            showChevron: false,
        },
        {
            label: '투표 알림',
            onPress: () => handleToggle('voteEnabled', !settings.voteEnabled),
            rightIcon: (
                <Switch
                    value={settings.voteEnabled}
                    onValueChange={(v) => handleToggle('voteEnabled', v)}
                    trackColor={{ false: Colors.gray300, true: Colors.primary }}
                />
            ),
            showChevron: false,
        },
        {
            label: '푸시 알림',
            onPress: () => handleToggle('pushEnabled', !settings.pushEnabled),
            rightIcon: (
                <Switch
                    value={settings.pushEnabled}
                    onValueChange={(v) => handleToggle('pushEnabled', v)}
                    trackColor={{ false: Colors.gray300, true: Colors.primary }}
                />
            ),
            showChevron: false,
        },
    ] : [];

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <Header title='알림 설정' />
            <View style={styles.container}>
                {settings === null ? (
                    <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
                ) : (
                    <MenuGroup items={menuItems} />
                )}
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