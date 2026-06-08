import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { User } from 'lucide-react-native';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';

interface MemberItemProps {
    name: string;
    profileImage: string | null;
    icon?: React.ReactNode;
}

export default function MemberItem({ name, profileImage, icon }: MemberItemProps) {
    return (
        <View style={styles.profileCard}>
            <View style={styles.avatar}>
                {profileImage ? (
                    <Image
                        source={{ uri: profileImage }}
                        style={styles.avatarImage}
                    />
                ) : (
                    <User size={20} color={Colors.gray300} />
                )}
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.profileName}>{name}</Text>
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
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.sm,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: Radius.full,
        backgroundColor: Colors.gray200,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    avatarImage: {
        width: 36,
        height: 36,
        borderRadius: Radius.full,
    },
    profileName: {
        fontSize: Typography.sm,
        fontWeight: '700',
        color: Colors.black,
    },
})