import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useState } from 'react';
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MenuItem {
    label: string;
    onPress: () => void;
}

function ProfileCard({ name, email, profileImage }: {
    name: string;
    email: string;
    profileImage: string | null;
}) {
    return (
        <View style={styles.profileCard}>
            <View style={styles.avatar}>
                {profileImage ? (
                    <Image
                        source={{ uri: profileImage }}
                        style={styles.avatarImage}
                    />
                ) : (
                    <Text style={styles.avatarText}>{name[0]}</Text>
                )}
            </View>
            <View>
                <Text style={styles.profileName}>{name}</Text>
                <Text style={styles.profileEmail}>{email}</Text>
            </View>
        </View>
    );
}

function MenuRow({ label, onPress }: { label: string; onPress(): void }) {
    return (
        <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.7}>
            <Text style={styles.menuLabel}>{label}</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.gray300} />
        </TouchableOpacity>
    );
}

function MenuGroup({ items }: { items: MenuItem[] }) {
    return (
        <View style={styles.menuGroup}>
            {items.map((item, index) => (
                <View key={item.label}>
                    <MenuRow label={item.label} onPress={item.onPress} />
                    {index < items.length - 1 && <View style={styles.divider} />}
                </View>
            ))}
        </View>
    );
}

export default function MyPageScreen() {
    const router = useRouter();

    // TODO: API 연동 후 GET /api/users/me 응답으로 교체
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
                />

                <MenuGroup items={menuItems} />

                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={() => router.push('/logout')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.logoutText}>로그아웃</Text>
                </TouchableOpacity>
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
    container: {
        paddingHorizontal: Spacing['2xl'],
        paddingTop: Spacing.xl,
        gap: Spacing.base,
    },

    // 프로필 카드
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        backgroundColor: Colors.primaryLight,
        borderRadius: Radius.lg,
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.base,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: Radius.full,
        backgroundColor: Colors.gray200,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    avatarImage: {
        width: 44,
        height: 44,
        borderRadius: Radius.full,
    },
    avatarText: {
        fontSize: Typography.base,
        fontWeight: '700',
        color: Colors.gray700,
    },
    profileName: {
        fontSize: Typography.base,
        fontWeight: '700',
        color: Colors.black,
    },
    profileEmail: {
        fontSize: Typography.sm,
        color: Colors.gray500,
        marginTop: 2,
    },

    // 메뉴 그룹
    menuGroup: {
        borderWidth: 2,
        borderColor: Colors.border,
        borderRadius: Radius.lg,
        overflow: 'hidden',
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.base,
    },
    menuLabel: {
        fontSize: Typography.base,
        color: Colors.black,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
    },

    // 로그아웃
    logoutBtn: {
        alignItems: 'center',
        paddingVertical: Spacing.md,
        marginTop: Spacing.sm,
    },
    logoutText: {
        fontSize: Typography.base,
        color: Colors.gray500,
    },
});