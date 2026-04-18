import Header from '@/components/ui/Header';
import MenuGroup, { MenuItem } from '@/components/ui/MenuGroup';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useRouter } from "expo-router";
import { useState } from 'react';
import {
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function notificationsScreen() {
    const router = useRouter();
    
    {/* 알림 별 state */}
    // TODO: API 연동 후 서버에서 알림 설정 불러오기 / 저장하기
    const [meetingAlarm, setMeetingAlarm] = useState(true);
    const [voteAlarm, setVoteAlarm] = useState(true);
    const [memberAlarm, setMemberAlarm] = useState(true);

    const menuItems: MenuItem[] = [
        { 
            label: '모임 확정 알림',
            onPress: ()=> setMeetingAlarm(!meetingAlarm), 
            rightIcon: (
                <Switch 
                    value={meetingAlarm} 
                    onValueChange={(v) => setMeetingAlarm(v)}
                    trackColor={{ false: Colors.gray300, true: Colors.primary }}
                />
            )
        },
        { 
            label: '투표 마감 알림',
            onPress: ()=> setVoteAlarm(!voteAlarm), 
            rightIcon: (
                <Switch 
                    value={voteAlarm} 
                    onValueChange={(v) => setVoteAlarm(v)}
                    trackColor={{ false: Colors.gray300, true: Colors.primary }}
                />
            )
        },
        { 
            label: '새 멤버 참여 알림',
            onPress: ()=> setMemberAlarm(!memberAlarm), 
            rightIcon: (
                <Switch 
                    value={memberAlarm} 
                    onValueChange={(v) => setMemberAlarm(v)}
                    trackColor={{ false: Colors.gray300, true: Colors.primary }}
                />
            )
        }
    ]

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

            <Header title='알림 설정'/>

            <View style={styles.container}>
                <MenuGroup items={menuItems} />
                <View>
                    <Text style={styles.infoText}>기기 알림 설정은 휴대폰 설정에서 변경할 수 있어요.</Text>
                </View>
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
        paddingTop: Spacing['2xl'],
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing['3xl']
    },
    infoText: {
        marginTop: Spacing.base,
        fontSize: Typography.sm,
        color: Colors.gray500,
        lineHeight: 20,
    },
})