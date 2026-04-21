import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EmptyStateProps {
    icon: React.ReactNode;    // 아이콘 (Ionicons 등)
    title: string;            // 제목
    description?: string;     // 설명 (선택)
    children?: React.ReactNode; // 버튼 등 추가 요소 (선택)
    variant?: 'default' | 'card' // 스타일
}

export default function EmptyState({ icon, title, description, children, variant }: EmptyStateProps) {
    return (
        <View style={[styles.container, variant === 'card' && styles.containerCard]}>
            {variant === 'card' ? (
                icon
            ) : (
                <View style={styles.iconCircle}>
                    {icon}
                </View>
            )}
            
            <View style={styles.textGroup}>
                <Text style={styles.title}>{title}</Text>
                {description && (
                    <Text style={styles.description}>{description}</Text>
                )}
            </View>
            {children}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.md,
        paddingBottom: 80,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: Radius.full,
        backgroundColor: Colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.lg,
    },
    textGroup: {
        alignItems: 'center',
        gap: Spacing.md,
    },
    title: {
        fontSize: Typography.lg,
        fontWeight: '900',
        color: Colors.black,
        textAlign: 'center',
    },
    description: {
        fontSize: Typography.base,
        color: Colors.gray500,
        textAlign: 'center',
    },

    containerCard: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.xl,
        padding: Spacing.lg,
        justifyContent: 'center',
        paddingBottom: Spacing.lg,
    },
});