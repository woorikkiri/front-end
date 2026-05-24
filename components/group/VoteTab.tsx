// VoteTab.tsx
import VoteBottomSheet from '@/components/group/vote/VoteBottomSheet';
import { VoteItem } from '@/components/group/vote/VoteCard';
import VoteCreateForm from '@/components/group/vote/VoteCreateForm';
import VoteList from '@/components/group/vote/VoteList';
import { Spacing } from '@/constants/theme';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

interface VoteTabProps {
  meetingId: number;
}

export default function VoteTab({ meetingId }: VoteTabProps) {
  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [selectedVote, setSelectedVote] = useState<VoteItem | null>(null);

  // 바텀시트를 코드로 열고 닫는 리모컨 같은 것
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  return (
    <View style={styles.container}>
      {mode === 'list' ? (
        <VoteList
          onCreatePress={() => setMode('create')}
          onVotePress={(vote) => {
            setSelectedVote(vote);
            bottomSheetRef.current?.present();  // 열기
          }}
        />
      ) : (
        <VoteCreateForm onBack={() => setMode('list')} />
      )}

      <VoteBottomSheet
        ref={bottomSheetRef}
        vote={selectedVote}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.lg,
  },
});