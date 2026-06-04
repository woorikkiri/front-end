// components/ui/Header.tsx
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  title: string;
  onBack?: () => void;  // 따로 뒤로가기 동작 지정하고 싶을 때
  rightElement?: React.ReactNode;  // 오른쪽에 뭔가 넣고 싶을 때
}

export default function Header({ title, onBack, rightElement }: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();  // 따로 지정한 동작이 있으면 그거 실행
    } else {
      router.back();  // 없으면 그냥 뒤로가기
    }
  };

  return (
    <View style={styles.header}>
      {/* 왼쪽 뒤로가기 */}
      <TouchableOpacity
        onPress={handleBack}
        style={styles.backButton}
        hitSlop={12}
      >
        <ArrowLeft size={24} color={Colors.black} />
      </TouchableOpacity>

      {/* 중앙 타이틀 */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* 오른쪽 영역 - 없으면 균형 맞추는 빈 공간 */}
      <View style={styles.backButton}>
        {rightElement}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.lg,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  title: {
    fontSize: Typography.lg,
    fontWeight: '800',
    color: Colors.black,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});