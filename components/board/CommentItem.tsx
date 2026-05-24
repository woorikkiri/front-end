import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { formatTimeAgo } from '@/utils/date';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface Comment {
    commentId: number;
    content: string;
    writerNickname: string;
    writerId: number;
    createdAt: string;
    profileImageUrl: string | null;
}

interface CommentItemProps {
    comment: Comment;
    isMyComment: boolean;  // 내 댓글인지
    onDelete: (commentId: number) => void;  // 삭제 함수
}

export default function CommentItem({ comment, isMyComment, onDelete }: CommentItemProps) {
    return (
        <View style={styles.container}>
            {/* 아바타 */}
            <View style={styles.avatar}>
                {comment.profileImageUrl ? (
                    <Image
                        source={{ uri: comment.profileImageUrl }}
                        style={styles.avatarImage}
                    />
                ) : (
                    <Ionicons name="person" size={20} color={Colors.gray300} />
                )}
            </View>

            {/* 내용 */}
            <View style={styles.content}>
                {/* 작성자 + 시간 */}
                <View style={styles.header}>
                    <Text style={styles.nickname}>{comment.writerNickname}</Text>
                    <Text style={styles.time}>{formatTimeAgo(comment.createdAt)}</Text>
                </View>
                {/* 댓글 내용 */}
                <Text style={styles.text}>{comment.content}</Text>
            </View>

            {/* 내 댓글이면 삭제 버튼 */}
            {isMyComment && (
                <TouchableOpacity
                    onPress={() => onDelete(comment.commentId)}
                    hitSlop={8}
                >
                    <Ionicons name="trash-outline" size={16} color={Colors.gray300} />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: Spacing.md,
        paddingVertical: Spacing.md,
        alignItems: 'flex-start',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: Radius.full,
        backgroundColor: Colors.gray200,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    avatarText: {
        fontSize: Typography.sm,
        fontWeight: '700',
        color: Colors.primary,
    },
    avatarImage: {
        width: 36,
        height: 36,
        borderRadius: Radius.full,
    },
    content: {
        flex: 1,
        gap: Spacing.xs,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    nickname: {
        fontSize: Typography.sm,
        fontWeight: '700',
        color: Colors.black,
    },
    time: {
        fontSize: Typography.xs,
        color: Colors.gray500,
    },
    text: {
        fontSize: Typography.base,
        color: Colors.gray900,
        lineHeight: 22,
    },
});