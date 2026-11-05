import CommentItem, { Comment } from '@/components/group/board/CommentItem';
import Header from '@/components/ui/Header';
import MenuGroup from '@/components/ui/MenuGroup';
import Modal from '@/components/ui/Modal';
import ServerErrorModal from '@/components/ui/ServerErrorModal';
import TextInput from '@/components/ui/TextInput';
import { API } from '@/constants/api';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { useMeetingStore } from '@/store/useMeetingStore';
import { formatTimeAgo } from '@/utils/date';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Ellipsis, Pin, Send, X } from 'lucide-react-native';
import { useCallback, useRef, useState } from 'react';
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Popover from 'react-native-popover-view';
import { SafeAreaView } from "react-native-safe-area-context";

interface Post {
    content: string;
    createdAt: string;
    postImageUrl: string | null;
    writerProfileImageUrl: string | null;
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
    const [popoverVisible, setPopoverVisible] = useState(false);
    const scrollRef = useRef<ScrollView>(null);
    const commentInputRef = useRef<any>(null);
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

    // ───── 파생값 ─────
    const isLeader = myRole === 'HOST';
    const isMyPost = post?.writerId === userId;
    const isNotice = post?.notice ?? false;

    // ───── 데이터 fetch ─────
    useFocusEffect(
        useCallback(() => {
            const fetchPost = async () => {
                try {
                    const [postRes, commentsRes] = await Promise.all([
                        fetch(API.getPost(Number(meetingId), Number(postId)), {
                            headers: { 'Authorization': `Bearer ${userToken}` }
                        }),
                        fetch(API.getComments(Number(postId)), {
                            headers: { 'Authorization': `Bearer ${userToken}` }
                        }),
                    ]);

                    const postData = await postRes.json();
                    const commentsData = await commentsRes.json();

                    setPost(postData);
                    setComments(commentsData ?? []);
                } catch (e) {
                    setServerErrorModal(true);
                }
            };
            fetchPost();
        }, [])
    );

    // ───── 댓글 수정 버튼 눌렀을 때 ─────
    const handleEditPress = (commentId: number, content: string) => {
        setEditingCommentId(commentId);
        setCommentText(content);
        commentInputRef.current?.focus();
    };

    // ───── 댓글 수정 취소 ─────
    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setCommentText('');
    };

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

    // ───── 공지 토글 ─────
    const handleToggleNotice = async () => {
        try {
            const response = await fetch(API.setNotice(Number(meetingId), Number(postId)), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                body: JSON.stringify({ notice: !isNotice })
            });
            if (!response.ok) {
                const text = await response.text();
                console.error('공지 변경 실패', response.status, text);
                return;
            }
            // 성공 → post 새로고침
            setPost(prev => prev ? { ...prev, notice: !isNotice } : null);
        } catch (e) {
            setServerErrorModal(true);
        }
    };

    // ───── 팝오버 메뉴 ─────
    const menuButton = (
        <Popover
            isVisible={popoverVisible}
            onRequestClose={() => setPopoverVisible(false)}
            from={(
                <TouchableOpacity onPress={() => setPopoverVisible(true)}>
                    <Ellipsis size={24} color={Colors.gray500} />
                </TouchableOpacity>
            )}
        >
            <View style={styles.menu}>
                <MenuGroup items={[
                    // 공지는 항상
                    { label: isNotice ? '공지 내리기' : '공지 등록하기', onPress: () => { setPopoverVisible(false); handleToggleNotice(); } },
                    // 내 게시글이면 수정/삭제 보이기
                    ...(isMyPost ? [{ label: '게시글 수정', onPress: () => { setPopoverVisible(false); router.push(`/group/${meetingId}/post/edit?postId=${postId}`) } }] : []),
                    // 내 게시글이거나 내가 방장이면 삭제 보이기
                    ...(isMyPost || isLeader ? [{ label: '게시글 삭제', onPress: () => { setPopoverVisible(false); setShowDeleteModal(true) }, labelStyle: { color: Colors.error } }] : []),
                ]} />
            </View>
        </Popover>
    );

    // 댓글 추가 함수 
    const handleAddComment = async () => {
        if (!commentText.trim()) return;

        try {
            if (editingCommentId) {
                // 수정 모드
                const response = await fetch(API.updateComment(Number(postId), editingCommentId), {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userToken}`,
                    },
                    body: JSON.stringify({ content: commentText }),
                });
                if (!response.ok) { setServerErrorModal(true); return; }
                const updated = await response.json();
                setComments(prev => prev.map(c =>
                    c.commentId === editingCommentId
                        ? { ...c, content: updated.content, updatedAt: updated.updatedAt }  // 여기 수정
                        : c
                ));
                setEditingCommentId(null);
            } else {
                // 작성 모드
                const response = await fetch(API.createComment(Number(postId)), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userToken}`,
                    },
                    body: JSON.stringify({ content: commentText }),
                });
                if (!response.ok) { setServerErrorModal(true); return; }
                const newComment = await response.json();
                setComments(prev => [...prev, newComment]);
                setTimeout(() => {
                    scrollRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }
            setCommentText('');
            Keyboard.dismiss();
        } catch (e) {
            setServerErrorModal(true);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            const response = await fetch(API.deleteComment(Number(postId), commentId), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            });
            if (!response.ok) {
                setServerErrorModal(true);
                return;
            }
            // 성공 → 로컬에서도 제거
            setComments(prev => prev.filter(c => c.commentId !== commentId));
        } catch (e) {
            setServerErrorModal(true);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

            <Header
                title="상세보기"
                rightElement={menuButton} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView ref={scrollRef} style={styles.container}>
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>{post?.title}</Text>
                        {post?.notice && (
                            <View style={styles.noticeBadge}>
                                <Pin size={14} color={Colors.primary} />
                                <Text style={styles.noticeText}>공지</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.infoSection}>
                        <Text style={styles.infoText}>{post?.writerName}</Text>
                        <Text style={styles.infoText}>·</Text>
                        <Text style={styles.infoText}>{formatTimeAgo(post?.createdAt ?? '')}</Text>
                    </View>
                    <Text style={styles.subTitle}>{post?.content}</Text>
                    {post?.postImageUrl && (
                        <Image
                            source={{ uri: post.postImageUrl }}
                            style={styles.postImage}
                            resizeMode="cover"
                        />
                    )}

                    <View style={styles.inputDivider} />

                    <View style={styles.commentSection}>
                        <Text style={styles.commentTitle}>댓글</Text>
                        {/* 댓글 목록 */}
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment.commentId}
                                comment={comment}
                                isMyComment={comment.writerId === userId}
                                onDelete={handleDeleteComment}
                                onEditPress={handleEditPress}
                            />
                        ))}
                    </View>

                </ScrollView>

                <View style={styles.divider} />

                <View>
                    {/* 수정 중 배너 */}
                    {editingCommentId && (
                        <View style={styles.editingBanner}>
                            <Text style={styles.editingText}>댓글 수정 중</Text>
                            <TouchableOpacity onPress={handleCancelEdit} hitSlop={8}>
                                <X size={16} color={Colors.gray500} />
                            </TouchableOpacity>
                        </View>
                    )}
                    {/* 댓글 입력 창 */}
                    <View style={styles.commentInputWrap}>
                        <TextInput
                            ref={commentInputRef}
                            placeholder="댓글을 입력하세요"
                            containerStyle={{ flex: 1 }}
                            value={commentText}
                            onChangeText={setCommentText}
                        />
                        <TouchableOpacity
                            style={styles.sendBtn}
                            onPress={handleAddComment}
                        >
                            <Send size={20} color={Colors.white} />
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
        flexDirection: 'row',
        marginTop: Spacing.lg,
        marginBottom: Spacing.md,
        alignItems: "flex-start",
        justifyContent: 'space-between',
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
    postImage: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: Radius.lg,
        marginTop: Spacing.lg,
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
    editingBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        backgroundColor: Colors.primaryLight,
        marginBottom: Spacing.sm,
    },
    editingText: {
        fontSize: Typography.sm,
        color: Colors.primary,
        fontWeight: '600',
    },
    sendBtn: {
        backgroundColor: Colors.primary,
        borderRadius: Radius.full,
        padding: Spacing.md,
    },

    noticeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primaryLight,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.lg,
        alignSelf: 'flex-start',
        marginBottom: Spacing.sm,
    },
    noticeText: {
        color: Colors.primary,
        fontSize: Typography.sm,
        fontWeight: '700',
    },
});