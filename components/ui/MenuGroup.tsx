import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { ChevronRight } from 'lucide-react-native';

import React from 'react';
import {
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
} from 'react-native';

export interface MenuItem {
    label: string;
    onPress: () => void;
    labelStyle?: TextStyle;        // 글자 색상 등 커스텀
    rightIcon?: React.ReactNode;   // 커스텀 아이콘 (없으면 기본 > 표시)
    showChevron?: boolean;         // > 화살표 숨기고 싶을 때 false
}

function MenuRow({ label, onPress, labelStyle, rightIcon, showChevron = true }: MenuItem) {
    return (
        <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.7}>
            <Text style={[styles.menuLabel, labelStyle]}>{label}</Text>
            {/* rightIcon 있으면 그거 보여주고, 없으면 기본 화살표 */}
            {rightIcon ? (
                rightIcon
            ) : showChevron ? (
                <ChevronRight size={20} color={Colors.gray300} />
            ) : null}
        </TouchableOpacity>
    );
}

export default function MenuGroup({ items }: { items: MenuItem[] }) {
    return (
        <View style={styles.menuGroup}>
            {items.map((item, index) => (
                <View key={item.label}>
                    <MenuRow {...item} />
                    {index < items.length - 1 && <View style={styles.divider} />}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    menuGroup: {
        borderWidth: 1,
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
});