// MembersTab.tsx
import Button from "@/components/ui/Button";
import ProfileCard from "@/components/ui/ProfileCard";
import { Spacing } from '@/constants/theme';
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View
} from 'react-native';


export default function MembersTab() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text>멤버</Text>
        <Button 
          label="초대" 
          onPress={() => {}}
          size="sm"
        />
      </View>
      {/* 멤버 리스트 */}
      <View style={styles.memberList}>
        <ProfileCard 
          name={name}
          email={email}
          profileImage={null}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing['lg'],
    paddingBottom: Spacing['3xl'],
  },
  titleSection: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
    marginBottom: Spacing['2xl'],
    alignItems: "flex-start",
    gap: Spacing.xs,
  },
  memberList: {
    gap: Spacing.base,
  }
});