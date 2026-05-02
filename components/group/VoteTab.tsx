// VoteTab.tsx
import VoteCreateForm from '@/components/group/vote/VoteCreateForm';
import VoteList from '@/components/group/vote/VoteList';
import { Spacing } from '@/constants/theme';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

interface VoteTabProps {
  meetingId: number;
}

export default function VoteTab({ meetingId }: VoteTabProps) {
  const [mode, setMode] = useState<'list' | 'create'>('list');

  return (
    <View style={styles.container}>
      {mode === 'list' ? (
        <VoteList onCreatePress={() => setMode('create')} />
      ) : (
        <VoteCreateForm onBack={() => setMode('list')} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.lg,
  },
});