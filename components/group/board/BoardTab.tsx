// BoardTab.tsx
import PostCard from '@/components/group/board/PostCard';
import EmptyState from '@/components/ui/EmptyState';
import ServerErrorModal from '@/components/ui/ServerErrorModal';
import { API } from '@/constants/api';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useAuthStore } from "@/store/useAuthStore";
import { formatTimeAgo } from '@/utils/date';
import { useFocusEffect, useRouter } from 'expo-router';
import { File, Megaphone } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native';

interface BoardTabProps {
  meetingId: number;
}

interface Post {
  postId: number;
  title: string;
  contentPreview: string;
  notice: boolean;
  writerNickname: string;
  writerId: number;
  createdAt: string;
  commentCount: number;
  imageUrl: null | string;
}

export default function BoardTab({ meetingId }: BoardTabProps) {
  // ───── 라우터 / 인증 ─────
  const router = useRouter();
  const { userToken } = useAuthStore();

  // ───── 상태 ─────
  const [posts, setPosts] = useState<Post[]>([]);
  const [noticePost, setNoticePost] = useState<Post | null>(null);
  const [serverErrorModal, setServerErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // ───── 데이터 fetch ─────
  const fetchPosts = async () => {
    try {
      const response = await fetch(API.getMeeting(meetingId), {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        }
      });
      if (!response.ok) {
        setServerErrorModal(true);
        return;
      }
      const data = await response.json();
      const allPosts = data.noticePost
        ? [data.noticePost, ...data.posts]
        : data.posts;
      setPosts(allPosts);
      setNoticePost(data.noticePost);
    } catch (e) {
      setServerErrorModal(true);
    } finally {
      setLoading(false);
    }

  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  if (loading) return <ActivityIndicator style={{ marginTop: Spacing['2xl'] }} color={Colors.primary} />;

  return (
    <>
      <FlatList
        // 1. 데이터
        data={posts}

        // 2. 각 항목 렌더링
        keyExtractor={(item) => item.postId.toString()}
        renderItem={({ item }) => (
          <PostCard
            title={item.title}
            content={item.contentPreview}
            author={item.writerNickname}
            createdAt={formatTimeAgo(item.createdAt)}
            commentsCount={item.commentCount}
            isNotice={item.notice}
            onPress={() => router.push(`/group/${meetingId}/post/${item.postId}`)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}

        // 3. 헤더/빈상태
        ListHeaderComponent={() => (
          <>
            {/* 공지 배너 - 항상 고정 */}
            {/* noticePost가 있을 때만 배너 보여주기 */}
            {noticePost && (
              <View style={styles.noticeBanner}>
                <View style={styles.noticeBannerIcon}>
                  <Megaphone size={22} color={Colors.primary} fill={Colors.primaryLight} />
                </View>
                <Text style={styles.noticeBannerText}>{noticePost.title}</Text>
              </View>
            )}
            {/* 게시판 텍스트 */}
            <Text style={styles.titleText}>게시판</Text>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            icon={<File size={40} color={Colors.gray300} />}
            title="아직 게시글이 없어요"
            description="첫 번째 게시글을 작성해보세요!"
          />
        )}

        // 4. 스타일/옵션
        showsVerticalScrollIndicator={false}
      />
      {/* 서버 오류 모달 */}
      <ServerErrorModal
        visible={serverErrorModal}
        onClose={() => setServerErrorModal(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  noticeBanner: {
    backgroundColor: Colors.gray100,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  noticeBannerIcon: {
    marginRight: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: Radius.full,
  },
  noticeBannerText: {
    fontSize: Typography.base,
    fontWeight: '700',
  },
  titleText: {
    fontSize: Typography.xl,
    fontWeight: '800',
    color: Colors.black,
    marginBottom: Spacing.lg,
    marginTop: Spacing.lg,
  },
  separator: {
    height: Spacing.md,
  },
});