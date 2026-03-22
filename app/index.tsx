import Button from "@/components/ui/Button";
import { Colors, Radius, Shadow, Spacing, Typography } from "@/constants/theme";
import { useRouter } from "expo-router";
import React from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SplashScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      
      <View style={styles.container}>

        {/* 중앙 로고 영역 */}
        <View style={styles.centerBlock}>
          <View style={styles.logoCircle}>
            {/* 피그마 디자인 아이콘 - 나중에 실제 이미지로 교체 */}
            <Text style={styles.logoIcon}>👥</Text>
          </View>
          <Text style={styles.logoText}>우리끼리</Text>
          <Text style={styles.subText}>그룹 스케줄링을 간단하게</Text>
        </View>

        {/* 하단 버튼 영역 */}
        <View style={styles.bottomBlock}>
          <Button
            label="시작하기"
            onPress={() => router.push("/signup")}
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

      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    justifyContent: "space-between",
    paddingVertical: Spacing['3xl'],
  },
  centerBlock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  bottomBlock: {
    width: "100%",
    gap: Spacing.sm,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  logoIcon: {
    fontSize: 44,
  },
  logoText: {
    fontSize: Typography['3xl'],
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: -0.5,
  },
  subText: {
    fontSize: Typography.base,
    fontWeight: "500",
    color: Colors.gray500,
    textAlign: "center",
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