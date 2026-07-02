import { VoteItem } from '@/components/group/vote/VoteCard';
import Button from '@/components/ui/Button';
import ServerErrorModal from '@/components/ui/ServerErrorModal';
import { API } from '@/constants/api';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useRouter } from "expo-router";
import { ChevronRight, CircleCheck } from 'lucide-react-native';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VoteBottomSheetProps {
  vote: VoteItem | null;
  onSuccess: () => void;
  meetingId: number;
}

const VoteBottomSheet = forwardRef<BottomSheetModal, VoteBottomSheetProps>(
  ({ vote, onSuccess, meetingId }, ref) => {
    const router = useRouter();
    const { userToken } = useAuthStore();
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    const [hasVoted, setHasVoted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [serverErrorModal, setServerErrorModal] = useState(false);
    const [currentVote, setCurrentVote] = useState<VoteItem | null>(null);

    useEffect(() => {
      setCurrentVote(vote);
      setSelectedOptions(vote?.myOptionIds ?? []);  // [] → myOptionIds
      setHasVoted(vote?.participated ?? false); // 이미 투표했으면 결과 바로 보여주기
    }, [vote]);

    const toggleOption = (optionId: number) => {
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter(id => id !== optionId));
      } else {
        if (!vote?.multipleChoice) {
          setSelectedOptions([optionId]); // 단일 선택이면 하나만
        } else {
          setSelectedOptions([...selectedOptions, optionId]);
        }
      }
    };

    const handleVote = async (optionIds: number[]) => {
      if (!vote) return;
      setLoading(true);
      try {
        const response = await fetch(API.participateVote(vote.voteId), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
          },
          body: JSON.stringify({ optionIds }),
        });
        if (!response.ok) {
          setServerErrorModal(true);
          return;
        }
        // 상세 데이터 다시 fetch
        const detailRes = await fetch(API.getVote(vote.voteId), {
          headers: { 'Authorization': `Bearer ${userToken}` },
        });
        if (detailRes.ok) {
          const detailData = await detailRes.json();
          console.log(detailData);
          setCurrentVote(detailData); // 바텀시트 데이터 갱신
          setSelectedOptions(detailData.myOptionIds ?? []);
        }
        if (optionIds.length === 0) {
          setHasVoted(false);
        } else {
          setHasVoted(true);
        }
        onSuccess(); // VoteList 갱신
      } catch (e) {
        setServerErrorModal(true);
      } finally {
        setLoading(false);
      }
    };

    const totalCount = currentVote?.participantCount ?? 0;

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior="close"
        />
      ),
      []
    );

    return (
      <>
        <BottomSheetModal
          ref={ref}
          snapPoints={['50%', '85%']}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
        >
          <BottomSheetScrollView contentContainerStyle={styles.container}>
            {currentVote && (
              <>
                <Text style={styles.title}>{currentVote.title}</Text>
                <Text style={styles.sub}>
                  {currentVote.multipleChoice ? '복수 선택 가능 · ' : ''}
                  {currentVote.anonymous ? '익명 · ' : ''}
                  총 {totalCount}명 투표
                </Text>

                <View style={styles.divider} />

                {/* 투표 전 */}
                {!hasVoted && currentVote.status !== 'COMPLETED' && (
                  <>
                    {currentVote.options.map((option) => {
                      const isSelected = selectedOptions.includes(option.optionId);
                      return (
                        <TouchableOpacity
                          key={option.optionId}
                          style={[styles.option, isSelected && styles.optionSelected]}
                          onPress={() => toggleOption(option.optionId)}
                          activeOpacity={0.7}
                        >
                          <View style={[styles.radio, isSelected && styles.radioSelected]}>
                            {isSelected && <View style={styles.radioDot} />}
                          </View>
                          <Text style={styles.optionText}>{option.content}</Text>
                        </TouchableOpacity>
                      );
                    })}
                    <Button
                      label="투표하기"
                      onPress={() => handleVote(selectedOptions)}
                      disabled={selectedOptions.length === 0}
                      loading={loading}
                      style={{ marginTop: Spacing.sm }}
                    />
                  </>
                )}

                {/* 투표 후 */}
                {(hasVoted || currentVote.status === 'COMPLETED') && (
                  <>
                    {currentVote.options.map((option) => {
                      const isMyChoice = selectedOptions.includes(option.optionId);
                      const percent = totalCount > 0
                        ? Math.round((option.voteCount / totalCount) * 100)
                        : 0;
                      return (
                        <View key={option.optionId} style={styles.resultItem}>
                          <View style={styles.resultTop}>
                            <View style={styles.resultLabel}>
                              {isMyChoice && (
                                <CircleCheck size={18} color={Colors.white} fill={Colors.primary} />
                              )}
                              <Text style={[styles.optionText, !isMyChoice && { color: Colors.gray500 }]}>
                                {option.content}
                              </Text>
                            </View>
                            <Text style={[styles.countBadge, !isMyChoice && styles.countBadgeDim]}>
                              {option.voteCount}표
                            </Text>
                          </View>

                          <View style={styles.barBg}>
                            <View style={[
                              styles.barFill,
                              { width: `${percent}%` },
                              !isMyChoice && styles.barFillDim
                            ]} />
                          </View>
                        </View>
                      );
                    })}
                    {!currentVote.anonymous && totalCount > 0 && (
                      <TouchableOpacity
                        style={styles.detail}
                        onPress={() => {
                          (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
                          setTimeout(() => {
                            router.push(`/group/${meetingId}/vote/participants?voteId=${currentVote.voteId}`);
                          }, 300);
                        }}
                      >
                        <Text>{totalCount}명 참여</Text>
                        <ChevronRight size={15} />
                      </TouchableOpacity>
                    )}

                    {currentVote.status !== 'COMPLETED' && (
                      <Button
                        label="다시 투표하기"
                        onPress={() => setHasVoted(false)}
                        loading={loading}
                        variant="cancel"
                        style={{ marginTop: Spacing.sm }}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </BottomSheetScrollView>
        </BottomSheetModal>

        <ServerErrorModal
          visible={serverErrorModal}
          onClose={() => setServerErrorModal(false)}
        />
      </>
    );
  }
);

export default VoteBottomSheet;

const styles = StyleSheet.create({
  container: {
    padding: Spacing.base,
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  deadlineText: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    fontWeight: '500',
  },
  title: {
    fontSize: Typography.xl,
    fontWeight: '800',
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  sub: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginBottom: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.base,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  radioDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
  },
  optionText: {
    fontSize: Typography.base,
    fontWeight: '500',
    color: Colors.black,
  },
  resultItem: {
    marginBottom: Spacing.xl,
  },
  resultTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  resultLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  countBadge: {
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: '600',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  countBadgeDim: {
    color: Colors.gray500,
    backgroundColor: Colors.gray100,
  },
  barBg: {
    height: 8,
    backgroundColor: Colors.gray100,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
  },
  barFillDim: {
    backgroundColor: Colors.gray300,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: Spacing.sm,
  },
});