import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import PasswordToggle from '@/components/ui/PasswordToggle';
import TextInput from '@/components/ui/TextInput';
import { API } from "@/constants/api";
import { Colors, Spacing, Typography } from '@/constants/theme';
import usePasswordValidation from '@/hooks/usePasswordValidation';
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import { useRef, useState } from 'react';
import {
    TextInput as RNTextInput,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChangePasswordScreen() {
    const router = useRouter();
    const { userToken } = useAuthStore();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [currentPasswordError, setCurrentPasswordError] = useState("");
    const { errors: pwErrors, validatePassword, validateConfirmPassword } = usePasswordValidation();

    // ref
    const currentPasswordRef = useRef<RNTextInput>(null);
    const newPasswordRef = useRef<RNTextInput>(null);
    const confirmPasswordRef = useRef<RNTextInput>(null);


    // 유효성 검사
    const handleSubmit = async () => {
        if (!currentPassword.trim()) {
            setCurrentPasswordError('현재 비밀번호를 입력해주세요.');
            return;
        }
        if (!validatePassword(newPassword)) return;
        if (!validateConfirmPassword(newPassword, confirmPassword)) return;

        try {
            const response = await fetch(API.updatePassword, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                    newPasswordConfirm: confirmPassword,
                }),
            });
            const data = await response.json();

            if (data.code === 'PASSWORD_CHANGED') {
                router.back();
            } else if (data.code === 'INVALID_CURRENT_PASSWORD') {
                setCurrentPasswordError('현재 비밀번호가 일치하지 않습니다.');
            }
        } catch (e) {
            console.error('비밀번호 변경 실패', e);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

            <Header title='비밀번호 변경' />
            <View style={styles.container}>
                <View style={styles.infoSection}>
                    <Text style={styles.infoText}>• 안전한 비밀번호로 내정보를 보호하세요.</Text>
                    <Text style={styles.infoText}>• 다른 사이트와 동일하거나 쉬운 비밀번호는 사용하지 마세요.</Text>
                    <Text style={styles.infoText}>• 안전한 계정 사용을 위해 주기적으로 변경해주세요.</Text>
                </View>

                <View style={styles.formSection}>
                    <TextInput
                        label="현재 비밀번호"
                        placeholder="현재 비밀번호를 입력해주세요."
                        value={currentPassword}
                        onChangeText={(v) => {
                            setCurrentPassword(v);
                        }}
                        secureTextEntry={!showPassword}
                        returnKeyType='next'
                        onSubmitEditing={() => newPasswordRef.current?.focus()}
                        error={currentPasswordError}
                        required
                        rightElement={
                            <PasswordToggle
                                show={showPassword}
                                onToggle={() => setShowPassword(!showPassword)}
                            />
                        }
                    />
                    <TextInput
                        ref={newPasswordRef}
                        label="새 비밀번호"
                        placeholder="새 비밀번호를 입력해주세요."
                        value={newPassword}
                        onChangeText={(v) => {
                            setNewPassword(v);
                        }}
                        secureTextEntry={!showNewPassword}
                        returnKeyType='next'
                        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                        error={pwErrors.password}
                        onBlur={() => validatePassword(newPassword)}
                        required
                        rightElement={
                            <PasswordToggle
                                show={showNewPassword}
                                onToggle={() => setShowNewPassword(!showNewPassword)}
                            />
                        }
                    />
                    <TextInput
                        ref={confirmPasswordRef}
                        label="새 비밀번호 확인"
                        placeholder="새 비밀번호를 다시 입력해주세요."
                        value={confirmPassword}
                        onChangeText={(v) => {
                            setConfirmPassword(v);
                        }}
                        secureTextEntry={!showConfirmPassword}
                        returnKeyType='done'
                        error={pwErrors.confirmPassword}
                        onBlur={() => validateConfirmPassword(newPassword, confirmPassword)}
                        required
                        rightElement={
                            <PasswordToggle
                                show={showConfirmPassword}
                                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                        }
                    />
                </View>

                <View style={styles.buttonSection}>
                    <Button label="확인" onPress={handleSubmit} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    container: {
        paddingTop: Spacing['2xl'],
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing['3xl'],
    },
    formSection: {
        gap: Spacing.base,
        marginBottom: Spacing.lg,
    },
    buttonSection: {
        gap: Spacing.sm,
    },
    infoSection: {
        gap: Spacing.xs,
        marginBottom: Spacing.lg,
    },
    infoText: {
        fontSize: Typography.sm,
        color: Colors.gray500,
        lineHeight: 20,
    },
})