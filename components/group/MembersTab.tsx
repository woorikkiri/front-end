import Button from '@/components/ui/Button';
import MenuGroup, { MenuItem } from '@/components/ui/MenuGroup';
import Modal, { ButtonVariant } from '@/components/ui/Modal';
import ProfileCard from '@/components/ui/ProfileCard';
import ServerErrorModal from '@/components/ui/ServerErrorModal';
import { API } from '@/constants/api';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useMeetingStore } from '@/store/MeetingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Popover from 'react-native-popover-view';

// ───── 타입 ─────
type Role = 'HOST' | 'MEMBER';
type ModalType = 'kick' | 'delegate' | 'leave' | 'delete';

interface Member {
  userId: number;
  nickname: string;
  role: Role;
  profileImageUrl: string | null;
}

interface MembersTabProps {
  meetingId?: number;
  meetingName?: string;
}

const PREVIEW_COUNT = 5;

export default function MembersTab({ meetingId, meetingName }: MembersTabProps) {
  // ───── 라우터 / 인증 ─────
  const router = useRouter();
  const { userToken, userId } = useAuthStore();

  // ───── 멤버 데이터 ─────
  const [members, setMembers] = useState<Member[]>([]);
  const [myRole, setMyRole] = useState<Role>('MEMBER');
  const { setMeeting } = useMeetingStore();
  const amILeader = myRole === 'HOST';

  // ───── UI 상태 ─────
  const [expanded, setExpanded] = useState(false);
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);

  // ───── 모달 ─────
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [serverErrorModal, setServerErrorModal] = useState(false);

  // ───── 초대코드 ─────
  const [inviteCode, setInviteCode] = useState("");

  // ───── 파생 값 ─────
  const visibleMembers = expanded ? members : members.slice(0, PREVIEW_COUNT);
  const hiddenCount = members.length - PREVIEW_COUNT;
  const hasMore = members.length > PREVIEW_COUNT;
  const selectedMember = members.find((m) => m.userId === selectedMemberId) ?? null; // selectedMemberId로 실제 멤버 객체 찾기

  // ───── 데이터 fetch ─────
  const fetchMembers = async () => {
    if (!meetingId) return;
    try {
      const response = await fetch(API.getMembers(meetingId), {
        headers: { "Authorization": `Bearer ${userToken}` }
      });
      const data = await response.json();
      const sorted = [...data.members].sort((a, b) => {
        if (a.role === 'HOST') return -1;
        if (b.role === 'HOST') return 1;
        return 0;
      });
      setMembers(sorted);
      setMyRole(data.myRole);
      setMeeting(meetingId, data.myRole);

      const inviteResponse = await fetch(API.getMeetingInviteCode(meetingId), {
        headers: { "Authorization": `Bearer ${userToken}` }
      });
      const inviteData = await inviteResponse.json();
      setInviteCode(inviteData.inviteCode);

    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMembers();
    }, [])
  );

  // ───── 모달 제어 ─────
  // memberId: 어떤 멤버인지, type: 어떤 액션인지
  const openModal = (memberId: number, type: ModalType) => {
    setSelectedMemberId(memberId);
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedMemberId(null);
  };

  // ───── 멤버 관리  ─────
  const handleKickConfirm = async () => {
    if (!selectedMember) return;
    try {
      const response = await fetch(API.kickMember(meetingId ?? 0, selectedMember.userId), {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${userToken}`,
        },
      });

      // 실패
      if (!response.ok) {
        setServerErrorModal(true);
        return;
      }
      // 성공
      await fetchMembers();
      closeModal();

    } catch (error) {
      // 네트워크 오류
      setServerErrorModal(true);
    }
  };

  const handleDelegateConfirm = async () => {
    if (!selectedMember || !meetingId) return;

    try {
      const response = await fetch(API.transferOwnership(meetingId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          newOwnerId: selectedMember.userId,
        }),
      });

      // 실패
      if (!response.ok) {
        setServerErrorModal(true);
        return;
      }
      // 성공
      await fetchMembers();
      closeModal();

    } catch (error) {
      // 네트워크 오류
      setServerErrorModal(true);
    }
  };

  // ───── 모임 관리 ─────
  // 나가기
  const handleLeaveConfirm = async () => {
    if (!meetingId) return;

    try {
      const response = await fetch(API.leaveMeeting(meetingId), {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${userToken}`,
        },
      });
      if (!response.ok) {
        // 실패
        setServerErrorModal(true);
        return;
      }
      // 성공
      router.replace('/(tabs)/home');

    } catch (error) {
      // 네트워크 오류 등 예외 처리
      setServerErrorModal(true);
      return;
    }
  };
  // 삭제
  const handleDeleteConfirm = async () => {
    if (!meetingId) return;

    try {
      const response = await fetch(API.deleteMeeting(meetingId), {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        // 실패
        setServerErrorModal(true);
        return;
      }
      // 성공
      router.replace('/(tabs)/home');

    } catch (error) {
      // 네트워크 오류 등 예외 처리
      setServerErrorModal(true);
    }
  };

  // ───── 모달 설정 ─────
  const modalConfig: Record<ModalType, {
    message: string;
    rightBtnText: string;
    rightBtnVariant: ButtonVariant;
    onConfirm: () => void;
  }> = {
    kick: { message: '이 멤버를\n강퇴하시겠습니까?', rightBtnText: '강퇴', rightBtnVariant: 'danger', onConfirm: handleKickConfirm },
    delegate: { message: '이 멤버에게\n방장을 위임할까요?', rightBtnText: '위임', rightBtnVariant: 'warning', onConfirm: handleDelegateConfirm },
    leave: { message: '모임에서 나가면\n다시 초대받아야 해요.\n나가시겠습니까?', rightBtnText: '나가기', rightBtnVariant: 'warning', onConfirm: handleLeaveConfirm },
    delete: { message: '모임을 삭제하면\n되돌릴 수 없어요.\n삭제하시겠습니까?', rightBtnText: '삭제', rightBtnVariant: 'danger', onConfirm: handleDeleteConfirm },
  };

  // ───── 메뉴 아이템 ─────
  // 멤버 카드
  const getMemberMenuItems = (memberId: number): MenuItem[] => [
    {
      label: '방장 위임',
      onPress: () => {
        setOpenPopoverId(null);
        openModal(memberId, 'delegate');
      },
      labelStyle: { color: Colors.primary },
      rightIcon: <Ionicons name="ribbon-outline" size={20} color={Colors.primary} />,
      showChevron: false,
    },
    {
      label: '멤버 강퇴',
      onPress: () => {
        setOpenPopoverId(null);
        openModal(memberId, 'kick');
      },
      labelStyle: { color: Colors.error },
      rightIcon: <Ionicons name="person-remove-outline" size={20} color={Colors.error} />,
      showChevron: false,
    },
  ];
  // 하단 메뉴
  const bottomMenuItems: MenuItem[] = amILeader
    ? [
      {
        label: '모임 수정',
        onPress: () => router.push(`/group/${meetingId}/edit-meeting`),
        rightIcon: <Ionicons name="pencil-outline" size={20} color={Colors.gray500} />,
        showChevron: false,
      },
      {
        label: '모임 삭제',
        onPress: () => openModal(userId ?? 0, 'delete'),
        labelStyle: { color: Colors.error },
        rightIcon: <Ionicons name="trash-outline" size={20} color={Colors.error} />,
        showChevron: false,
      },
    ]
    : [
      {
        label: '모임 나가기',
        onPress: () => openModal(userId ?? 0, 'leave'),
        labelStyle: { color: Colors.error },
        rightIcon: <Ionicons name="exit-outline" size={20} color={Colors.error} />,
        showChevron: false,
      },
    ];

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {/* ── 멤버 수 + 초대 버튼 ── */}
      <View style={styles.header}>
        <Text style={styles.titleText}>멤버 {members.length}명</Text>
        <Button
          label="초대"
          onPress={() => setShowInviteModal(true)}
          variant="warning"
          size="sm"
          fullWidth={false}
          icon={<Ionicons name="person-add" size={16} color={Colors.primary} />}
          style={{ borderRadius: Radius.full }}
        />
      </View>

      {/* ── 멤버 목록 ── */}
      <View style={styles.memberList}>
        {visibleMembers.map((member) => {
          const isMe = member.userId === userId;
          const isOwner = member.role === 'HOST';

          return (
            <View key={member.userId} style={styles.memberWrapper}>
              <ProfileCard
                name={member.nickname}
                role={isOwner ? '방장' : '멤버'}
                profileImage={member.profileImageUrl}
                // 방장이고 내가 아닌 멤버에게만 ··· 팝오버 표시
                icon={
                  amILeader && !isMe ? (
                    <Popover
                      isVisible={openPopoverId === member.userId}  
                      onRequestClose={() => setOpenPopoverId(null)}
                      arrowSize={{ width: 0, height: 0 }}
                      backgroundStyle={{ backgroundColor: 'transparent' }}
                      from={(
                        <TouchableOpacity onPress={() => setOpenPopoverId(member.userId)}>
                          <Ionicons name="ellipsis-vertical" size={18} color={Colors.gray300} />
                        </TouchableOpacity>
                      )}
                    >
                      <View style={styles.menu}>
                        <Text style={styles.menuHeader}>
                          {member.nickname}님
                        </Text>
                        <View style={styles.menuDivider} />
                        <MenuGroup items={getMemberMenuItems(member.userId)} />
                      </View>
                    </Popover>
                  ) : undefined
                }
              />
            </View>
          );
        })}

        {/* 전체보기 / 접기 버튼 */}
        {hasMore && (
          <TouchableOpacity
            style={styles.expandBtn}
            onPress={() => setExpanded((prev) => !prev)}
            activeOpacity={0.7}
          >
            <Text style={styles.expandBtnText}>
              {expanded ? '접기' : `대화상대 전체보기 (${hiddenCount}명 더)`}
            </Text>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={Colors.gray500}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* ── 하단 모임 관리 ── */}
      <View style={styles.bottomSection}>
        <MenuGroup items={bottomMenuItems} />
      </View>

      {/* ── 모달 ── */}
      {modalType !== null && (
        <Modal
          visible
          message={modalConfig[modalType].message}
          rightBtnText={modalConfig[modalType].rightBtnText}
          rightBtnVariant={modalConfig[modalType].rightBtnVariant}
          leftBtnVariant="cancel"
          onLeftBtnPress={closeModal}
          onRightBtnPress={modalConfig[modalType].onConfirm}
          onBackDropPress={closeModal}
        />
      )}

      {/* ── 초대코드 모달 ── */}
      <Modal
        visible={showInviteModal}
        message="초대코드를 공유해보세요!"
        rightBtnText="확인"
        showLeftBtn={false}
        onLeftBtnPress={() => { }}
        onRightBtnPress={() => setShowInviteModal(false)}
        onBackDropPress={() => setShowInviteModal(false)}
        rightBtnVariant="primary"
      >
        <View style={styles.inviteBox}>
          <Text style={styles.inviteCode}>{inviteCode}</Text>
          <TouchableOpacity onPress={async () => {
            await Clipboard.setStringAsync(inviteCode);
          }}>
            <Text style={styles.icon}>📋</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={async () => {
            // 공유 메시지에 모임 설명도 추가하면 좋을듯
            await Share.share({
              message: `🎉 우리끼리 모임 초대\n\n모임명: ${meetingName}\n초대코드: ${inviteCode}\n\n우리끼리 앱에서 코드를 입력하면 바로 참여할 수 있어요!`,
            });
          }}>
            <Text style={styles.icon}>📤</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* 서버 오류 모달 */}
      <ServerErrorModal
        visible={serverErrorModal}
        onClose={() => setServerErrorModal(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.lg,
  },

  // ── 상단 ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  titleText: {
    fontSize: Typography.xl,
    fontWeight: '800',
    color: Colors.black,
  },

  // ── 멤버 목록 ──
  memberList: {
    gap: Spacing.md,
  },
  memberWrapper: {
    position: 'relative',
  },

  // ── 팝오버 메뉴 ──
  menu: {
    width: 160,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuHeader: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: Colors.gray500,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.border,
  },

  // ── 전체보기 버튼 ──
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Colors.gray100,
  },
  expandBtnText: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: Colors.gray500,
  },

  // ── 하단 모임 관리 ──
  bottomSection: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },

  // ── 초대코드 모달 ──
  inviteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    gap: Spacing.sm,
    width: '100%',
  },
  inviteCode: {
    fontSize: Typography.lg,
    fontWeight: '700',
    color: Colors.black,
    flex: 1,
    textAlign: 'center',
    letterSpacing: 2,
  },
  icon: {
    fontSize: 20,
  },
});