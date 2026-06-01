import CommentItem, { Comment } from '@/components/board/CommentItem';
import Header from '@/components/ui/Header';
import MenuGroup from '@/components/ui/MenuGroup';
import Modal from '@/components/ui/Modal';
import ServerErrorModal from '@/components/ui/ServerErrorModal';
import TextInput from '@/components/ui/TextInput';
import { API } from '@/constants/api';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useMeetingStore } from '@/store/MeetingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatTimeAgo } from '@/utils/date';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView, Platform, ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Popover from 'react-native-popover-view';
import { SafeAreaView } from "react-native-safe-area-context";

interface Post {
    content: string;
    createdAt: string;
    imageUrls: null | string[];
    meetingId: number;
    notice: boolean;
    postId: number;
    title: string;
    updatedAt: string;
    writerId: number;
    writerName: string;
}

export default function PostDetailScreen() {
    // ───── 라우터 / 인증 ─────
    const router = useRouter();
    const { userId, userToken } = useAuthStore();
    const { myRole } = useMeetingStore();
    const { meetingId, postId } = useLocalSearchParams();

    // ───── 상태 ─────
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [serverErrorModal, setServerErrorModal] = useState(false);

    // ───── 파생값 ─────
    const isLeader = myRole === 'HOST';
    const isMyPost = post?.writerId === userId;
    const isNotice = post?.notice ?? false;

    // ───── 데이터 fetch ─────
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(API.getPost(Number(meetingId), Number(postId)), {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                    }
                });
                const data = await response.json();
                setPost(data);
                setComments(data.comments ?? []);
            } catch (e) {
                setServerErrorModal(true);
            }
        };
        fetchPost();
    }, []);

    // ───── 게시글 삭제 ─────
    const handleDeletePost = async () => {
        try {
            const response = await fetch(API.deletePost(Number(meetingId), Number(postId)), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                }
            });
            if (!response.ok) {
                // 실패
                setServerErrorModal(true);
                return;
            }
            // 성공 → 뒤로가기
            router.back();
        } catch (e) {
            // 네트워크 오류
            setServerErrorModal(true);
        }
    };
    // ───── 댓글 추가 (API 연동 전) ─────

    // ───── 팝오버 메뉴 ─────
    const menuButton = (
        <Popover
            from={(
                <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={24} color={Colors.gray500} />
                </TouchableOpacity>
            )}
        >
            <View style={styles.menu}>
                <MenuGroup items={[
                    // 공지는 항상
                    { label: isNotice ? '공지 내리기' : '공지 등록하기', onPress: () => console.log(isNotice ? '공지내리기' : '공지올리기') },
                    // 내 게시글이면 수정/삭제 보이기
                    ...(isMyPost ? [{ label: '게시글 수정', onPress: () => { } }] : []),
                    // 내 게시글이거나 내가 방장이면 삭제 보이기
                    ...(isMyPost || isLeader ? [{ label: '게시글 삭제', onPress: () => setShowDeleteModal(true), labelStyle: { color: Colors.error } }] : []),
                ]} />
            </View>
        </Popover>
    );

    // 댓글 추가 함수 (다른 함수들 옆에)
    const handleAddComment = () => {
        if (!commentText.trim()) return;  // 빈 댓글 방지

        const newComment: Comment = {
            commentId: Date.now(),  // 임시 id (나중에 API로 받아오면 됨)
            content: commentText,
            writerNickname: '나',  // 나중에 userId로 받아오면 됨
            writerId: userId ?? 0,
            createdAt: new Date().toISOString(),
            profileImageUrl: null,
        };

        setComments([...comments, newComment]);
        setCommentText('');  // 입력창 초기화
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

            <Header
                title={`그룹 ${meetingId} - 게시글 ${postId}`}
                rightElement={menuButton} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView style={styles.container}>
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>{post?.title}</Text>
                    </View>
                    <View style={styles.infoSection}>
                        <Text style={styles.infoText}>{post?.writerName}</Text>
                        <Text style={styles.infoText}>·</Text>
                        <Text style={styles.infoText}>{formatTimeAgo(post?.createdAt ?? '')}</Text>
                    </View>
                    <Text style={styles.subTitle}>{post?.content}</Text>
                    {post?.notice && <Text>공지</Text>}

                    <View style={styles.inputDivider} />

                    <View style={styles.commentSection}>
                        <Text style={styles.commentTitle}>댓글</Text>
                        {/* 댓글 목록 */}
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment.commentId}
                                comment={comment}
                                isMyComment={comment.writerId === userId}
                                onDelete={(commentId) => {
                                    // 나중에 API 연동
                                    setComments(comments.filter(c => c.commentId !== commentId));
                                }}
                            />
                        ))}
                    </View>

                </ScrollView>

                <View style={styles.divider} />

                <View>
                    {/* 댓글 입력 창 */}
                    <View style={styles.commentInputWrap}>
                        <TextInput
                            placeholder="댓글을 입력하세요"
                            containerStyle={{ flex: 1 }}
                            value={commentText}
                            onChangeText={setCommentText}
                        />
                        <TouchableOpacity
                            style={styles.sendBtn}
                            onPress={handleAddComment}
                        >
                            <Ionicons name="paper-plane-outline" size={20} color={Colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
            <Modal
                visible={showDeleteModal}
                message='게시글을 삭제하시겠습니까?'
                rightBtnText='삭제'
                onLeftBtnPress={() => setShowDeleteModal(false)}
                onRightBtnPress={() => {
                    setShowDeleteModal(false);
                    handleDeletePost();
                }}
                rightBtnVariant='danger'
            />
            {/* 서버 오류 모달 */}
            <ServerErrorModal
                visible={serverErrorModal}
                onClose={() => setServerErrorModal(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    container: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing['3xl'],
    },
    inputDivider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: Spacing.lg,
    },
    menu: {
        width: 150,
    },
    titleSection: {
        marginTop: Spacing.lg,
        marginBottom: Spacing.md,
        alignItems: "flex-start",
        gap: Spacing.xs,
    },
    title: {
        fontSize: Typography['2xl'],
        fontWeight: "900",
        color: Colors.black,
    },
    subTitle: {
        fontSize: Typography.base,
    },
    infoSection: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    infoText: {
        fontSize: Typography.sm,
        fontWeight: '700',
        color: Colors.gray500,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginBottom: Spacing.md,
    },
    commentSection: {
        marginBottom: Spacing.md,
    },
    commentTitle: {
        fontSize: Typography.md,
        fontWeight: '700',
    },
    commentInputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.lg,
    },
    sendBtn: {
        backgroundColor: Colors.primary,
        borderRadius: Radius.full,
        padding: Spacing.md,
    }
});