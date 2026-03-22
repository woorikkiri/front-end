import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import TextInput from "@/components/ui/TextInput";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  TextInput as RNTextInput,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
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
    password: "",
    confirmPassword: "",
  });

  // ───── ref ─────
  const emailRef = useRef<RNTextInput>(null);
  const passwordRef = useRef<RNTextInput>(null);
  const confirmPasswordRef = useRef<RNTextInput>(null);

  // ───── 이메일 중복 확인 ─────
  const handleEmailCheck = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors((prev) => ({ ...prev, email: "올바른 이메일을 입력해주세요." }));
      return;
    }
    setCheckingEmail(true);
    // TODO: 실제 API 연동
    setTimeout(() => {
      setCheckingEmail(false);
      setEmailChecked(true);
    }, 800);
  };

  // ───── 유효성 검사 ─────
  const validate = () => {
    const newErrors = {
      nickname: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!nickname.trim()) newErrors.nickname = "닉네임을 입력해주세요.";
    if (!email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    } else if (emailChecked === null) {
      newErrors.email = "이메일 중복 확인을 해주세요.";
    }
    if (!password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (password.length < 6) {
      newErrors.password = "비밀번호는 6자리 이상이어야 합니다.";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "비밀번호 확인을 입력해주세요.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

  // ───── 회원가입 ─────
  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    // TODO: 실제 API 연동
    setTimeout(() => {
      setLoading(false);
      router.replace("/login");
    }, 1500);
  };

  // ───── 비밀번호 토글 ─────
  const PasswordToggle = ({
    show,
    onToggle,
  }: {
    show: boolean;
    onToggle: () => void;
  }) => (
    <TouchableOpacity onPress={onToggle} hitSlop={8}>
      <Ionicons
        name={show ? "eye-off-outline" : "eye-outline"}
        size={20}
        color={Colors.gray500}
      />
    </TouchableOpacity>
  );

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
                  error={errors.email}
                />
              </View>
              <Button
                label={
                  checkingEmail ? "확인 중" : emailChecked === true ? "✓ 확인됨" : "중복 확인"
                }
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
            placeholder="6자리 이상 입력해주세요"
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
            secureTextEntry={!showPassword}
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            error={errors.password}
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
              setErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }}
            secureTextEntry={!showConfirmPassword}
            returnKeyType="done"
            onSubmitEditing={handleSignup}
            error={errors.confirmPassword}
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