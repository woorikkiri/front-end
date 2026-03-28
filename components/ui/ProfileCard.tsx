import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';

interface ProfileCardProps {
    name: string;
    email: string;
    profileImage: string | null;
}

export default function ProfileCard({
    name,
    email,
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
})