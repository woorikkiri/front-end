import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import TextInput from "@/components/ui/TextInput";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
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

const LoginScreen = () => {
  const router = useRouter();

  // ───── 상태 관리 ─────
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // ───── ref ─────
  const passwordRef = useRef<RNTextInput>(null);

  // ───── 유효성 검사 ─────
  const validate = () => {
    const newErrors = { email: "", password: "" };
    if (!email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    }
    if (!password) newErrors.password = "비밀번호를 입력해주세요.";
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

  // ───── 로그인 ─────
  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    // TODO: 실제 API 연동
    setTimeout(() => {
      setLoading(false);
      router.replace("/(tabs)/home");
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

      <Header title="로그인" />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 타이틀 */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>우리끼리</Text>
          <Text style={styles.subTitle}>그룹 일정, 한 번에 맞추기</Text>
        </View>

        {/* 폼 */}
        <View style={styles.formSection}>
          <TextInput
            label="이메일"
            placeholder="example@email.com"
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            error={errors.email}
            required
          />

          <TextInput
            ref={passwordRef}
            label="비밀번호"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
            secureTextEntry={!showPassword}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            error={errors.password}
            required
            rightElement={
              <PasswordToggle
                show={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
              />
            }
          />

          {/* 비밀번호 찾기 button으로 바꾸기..? 근데 위치가 좀 달라져서. 일단 내비둠.*/}
          <TouchableOpacity
            onPress={() => router.push("/reset-password")}
            style={styles.forgotBtn}
          >
            <Text style={styles.forgotText}>비밀번호를 잊으셨나요?</Text>
          </TouchableOpacity>
        </View>

        {/* 버튼 */}
        <View style={styles.buttonSection}>
          <Button
            label="로그인"
            onPress={handleLogin}
            loading={loading}
          />
          <View style={styles.footer}>
            <Text style={styles.footerText}>계정이 없으신가요? </Text>
            <Button
              label="회원가입"
              variant="ghost"
              size="sm"
              fullWidth={false}
              onPress={() => router.push("/signup")}
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

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
  forgotBtn: {
    alignSelf: "flex-start",
  },
  forgotText: {
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: "700",
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
