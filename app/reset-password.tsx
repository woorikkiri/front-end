import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import Modal from "@/components/ui/Modal";
import PasswordToggle from "@/components/ui/PasswordToggle";
import TextInput from "@/components/ui/TextInput";
import { Colors, Spacing, Typography } from "@/constants/theme";
import usePasswordValidation from '@/hooks/usePasswordValidation';
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    TextInput as RNTextInput,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResetPasswordScreen() {
    const router = useRouter();

    // ───── 상태 관리 ─────
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // ───── 에러 관리 ─────
    const [errors, setErrors] = useState({
        email: "",
        code: "",
    });

    // 비밀번호 유효성 검사 훅
    const { errors: pwErrors, validatePassword, validateConfirmPassword } = usePasswordValidation();

    // ───── ref ─────
    const passwordRef = useRef<RNTextInput>(null);
    const confirmPasswordRef = useRef<RNTextInput>(null);

    // ───── 비밀번호 보기 토글 ─────
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // ───── 모달 ─────
    const [successModal, setSuccessModal] = useState(false);

    // ───── 에러 초기화 헬퍼 ─────
    // 특정 에러 하나만 바꿀 때 쓰는 함수
    const setError = (field: keyof typeof errors, message: string) => {
        setErrors(prev => ({ ...prev, [field]: message }));
    };

    // ───── 다음 버튼 ─────
    const handleNext = () => {
        if (step === 1) {
            if (!email) {
                setError("email", "이메일을 입력해주세요.");
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setError("email", "올바른 이메일 형식이 아닙니다.");
                return;
            }
            setStep(prev => prev + 1);
        }

        if (step === 2) {
            if (!code) {
                setError("code", "인증번호를 입력해주세요.");
                return;
            }
            if (code !== "0000") {
                setError("code", "잘못된 인증번호입니다.");
                return;
            }
            setStep(prev => prev + 1);
        }

        if (step === 3) {
            if (!validatePassword(password)) return;
            if (!validateConfirmPassword(password, confirmPassword)) return;
            // TODO: API 연동 후 교체
            setSuccessModal(true);
        }
    };

    // ───── 뒤로가기 ─────
    const handleBack = () => {
        if (step === 1) {
            router.back();
        } else {
            setStep(prev => prev - 1);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

            <Header
                title="비밀번호 재설정"
                onBack={handleBack}
            />

            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* ── step 1: 이메일 ── */}
                {step === 1 && (
                    <View>
                        <View style={styles.titleSection}>
                            <Text style={styles.title}>우리끼리계정의{"\n"}비밀번호를 재설정합니다.</Text>
                            <Text style={styles.subTitle}>비밀번호를 재설정할{"\n"}우리끼리계정의 이메일을 입력해주세요.</Text>
                        </View>
                        <View style={styles.formSection}>
                            <TextInput
                                label="우리끼리계정"
                                placeholder="이메일"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    setError("email", "");
                                }}
                                keyboardType="email-address"
                                error={errors.email}
                            />
                        </View>
                        <Button label="다음" onPress={handleNext} />
                    </View>
                )}

                {/* ── step 2: 인증번호 ── */}
                {step === 2 && (
                    <View>
                        <View style={styles.titleSection}>
                            <Text style={styles.title}>비밀번호 재설정을 위해{"\n"}사용자 확인을 진행합니다.</Text>
                            <Text style={styles.subTitle}>사용 중인 우리끼리계정 이메일로 인증해주세요.</Text>
                        </View>
                        <View style={styles.formSection}>
                            <TextInput
                                label="우리끼리계정"
                                value={email}
                                editable={false}
                            />
                            <TextInput
                                label="인증번호"
                                placeholder="인증번호를 입력해주세요"
                                value={code}
                                onChangeText={(text) => {
                                    setCode(text);
                                    setError("code", "");
                                }}
                                keyboardType="number-pad"
                                error={errors.code}
                            />
                        </View>
                        <Button label="다음" onPress={handleNext} />
                    </View>
                )}

                {/* ── step 3: 새 비밀번호 ── */}
                {step === 3 && (
                    <View>
                        <View style={styles.titleSection}>
                            <Text style={styles.title}>새로운 비밀번호를{"\n"}입력해주세요.</Text>
                        </View>
                        <View style={styles.formSection}>
                            <TextInput
                                label="새 비밀번호"
                                placeholder="8~32자, 영문 대소문자/숫자/특수문자 조합"
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                }}
                                ref={passwordRef}
                                returnKeyType="next"
                                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                                onBlur={() => validatePassword(password)}
                                secureTextEntry={!showPassword}
                                error={pwErrors.password}
                                rightElement={
                                    <PasswordToggle
                                        show={showPassword}
                                        onToggle={() => setShowPassword(!showPassword)}
                                    />
                                }
                            />
                            <TextInput
                                label="비밀번호 확인"
                                placeholder="비밀번호를 다시 입력해주세요"
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                }}
                                ref={confirmPasswordRef}
                                returnKeyType="done"
                                onSubmitEditing={handleNext}
                                onBlur={() => validateConfirmPassword(password, confirmPassword)}
                                secureTextEntry={!showConfirmPassword}
                                error={pwErrors.confirmPassword}
                                rightElement={
                                    <PasswordToggle
                                        show={showConfirmPassword}
                                        onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                                    />
                                }
                            />
                        </View>
                        <View style={styles.infoSection}>
                            <Text style={styles.infoText}>• 8~32자의 영문 대소문자, 숫자, 특수문자를 조합해주세요.</Text>
                            <Text style={styles.infoText}>• 다른 사이트와 동일하거나 쉬운 비밀번호는 사용하지 마세요.</Text>
                            <Text style={styles.infoText}>• 안전한 계정 사용을 위해 주기적으로 변경해주세요.</Text>
                        </View>
                        <Button label="완료" onPress={handleNext} />
                    </View>
                )}
            </ScrollView>

            <Modal
                visible={successModal}
                message="비밀번호가 변경되었습니다."
                showLeftBtn={false}
                rightBtnText="확인"
                rightBtnVariant="primary"
                onRightBtnPress={() => router.back()}
                onLeftBtnPress={() => {}}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    container: {
        paddingHorizontal: Spacing['2xl'],
        paddingBottom: Spacing['5xl'],
    },
    titleSection: {
        marginTop: Spacing.lg,
        marginBottom: Spacing['2xl'],
        gap: Spacing.xs,
    },
    title: {
        fontSize: Typography['2xl'],
        fontWeight: "900",
        color: Colors.black,
    },
    subTitle: {
        fontSize: Typography.base,
        color: Colors.gray500,
    },
    formSection: {
        gap: Spacing.base,
        marginBottom: Spacing.lg,
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
});