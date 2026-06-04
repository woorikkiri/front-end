import { VoteItem } from '@/components/group/vote/VoteCard';
import Button from '@/components/ui/Button';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { CalendarClock, CircleCheck } from 'lucide-react-native';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VoteBottomSheetProps {
  vote: VoteItem | null;
}

const VoteBottomSheet = forwardRef<BottomSheetModal, VoteBottomSheetProps>(
  ({ vote }, ref) => {
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
      setSelectedOptions([]);
      setHasVoted(false);
    }, [vote]);

    const toggleOption = (optionId: number) => {
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter(id => id !== optionId));
      } else {
        setSelectedOptions([...selectedOptions, optionId]);
      }
    };

    const totalCount = vote?.options.reduce((sum, o) => sum + o.voteCount, 0) ?? 0;

    // 배경 렌더링 함수
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
      <BottomSheetModal
        ref={ref}
        snapPoints={['50%', '85%']}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <BottomSheetScrollView contentContainerStyle={styles.container}>
          {vote && (
            <>
              {/* 마감일 */}
              <View style={styles.deadlineRow}>
                <CalendarClock size={15} color={Colors.gray500} />
                <Text style={styles.deadlineText}>{vote.deadline}</Text>
              </View>

              {/* 제목 + 총 투표수 */}
              <Text style={styles.title}>{vote.title}</Text>
              <Text style={styles.sub}>총 {totalCount}명 투표</Text>

              <View style={styles.divider} />

              {/* 투표 전 */}
              {!hasVoted && (
                <>
                  {vote.options.map((option) => {
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
                    onPress={() => setHasVoted(true)}
                    disabled={selectedOptions.length === 0}
                    style={{ marginTop: Spacing.sm }}
                  />
                </>
              )}

              {/* 투표 후 */}
              {hasVoted && (
                <>
                  {vote.options.map((option) => {
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

                        {option.voters && option.voters.length > 0 && (
                          <View style={styles.votersRow}>
                            {option.voters.slice(0, 3).map((voter) => (
                              <View key={voter} style={styles.voterChip}>
                                <Text style={styles.voterText}>{voter}</Text>
                              </View>
                            ))}
                            {option.voters.length > 3 && (
                              <View style={styles.voterChip}>
                                <Text style={styles.voterText}>+{option.voters.length - 3}명</Text>
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    );
                  })}
                  <Button
                    label="다시 투표하기"
                    onPress={() => {
                      setHasVoted(false);
                      setSelectedOptions([]);
                    }}
                    variant="cancel"
                    style={{ marginTop: Spacing.sm }}
                  />
                </>
              )}
            </>
          )}
        </BottomSheetScrollView>
      </BottomSheetModal>
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
  votersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  voterChip: {
    backgroundColor: Colors.gray100,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  voterText: {
    fontSize: Typography.xs,
    color: Colors.gray700,
  },
});