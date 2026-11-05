import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { User } from 'lucide-react-native';
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
    icon?: React.ReactNode; // optional
    backgroundColor?: string; // optional
}

export default function ProfileCard({
    name,
    email,
    role,
    profileImage,
    icon,
    backgroundColor = Colors.white,

}: ProfileCardProps) {
    return (
        <View style={[styles.profileCard, { backgroundColor }]}>
            <View style={styles.avatar}>
                    {profileImage ? (
                        <Image
                            source={{ uri: profileImage }}
                            style={styles.avatarImage}
                        />
                    ) : (
                        <User size={30} color={Colors.gray300} />
                    )}
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.profileName}>{name}</Text>
                {email && <Text style={styles.profileEmail}>{email}</Text>}
                {role && <Text style={styles.profileRole}>{role}</Text>}
            </View>
            {icon && <View style={{ marginLeft: 'auto' }}>{icon}</View>}
        </View>
    );
}

const styles = StyleSheet.create({
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.base,
        borderWidth: 1,              
        borderColor: Colors.gray200, 
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