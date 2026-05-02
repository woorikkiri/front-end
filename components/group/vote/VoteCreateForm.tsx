// VoteCreateForm.tsx
import Button from '@/components/ui/Button';
import DatePicker from '@/components/ui/DatePicker';
import TextInput from '@/components/ui/TextInput';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface VoteCreateFormProps {
    onBack: () => void;
}

export default function VoteCreateForm({ onBack }: VoteCreateFormProps) {
    const [title, setTitle] = useState('');
    const [options, setOptions] = useState<string[]>(['', '']);
    const [isMultiple, setIsMultiple] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [deadline, setDeadline] = useState<string | null>(null);

    const addOption = () => {
        setOptions([...options, ''])
    }

    const removeOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index))
    }

    return (
        <ScrollView
            style={styles.container}          // ← 바깥 박스
            contentContainerStyle={styles.content}  // ← 안에 내용물 (paddingBottom 같은 거)
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.titleText}>새 투표 만들기</Text>
            <View style={styles.formContainer}>
                <TextInput
                    label='투표 제목'
                    placeholder='예: 저녁메뉴'
                    value={title}
                    onChangeText={setTitle}
                />
                <View style={styles.optionsContainer}>
                    {options.map((option, index) => (
                        <TextInput
                            key={index}
                            label={index === 0 ? '선택지' : ''}
                            placeholder={`선택지 ${index + 1}`}
                            value={option}
                            onChangeText={(text) => {
                                const newOptions = [...options];  // 배열 복사
                                newOptions[index] = text;         // 해당 인덱스만 변경
                                setOptions(newOptions);           // 저장
                            }}
                            rightElement={
                                options.length > 2 ? (
                                    <TouchableOpacity onPress={() => removeOption(index)}>
                                        <Ionicons name="close" size={18} color={Colors.gray500} />
                                    </TouchableOpacity>
                                ) : undefined
                            }
                        />
                    ))}
                    <Button
                        label='+ 선택지 추가'
                        onPress={addOption}
                        variant='ghost'
                        fullWidth={false}
                        style={{ paddingHorizontal: 0 }}
                        textStyle={{ fontSize: Typography.sm }}
                    />
                </View>

                <View style={styles.toggleSection}>
                    <View style={styles.toggle}>
                        <Text style={styles.toggleText}>복수 선택</Text>
                        <Switch
                            value={isMultiple}
                            onValueChange={setIsMultiple}
                            trackColor={{ false: Colors.gray300, true: Colors.primary }}
                        />
                    </View>
                    <View style={styles.toggle}>
                        <Text style={styles.toggleText}>익명 투표</Text>
                        <Switch
                            value={isAnonymous}
                            onValueChange={setIsAnonymous}
                            trackColor={{ false: Colors.gray300, true: Colors.primary }}
                        />
                    </View>
                </View>

                <View style={styles.deadlineSection}>
                    <Text style={styles.dateLabel}>마감일</Text>
                    <DatePicker
                        label="마감"
                        value={deadline}
                        onChange={setDeadline}
                    />
                </View>

                <View style={styles.buttonSection}>
                    <Button
                        label="취소"
                        onPress={onBack}
                        variant='cancel'
                        style={{ flex: 1 }}
                    />
                    <Button
                        label="투표 생성"
                        disabled={!title || options.some(o => !o.trim())} //마감일선택..도 넣어야할까? 고민
                        onPress={() => { }}
                        style={{ flex: 1 }}
                    />
                </View>


            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.xl,
    },
    content: {
        padding: Spacing.lg,
    },

    titleText: {
        fontSize: Typography.xl,
        fontWeight: '800',
        color: Colors.black,
    },

    formContainer: {
        marginTop: Spacing.lg,
        gap: Spacing.base,
    },
    optionsContainer: {
        gap: Spacing.xs,  // 선택지끼리는 더 좁게
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },

    // 토글 섹션
    toggleSection: {
        gap: Spacing.base,
    },
    toggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    toggleText: {
        fontSize: Typography.md,
        fontWeight: '600',
        color: Colors.gray900,
    },

    deadlineSection: {
        gap: Spacing.sm,
        marginTop: Spacing.lg,
    },


    dateLabel: {
        fontSize: Typography.sm,
        fontWeight: '600',
        color: Colors.gray900,
    },

    buttonSection: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginTop: Spacing.lg,
    },
});