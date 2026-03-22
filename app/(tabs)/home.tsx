import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const router = useRouter();
    const [groups, setGrousps] = React.useState([
        { id: 1, name: "모임 A" },
        { id: 2, name: "모임 B" },
        { id: 3, name: "모임 C" },
    ]);

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

            {/* 헤더 */}
            <View style={styles.header}>
            {/* 왼쪽 로고 + 텍스트 */}
                <View style={styles.logoRow}>
                    <View style={styles.logoIcon}>
                        <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
                    </View>
                    <Text style={styles.logoText}>우리끼리</Text>
                </View>

                {/* 오른쪽 알림 버튼 */}
                <TouchableOpacity style={styles.bellBtn} onPress={() => router.push("/notifications")}>
                    <Ionicons name="notifications-outline" size={22} color={Colors.primary} />
                </TouchableOpacity>
            </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: Typography.lg,
    fontWeight: '800',
    color: Colors.black,
    letterSpacing: -0.5,
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});