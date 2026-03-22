import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import TextInput from "@/components/ui/TextInput";
import { Colors, Radius, Spacing, Typography } from "@/constants/theme";
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Preview() {
  const [value, setValue] = useState("");

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* ───── Header ───── */}
        <Text style={styles.pageTitle}>Header</Text>

        <Text style={styles.sectionTitle}>기본</Text>
        <View style={styles.previewBox}>
          <Header title="회원가입" />
        </View>

        <Text style={styles.sectionTitle}>오른쪽 아이콘 있을 때</Text>
        <View style={styles.previewBox}>
          <Header
            title="멤버"
            rightElement={
              <TouchableOpacity>
                <Ionicons name="person-add-outline" size={22} color={Colors.primary} />
              </TouchableOpacity>
            }
          />
        </View>

        {/* ───── Button ───── */}
        <Text style={[styles.pageTitle, { marginTop: Spacing['2xl'] }]}>Button</Text>

        <Text style={styles.sectionTitle}>Primary</Text>
        <Button label="로그인" onPress={() => {}} />

        <Text style={styles.sectionTitle}>Outline</Text>
        <Button label="취소" variant="outline" onPress={() => {}} />

        <Text style={styles.sectionTitle}>Ghost</Text>
        <Button label="이미 계정이 있나요? 로그인" variant="ghost" onPress={() => {}} />

        <Text style={styles.sectionTitle}>Danger</Text>
        <Button label="삭제" variant="danger" onPress={() => {}} />

        <Text style={styles.sectionTitle}>비활성화 / 로딩</Text>
        <View style={styles.row}>
          <Button label="비활성화" disabled fullWidth={false} onPress={() => {}} />
          <Button label="로딩중" loading fullWidth={false} onPress={() => {}} />
        </View>

        <Text style={styles.sectionTitle}>Size</Text>
        <View style={styles.row}>
          <Button label="Small" size="sm" fullWidth={false} onPress={() => {}} />
          <Button label="Medium" size="md" fullWidth={false} onPress={() => {}} />
          <Button label="Large" size="lg" fullWidth={false} onPress={() => {}} />
        </View>

        <Text style={styles.sectionTitle}> circle button</Text>
        <Button
          label="+"
          fullWidth={false}
          onPress={() => {}}
          style={{ borderRadius: Radius.full, width: 56, height: 56, paddingVertical: 0 }}
        />

        {/* ───── TextInput ───── */}
        <Text style={[styles.pageTitle, { marginTop: Spacing['2xl'] }]}>TextInput</Text>

        <Text style={styles.sectionTitle}>기본</Text>
        <TextInput
          placeholder="이메일을 입력하세요"
          value={value}
          onChangeText={setValue}
        />

        <Text style={styles.sectionTitle}>라벨 + 필수</Text>
        <TextInput
          label="이메일"
          placeholder="example@email.com"
          required
          value={value}
          onChangeText={setValue}
        />

        <Text style={styles.sectionTitle}>힌트</Text>
        <TextInput
          label="닉네임"
          placeholder="예니"
          hint="모임에서 표시될 이름이에요."
          value={value}
          onChangeText={setValue}
        />

        <Text style={styles.sectionTitle}>에러</Text>
        <TextInput
          label="이메일"
          placeholder="example@email.com"
          error="이미 존재하는 이메일입니다."
          value={value}
          onChangeText={setValue}
        />

        <Text style={styles.sectionTitle}>비밀번호</Text>
        <TextInput
          label="비밀번호"
          placeholder="8자 이상 입력해주세요"
          secureTextEntry
          value={value}
          onChangeText={setValue}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    padding: Spacing['2xl'],
    gap: Spacing.md,
  },
  pageTitle: {
    fontSize: Typography.xl,
    fontWeight: "800",
    color: Colors.black,
    letterSpacing: -0.5,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    fontWeight: "600",
    marginTop: Spacing.base,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "center",
  },
  // Header 미리보기용 박스
  previewBox: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
});