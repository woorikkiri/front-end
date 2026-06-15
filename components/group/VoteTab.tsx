import VoteBottomSheet from '@/components/group/vote/VoteBottomSheet';
import { VoteItem } from '@/components/group/vote/VoteCard';
import VoteCreateForm from '@/components/group/vote/VoteCreateForm';
import VoteList from '@/components/group/vote/VoteList';
import ServerErrorModal from '@/components/ui/ServerErrorModal';
import { API } from '@/constants/api';
import { Colors, Spacing } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface VoteTabProps {
  meetingId: number;
}

export default function VoteTab({ meetingId }: VoteTabProps) {
  const { userToken } = useAuthStore();
  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [selectedVote, setSelectedVote] = useState<VoteItem | null>(null);
  const [votes, setVotes] = useState<VoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [serverErrorModal, setServerErrorModal] = useState(false);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const fetchVotes = async () => {
    try {
      const response = await fetch(API.getVotes(meetingId), {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      if (!response.ok) {
        setServerErrorModal(true);
        return;
      }
      const data = await response.json();
      console.log(data);
      setVotes(data);
    } catch (e) {
      setServerErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchVotes();
    }, [])
  );

  const handleVotePress = async (vote: VoteItem) => {
    const response = await fetch(API.getVote(vote.voteId), {
      headers: { 'Authorization': `Bearer ${userToken}` },
    });
    if (response.ok) {
      const detail = await response.json();
      // setSelectedVote(detail); 백엔드 수정되면 이걸로하기
      setSelectedVote({
        ...detail,
        status: vote.status,
        multipleChoice: vote.multipleChoice,
        anonymous: vote.anonymous,
      });
      bottomSheetRef.current?.present();
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: Spacing['2xl'] }} color={Colors.primary} />;

  return (
    <>
      <View style={styles.container}>
        {mode === 'list' ? (
          <VoteList
            votes={votes}
            onCreatePress={() => setMode('create')}
            onVotePress={handleVotePress}
            onSuccess={fetchVotes}
          />
        ) : (
          <VoteCreateForm
            meetingId={meetingId}
            onBack={() => {
              setMode('list');
              fetchVotes(); // 생성 후 목록 갱신
            }}
          />
        )}

        <VoteBottomSheet
          ref={bottomSheetRef}
          vote={selectedVote}
          onSuccess={fetchVotes} // 투표 성공 후 목록 갱신
        />
      </View>

      <ServerErrorModal
        visible={serverErrorModal}
        onClose={() => setServerErrorModal(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.lg,
  },
});