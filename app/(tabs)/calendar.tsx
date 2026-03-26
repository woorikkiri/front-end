// 개인 캘린더 화면
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function calendarScreen() {
    const [selectDate, setSelectDate] = useState("");
    const [schedules, setSchedules] = useState([
        { id: '1', title: '스터디 모임', groupName: '우리 스터디', date: '2025-03-25' },
        { id: '2', title: '소풍', groupName: '친구들', date: '2025-03-25' },
        { id: '3', title: '정기 모임', groupName: '동아리', date: '2025-03-28' },
    ]);

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>일정</Text>
            </View>
            <ScrollView>
                <View style={styles.calendarSection}>
                    {/* 캘린더 색상 및 일정 띄우기 등 */}
                    <Calendar

                    />
                </View>
                {/* 일정 선택하면 밑에 정확한 일정 내용 뜨게 만들어주기 */}
                
            </ScrollView>
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
    calendarSection: {
        backgroundColor: Colors.primaryLight
    },
});