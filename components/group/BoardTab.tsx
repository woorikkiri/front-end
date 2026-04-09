// BoardTab.tsx
import PostCard from '@/components/board/PostCard';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import {
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native';

const DUMMY_POSTS = [
  {
    id: 1,
    title: '회비 미납자 분들 확인 부탁드려요',
    content: '이번 주까지 미납자 확인 부탁드려요.',
    author: '방장',
    createdAt: '10분 전',
    commentCount: 3,
    isNotice: true,
  },
  {
    id: 2,
    title: '확인 부탁드려요',
    content: '확인 부탁드려요.',
    author: 'sora',
    createdAt: '1시간 전',
    commentCount: 1,
  },

]

export default function BoardTab() {
  const noticePost = DUMMY_POSTS.find(post => post.isNotice);

  return (
    <>
      {/* 게시글 목록 - 스크롤 됨 */}
      <FlatList
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
        data={DUMMY_POSTS}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard
            title={item.title}
            content={item.content}
            author={item.author}
            createdAt={item.createdAt}
            commentsCount={item.commentCount}
            isNotice={item.isNotice}
            onPress={() => console.log('게시글 클릭')}
          />
        )}
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
    fontWeight: 'bold',
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