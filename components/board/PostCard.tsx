import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from "@expo/vector-icons";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface PostCardProps {
    title: string;
    content: string;
    author: string;
    createdAt: string;
    commentsCount: number;
    isNotice?: boolean;
    onPress: () => void;
}

export default function PostCard({
    title,
    content,
    author,
    createdAt,
    commentsCount,
    isNotice = false,
    onPress,
}: PostCardProps) {

    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.postCard}
        >
            <View style={styles.header}>
                <Text style={styles.title} numberOfLines={1}>
                    {isNotice ? `[공지] ${title}` : title}
                </Text>
                {isNotice && (
                    <View style={styles.noticeBadge}>
                        <Ionicons name="pin" color={Colors.primary}/>
                        <Text style={styles.noticeText}>공지</Text>
                    </View>
                )}
            </View>
            <Text style={styles.content} numberOfLines={1}>
                {content}
            </Text>
            <View style={styles.footer}>
                <View style={styles.footerLeft}>
                    <Text style={styles.footerText}>{author}</Text>
                    <Text style={styles.footerText}> · </Text>
                    <Text style={styles.footerText}>{createdAt}</Text>
                </View>
                <Text style={styles.footerText}>댓글 {commentsCount} </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    postCard: {
        backgroundColor: Colors.white,
        borderRadius: Radius.xl,
        padding: Spacing.base,
        borderWidth: 1,
        borderColor: Colors.border,
        ...Shadow.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    noticeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primaryLight,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.lg,
        marginLeft: Spacing.sm,
    },
    noticeText: {
        color: Colors.primary,
        fontSize: Typography.sm,
        fontWeight: '700',
    },
    title: {
        fontSize: Typography.base,
        fontWeight: '700',
        flex: 1,
    },
    content: {
        fontSize: Typography.sm,
        color: Colors.gray300,
        marginTop: Spacing.sm,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: Spacing.base,
    },
    footerLeft: {
        flexDirection: 'row', 
        alignItems: 'center',
    },
    footerText: {
        fontSize: Typography.sm,
        fontWeight: '700',
        color: Colors.gray500,
    },
});