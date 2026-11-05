import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { formatTimeAgo } from '@/utils/date';
import { Pencil, Trash2, User } from 'lucide-react-native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface Comment {
    commentId: number;
    content: string;
    writerNickname: string;
    writerId: number;
    createdAt: string;
    updatedAt: string | null;
    writerProfileImageUrl: string | null;
}

interface CommentItemProps {
    comment: Comment;
    isMyComment: boolean;  // 내 댓글인지
    onDelete: (commentId: number) => void;  // 삭제 함수
    onEditPress: (commentId: number, content: string) => void;  // 수정 버튼 눌렀을 때
}

export default function CommentItem({ comment, isMyComment, onDelete, onEditPress }: CommentItemProps) {
    return (
        <View style={styles.container}>
            {/* 아바타 */}
            <View style={styles.avatar}>
                {comment.writerProfileImageUrl ? (
                    <Image
                        source={{ uri: comment.writerProfileImageUrl }}
                        style={styles.avatarImage}
                    />
                ) : (
                    <User size={24} color={Colors.gray300} />
                )}
            </View>

            {/* 내용 */}
            <View style={styles.content}>
                {/* 작성자 + 시간 */}
                <View style={styles.header}>
                    <Text style={styles.nickname}>{comment.writerNickname}</Text>
                    {/* 처음 작성 시간 유지 + "수정됨" 표시 */}
                    <Text style={styles.time}>
                        {comment.updatedAt && comment.updatedAt !== comment.createdAt
                            ? `${formatTimeAgo(comment.createdAt)} · 수정됨`
                            : formatTimeAgo(comment.createdAt)
                        }
                    </Text>
                </View>
                {/* 댓글 내용 */}
                <Text style={styles.text}>{comment.content}</Text>
            </View>

            {/* 내 댓글이면 수정/삭제 버튼 */}
            {isMyComment && (
                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => onEditPress(comment.commentId, comment.content)} hitSlop={8}>
                        <Pencil size={16} color={Colors.gray300} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDelete(comment.commentId)} hitSlop={8}>
                        <Trash2 size={16} color={Colors.gray300} />
                    </TouchableOpacity>
                </View>
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
    actions: {
        flexDirection: 'row',
        gap: Spacing.sm,
        alignItems: 'center',
    },
});