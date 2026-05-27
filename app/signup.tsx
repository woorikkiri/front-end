import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import Modal from "@/components/ui/modal";
import PasswordToggle from "@/components/ui/PasswordToggle";
import TextInput from "@/components/ui/TextInput";
import { API } from "@/constants/api";
import { Colors, Spacing, Typography } from "@/constants/theme";
import usePasswordValidation from "@/hooks/usePasswordValidation";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  TextInput as RNTextInput,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignupScreen = () => {
  const router = useRouter();

  // ───── 상태 관리 ─────
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailChecked, setEmailChecked] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    nickname: "",
    email: "",
  });
  const { errors: pwErrors, validatePassword, validateConfirmPassword, setError: setPwError } = usePasswordValidation();
  const [serverErrorModal, setServerErrorModal] = useState(false);

  // ───── ref ─────
  const emailRef = useRef<RNTextInput>(null);
  const passwordRef = useRef<RNTextInput>(null);
  const confirmPasswordRef = useRef<RNTextInput>(null);

  // ───── 이메일 중복 확인 ─────
  const handleEmailCheck = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors((prev) => ({ ...prev, email: "올바른 이메일 형식을 입력해주세요." }));
      return;
    }
    setCheckingEmail(true);

     try {
        const response = await fetch(API.checkEmail(email));
        const data = await response.json();

        if (data.available) {
            setEmailChecked(true);  // 사용 가능
        } else {
            setErrors(prev => ({ ...prev, email: "이미 사용 중인 이메일입니다." }));
            setEmailChecked(null);
        }
    } catch (e) {
        setServerErrorModal(true);
    } finally {
        setCheckingEmail(false);
    }
  };

  // ───── 유효성 검사 ─────
  // onBlur 시점에 각 필드별로 에러 메시지 설정, 회원가입 버튼 클릭 시 전체 검증
  const validate = () => {
    const newErrors = {
      nickname: "",
      email: "",
    };

    if (!nickname.trim()) newErrors.nickname = "닉네임을 입력해주세요.";
    if (!email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    } else if (emailChecked === null) {
      newErrors.email = "이메일 중복 확인을 해주세요.";
    }

    // 비밀번호 유효성 검사
    const isPasswordValid = validatePassword(password);
    const isConfirmValid = validateConfirmPassword(password, confirmPassword);

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "") && isPasswordValid && isConfirmValid;
  };

  // ───── 회원가입 ─────
  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    // 실제 API 연동
    
    try {
      const response = await fetch(API.signup, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          passwordConfirm: confirmPassword,
          nickname,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        switch (errorData.code) {
          case 'EMAIL_ALREADY_EXISTS':
            setErrors(prev => ({ ...prev, email: '이미 사용 중인 이메일입니다.' }));
            break;

          case 'PASSWORD_MISMATCH':
            setPwError('confirmPassword', '비밀번호가 일치하지 않습니다.');
            break;

          case 'VALIDATION_ERROR':
            setPwError('password', '비밀번호는 8~32자이며, 대문자/소문자/숫자/특수문자를 포함해야 합니다.');
            break;

          case 'INTERNAL_SERVER_ERROR': // 없어도 될듯.
          default:
            setServerErrorModal(true);
            break;
        }
        return;  // ← 에러니까 여기서 멈춤
      }

      router.replace("/login");

    } catch (e) {
      // 네트워크 오류 (인터넷 연결 안될 때 등)
      setServerErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* 헤더 */}
      <Header title="회원가입" />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 타이틀 */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>같이 모일 사람들과</Text>
          <Text style={styles.subTitle}>일정 맞추기, 이제 빠르게</Text>
        </View>

        {/* 폼 */}
        <View style={styles.formSection}>

          <TextInput
            label="닉네임"
            placeholder="예니"
            value={nickname}
            onChangeText={(v) => {
              setNickname(v);
              setErrors((prev) => ({ ...prev, nickname: "" }));
            }}
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
            onBlur={() => {
              if (!nickname.trim()) {
                setErrors((prev) => ({ ...prev, nickname: "닉네임을 입력해주세요." }));
              }
            }}
            error={errors.nickname}
            required
            hint="모임에서 표시될 이름이에요."
          />

          {/* 이메일 + 중복확인 나란히 */}
          <View>
            <Text style={styles.emailLabel}>
              이메일 <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.emailRow}>
              <View style={styles.emailInputWrap}>
                <TextInput
                  ref={emailRef}
                  placeholder="example@email.com"
                  value={email}
                  onChangeText={(v) => {
                    setEmail(v);
                    setEmailChecked(null);
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  keyboardType="email-address"
                  returnKeyType="done"
                  onBlur={() => {
                    if (!email) {
                      setErrors(prev => ({ ...prev, email: "이메일을 입력해주세요." }))
                    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                      setErrors(prev => ({ ...prev, email: "올바른 이메일 형식을 입력해주세요." }))
                    }
                  }}
                  error={errors.email}
                />
              </View>
              <Button
                label={checkingEmail ? "확인 중" : emailChecked === true ? "✓ 확인됨" : "중복 확인"}
                loading={checkingEmail}
                variant={emailChecked === true ? "ghost" : "outline"}
                size="md"
                fullWidth={false}
                onPress={handleEmailCheck}
                disabled={checkingEmail || emailChecked === true}
                style={{ alignSelf: "flex-start", marginTop: 1 }}
              />
            </View>
          </View>

          <TextInput
            ref={passwordRef}
            label="비밀번호"
            placeholder="8~32자, 영문 대소문자/숫자/특수문자 조합"
            value={password}
            onChangeText={(v) => {
              setPassword(v);
            }}
            secureTextEntry={!showPassword}
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            onBlur={() => validatePassword(password)}
            error={pwErrors.password}
            required
            rightElement={
              <PasswordToggle
                show={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
              />
            }
          />

          <TextInput
            ref={confirmPasswordRef}
            label="비밀번호 확인"
            placeholder="비밀번호를 다시 입력해주세요"
            value={confirmPassword}
            onChangeText={(v) => {
              setConfirmPassword(v);
            }}
            secureTextEntry={!showConfirmPassword}
            returnKeyType="done"
            onSubmitEditing={handleSignup}
            onBlur={() => validateConfirmPassword(password, confirmPassword)}
            error={pwErrors.confirmPassword}
            required
            rightElement={
              <PasswordToggle
                show={showConfirmPassword}
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
          />
        </View>

        {/* 버튼 */}
        <View style={styles.buttonSection}>
          <Button
            label="회원가입"
            onPress={handleSignup}
            loading={loading}
          />
          <View style={styles.footer}>
            <Text style={styles.footerText}>이미 계정이 있나요? </Text>
            <Button
              label="로그인"
              variant="ghost"
              size="sm"
              fullWidth={false}
              onPress={() => router.push("/login")}
            />
          </View>
        </View>
      </ScrollView>
      {/* 서버 오류 모달 */}
      <Modal
        visible={serverErrorModal}
        message={"서버 오류가 발생했습니다.\n잠시 후 다시 시도해주세요."}
        showLeftBtn={false}
        rightBtnText="확인"
        rightBtnVariant="primary"
        onRightBtnPress={() => setServerErrorModal(false)}
        onLeftBtnPress={() => { }}
      />
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing['3xl'],
  },
  titleSection: {
    marginTop: Spacing.lg,
    marginBottom: Spacing['2xl'],
    alignItems: "center",
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
  emailLabel: {
    fontSize: Typography.sm,
    fontWeight: "600",
    color: Colors.gray900,
    marginBottom: Spacing.xs,
  },
  required: {
    color: Colors.primary,
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  emailInputWrap: {
    flex: 1,
  },
  buttonSection: {
    gap: Spacing.sm,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
});