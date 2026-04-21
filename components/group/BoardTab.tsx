// BoardTab.tsx
import PostCard from '@/components/board/PostCard';
import { API } from '@/constants/api';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { formatTimeAgo } from '@/utils/date';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
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
  contentPreview: string;  // ← content 아니고 contentPreview!
  notice: boolean;
  writerNickname: string;
  writerId: number;
  createdAt: string;
  commentCount: number;
  imageUrl: null | string;
}

// 나중에 API로 받아올 데이터
const DUMMY_POSTS = [
  {
    id: 1,
    title: '회비 미납자 분들 확인 부탁드려요',
    content: '이번 주까지 미납자 확인 부탁드려요.',
    author: '방장',
    createdAt: '2026-04-05T00:06:54',
    commentCount: 3,
    isNotice: true,
  },
  {
    id: 2,
    title: '확인 부탁드려요',
    content: '확인 부탁드려요.',
    author: 'sora',
    createdAt: '2026-04-13T00:06:54',
    commentCount: 1,
  },

]

export default function BoardTab({ meetingId }: BoardTabProps) {
  const router = useRouter();
  const noticePost = DUMMY_POSTS.find(post => post.isNotice); // const noticePost = posts.find(post => post.notice);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(API.getPosts(meetingId));
        const data = await response.json();
        setPosts(data.posts);  // ← data.posts 안에 있어!
      } catch (e) {
        // 에러 처리
      }
    };
    fetchPosts();
  }, []);

  return (
    <FlatList
      // 1. 데이터
      data={DUMMY_POSTS}
      // data={posts}  // ← API로 받아온 데이터로 바꿔주기

      // 2. 각 항목 렌더링
      keyExtractor={(item) => item.id.toString()} // ← item.postId로 바꿔주기
      renderItem={({ item }) => (
        <PostCard
          title={item.title}
          content={item.content} // ← contentPreview로 바꿔주기
          author={item.author} // ← writerNickname으로 바꿔주기
          createdAt={formatTimeAgo(item.createdAt)}
          commentsCount={item.commentCount}
          isNotice={item.isNotice} //notice로 바꿔주기
          onPress={() => router.push(`/group/${meetingId}/${item.id}`)} // ← item.postId로 바꿔주기
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
                <Ionicons name="alert-circle-outline" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.noticeBannerText}>{noticePost.title}</Text>
            </View>
          )}
          {/* 게시판 텍스트 */}
          <Text style={styles.titleText}>게시판</Text>
        </>
      )}

      // 4. 스타일/옵션
      showsVerticalScrollIndicator={false}
    />
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
    marginBottom: Spacing.lg,
  },
  noticeBannerIcon: {
    backgroundColor: Colors.primaryLight,
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
  },
  separator: {
    height: Spacing.md,
  },
});