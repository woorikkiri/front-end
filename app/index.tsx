import Button from "@/components/ui/Button";
import { Colors, Spacing, Typography } from "@/constants/theme";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import React from "react";
import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SplashScreen = () => {
  const router = useRouter();

  const handleStart = async () => {
    await AsyncStorage.setItem('hasLaunched', 'true');
    router.push("/signup");
  };

  const handleLogin = async () => {
    await AsyncStorage.setItem('hasLaunched', 'true');
    router.push("/login");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <View style={styles.container}>

        {/* 중앙 로고 영역 */}
        <View style={styles.centerBlock}>
          <View style={styles.logoGroup}>
            <Image
              source={require('@/assets/images/logo_text.png')}
              style={styles.logoText}
              resizeMode="contain"
            />
            <Image
              source={require('@/assets/images/logo_character.png')}
              style={styles.logoCharacter}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.subText}>그룹 스케줄링을 간단하게</Text>
        </View>

        {/* 하단 버튼 영역 */}
        <View style={styles.bottomBlock}>
          <Button
            label="시작하기"
            onPress={handleStart}
          />
          <View style={styles.footer}>
            <Text style={styles.footerText}>이미 계정이 있나요? </Text>
            <Button
              label="로그인"
              variant="ghost"
              size="sm"
              fullWidth={false}
              onPress={handleLogin}
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
    gap: Spacing.lg,
  },
  logoGroup: {
    alignItems: "center",
  },
  logoText: {
    width: 600,
    height: 350,
  },
  logoCharacter: {
    width: 320,
    height: 320,
    marginTop: -220,
  },
  bottomBlock: {
    width: "100%",
    gap: Spacing.sm,
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