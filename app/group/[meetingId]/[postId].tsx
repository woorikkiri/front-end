import Header from '@/components/ui/Header';
import MenuGroup from '@/components/ui/MenuGroup';
import TextInput from '@/components/ui/TextInput';
import { API } from '@/constants/api';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import useAuth from '@/hooks/useAuth';
import { formatTimeAgo } from '@/utils/date';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
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
    imageUrls: null | string[];
    meetingId: number;
    notice: boolean;
    postId: number;
    title: string;
    updatedAt: string;
    writerId: number;
    writerNickname: string;
}

export default function PostDetailScreen() {
    const { userId } = useAuth();
    const [post, setPost] = useState<Post | null>({
        content: "안녕하세요. 게시글 테스트입니다.",
        createdAt: "2026-04-05T00:06:54",
        imageUrls: null,
        meetingId: 1,
        notice: false,
        postId: 1,
        title: "첫 게시글입니다",
        updatedAt: "",
        writerId: 1,
        writerNickname: "test1"
    });

    const isMyPost = post?.writerId === userId;
    const isLeader = false; // 나중에 API로 받아오기
    const isNotice = post?.notice ?? false;

    const { meetingId, postId } = useLocalSearchParams();

    useEffect(() => {
        // 여기서 getPost 호출하면 됨
        const fetchPost = async () => {
            try {
                // API 호출해서 post 데이터 받아오기
                const response = await fetch(API.getPost(Number(postId)));
                const data = await response.json();
                setPost(data);
            } catch (e) {
                // setServerErrorModal(true);
            } finally {
                // 로딩 상태 해제 등 추가 작업
            }

        };
        fetchPost();
    }, []);

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
                    ...(isMyPost || isLeader ? [{ label: '게시글 삭제', onPress: () => console.log('삭제'), labelStyle: { color: Colors.error } }] : []),
                ]} />
            </View>
        </Popover>
    );

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

            <Header
                title={`그룹 ${meetingId} - 게시글 ${postId}`}
                rightElement={menuButton} />

            <ScrollView style={styles.container}>
                <View style={styles.titleSection}>
                    <Text style={styles.title}>{post?.title}</Text>
                </View>
                <View style={styles.infoSection}>
                    <Text style={styles.infoText}>{post?.writerNickname}</Text>
                    <Text style={styles.infoText}>·</Text>
                    <Text style={styles.infoText}>{formatTimeAgo(post?.createdAt ?? '')}</Text>
                </View>
                <Text style={styles.subTitle}>{post?.content}</Text>
                {post?.notice && <Text>공지</Text>}

                <View style={styles.divider} />

                <View style={styles.commentSection}>
                    <Text style={styles.commentTitle}>댓글</Text>
                    {/* 댓글 목록 */}
                </View>

            </ScrollView>

            <View style={styles.divider} />

            <View>
                {/* 댓글 입력 창 */}
                <View style={styles.commentInputWrap}>
                    <TextInput
                        placeholder="댓글을 입력하세요"
                        containerStyle={{ flex: 1 }}
                    // value, onChangeText 등 추가
                    />
                    <TouchableOpacity
                        style={styles.sendBtn}
                        onPress={() => { }}
                    >
                        <Ionicons name="paper-plane-outline" size={20} color={Colors.white} />
                    </TouchableOpacity>

                </View>
            </View>
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
    divider: {
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
        paddingVertical: Spacing.md,
        paddingBottom: Spacing['3xl'],
    },
    sendBtn: {
        backgroundColor: Colors.primary,
        borderRadius: Radius.full,
        padding: Spacing.md,
    }
});