import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';

interface ProfileCardProps {
    name: string;
    email?: string;
    role?: string; // optional, 관리자/멤버 구분용
    profileImage: string | null;
}

export default function ProfileCard({
    name,
    email,
    role,
    profileImage,

}: ProfileCardProps) {
    return (
        <View style={styles.profileCard}>
            <View style={styles.avatar}>
                    {profileImage ? (
                        <Image
                            source={{ uri: profileImage }}
                            style={styles.avatarImage}
                        />
                    ) : (
                        <Ionicons name="person" size={30} color={Colors.gray300} />
                    )}
            </View>
            <View>
                <Text style={styles.profileName}>{name}</Text>
                {email && <Text style={styles.profileEmail}>{email}</Text>}
                {role && <Text style={styles.profileRole}>{role}</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
    profileRole: {
        fontSize: Typography.sm,
        color: Colors.gray500,
        marginTop: 2,
    }
})