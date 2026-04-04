import Button from '@/components/ui/Button';
import MenuGroup, { MenuItem } from '@/components/ui/MenuGroup';
import Modal from '@/components/ui/modal';
import ProfileCard from '@/components/ui/ProfileCard';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import {
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ───── 타입 ─────
type Role = 'owner' | 'member';
type ModalType = 'kick' | 'delegate' | 'leave' | 'delete';

interface Member {
  id: number;
  nickname: string;
  role: Role;
  profileImage: string | null;
}

interface MembersTabProps {
  isLeader: boolean;
  meetingId?: number;
}

// ───── 임시 데이터 ─────
const DUMMY_MEMBERS: Member[] = [
  { id: 1, nickname: '홍길동', role: 'owner', profileImage: null },
  { id: 2, nickname: '김철수', role: 'member', profileImage: null },
  { id: 3, nickname: '박영희', role: 'member', profileImage: null },
  { id: 4, nickname: '이민준', role: 'member', profileImage: null },
  { id: 5, nickname: '최수아', role: 'member', profileImage: null },
  { id: 6, nickname: '정다은', role: 'member', profileImage: null },
  { id: 7, nickname: '한지수', role: 'member', profileImage: null },
];

const MY_ID = 1;
const PREVIEW_COUNT = 5;

export default function MembersTab({ isLeader, meetingId }: MembersTabProps) {
  const [members, setMembers] = useState<Member[]>(DUMMY_MEMBERS);
  const [expanded, setExpanded] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [modalType, setModalType] = useState<ModalType | null>(null);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const inviteCode = "AB12CD34"; // api에서 받아오기

  const visibleMembers = expanded ? members : members.slice(0, PREVIEW_COUNT);
  const hiddenCount = members.length - PREVIEW_COUNT;
  const hasMore = members.length > PREVIEW_COUNT;

  const selectedMember = members.find((m) => m.id === selectedMemberId) ?? null;

  // ───── 메뉴 핸들러 ─────
  const openMemberMenu = (memberId: number) => {
    setSelectedMemberId((prev) => (prev === memberId ? null : memberId));
  };

  const closeMenu = () => setSelectedMemberId(null);

  const openModal = (type: ModalType) => {
    setSelectedMemberId(null);
    setModalType(type);
  };

  const closeModal = () => setModalType(null);

  // ───── 확정 핸들러 ─────
  const handleKickConfirm = () => {
    if (!selectedMember) return;
    setMembers((prev) => prev.filter((m) => m.id !== selectedMember.id));
    closeModal();
  };

  const handleDelegateConfirm = () => {
    if (!selectedMember) return;
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === MY_ID) return { ...m, role: 'member' as Role };
        if (m.id === selectedMember.id) return { ...m, role: 'owner' as Role };
        return m;
      })
    );
    closeModal();
  };

  const handleLeaveConfirm = () => {
    // TODO: DELETE /api/meetings/{meetingId}/leave → router.replace('/(tabs)/home')
    closeModal();
  };

  const handleDeleteConfirm = () => {
    // TODO: DELETE /api/meetings/{meetingId} → router.replace('/(tabs)/home')
    closeModal();
  };

  // ───── 모달 설정 ─────
  const modalConfig: Record<ModalType, {
    message: string;
    rightBtnText: string;
    rightBtnVariant: 'danger' | 'primary' | 'warning' | 'cancel';
    onConfirm: () => void;
  }> = {
    kick: { message: '이 멤버를\n강퇴하시겠습니까?', rightBtnText: '강퇴', rightBtnVariant: 'danger', onConfirm: handleKickConfirm },
    delegate: { message: '이 멤버에게\n방장을 위임할까요?', rightBtnText: '위임', rightBtnVariant: 'primary', onConfirm: handleDelegateConfirm },
    leave: { message: '모임에서 나가면\n다시 초대받아야 해요.\n나가시겠습니까?', rightBtnText: '나가기', rightBtnVariant: 'warning', onConfirm: handleLeaveConfirm },
    delete: { message: '모임을 삭제하면\n되돌릴 수 없어요.\n삭제하시겠습니까?', rightBtnText: '삭제', rightBtnVariant: 'danger', onConfirm: handleDeleteConfirm },
  };

  // ───── 카드별 컨텍스트 메뉴 아이템 ─────
  const memberMenuItems: MenuItem[] = [
    {
      label: '방장 위임',
      onPress: () => openModal('delegate'),
      labelStyle: { color: Colors.primary },
      rightIcon: <Ionicons name="ribbon-outline" size={20} color={Colors.primary} />,
      showChevron: false,
    },
    {
      label: '멤버 강퇴',
      onPress: () => openModal('kick'),
      labelStyle: { color: Colors.error },
      rightIcon: <Ionicons name="person-remove-outline" size={20} color={Colors.error} />,
      showChevron: false,
    },
  ];

  // ───── 하단 메뉴 아이템 ─────
  const bottomMenuItems: MenuItem[] = isLeader
    ? [
      {
        label: '모임 수정',
        onPress: () => {/* TODO: router.push(`/edit-meeting/${meetingId}`) */ },
        rightIcon: <Ionicons name="pencil-outline" size={20} color={Colors.gray500} />,
        showChevron: false,
      },
      {
        label: '모임 삭제',
        onPress: () => openModal('delete'),
        labelStyle: { color: Colors.error },
        rightIcon: <Ionicons name="trash-outline" size={20} color={Colors.error} />,
        showChevron: false,
      },
    ]
    : [
      {
        label: '모임 나가기',
        onPress: () => openModal('leave'),
        labelStyle: { color: Colors.error },
        rightIcon: <Ionicons name="exit-outline" size={20} color={Colors.error} />,
        showChevron: false,
      },
    ];

  return (
    <View style={styles.container}>

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
        />
      </View>

      {/* ── 멤버 목록 ── */}
      <View style={styles.memberList}>
        {visibleMembers.map((member) => {
          const isMe = member.id === MY_ID;
          const isOwner = member.role === 'owner';
          const isMenuOpen = selectedMemberId === member.id;

          return (
            <View key={member.id} style={[styles.memberWrapper, isMenuOpen && styles.memberWrapperActive]}>
              <TouchableOpacity
                activeOpacity={isLeader && !isMe ? 0.7 : 1}
                onPress={() => isLeader && !isMe && openMemberMenu(member.id)}
              >
                <ProfileCard
                  name={isMe ? `${member.nickname} (나)` : member.nickname}
                  role={isOwner ? '방장' : '멤버'}
                  profileImage={member.profileImage}
                  icon={
                    isLeader && !isMe
                      ? <Ionicons name="ellipsis-vertical" size={18} color={Colors.gray300} />
                      : undefined
                  }
                />
              </TouchableOpacity>

              {/* 메뉴: 카드 기준 absolute */}
              {isMenuOpen && (
                <>
                  <TouchableOpacity
                    style={StyleSheet.absoluteFillObject}
                    activeOpacity={1}
                    onPress={closeMenu}
                  />
                  <View style={styles.menuSheet}>
                    <Text style={styles.menuHeader}>{member.nickname}</Text>
                    <View style={styles.menuDivider} />
                    <MenuGroup items={memberMenuItems} />
                  </View>
                </>
              )}
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
      
      {/* 초대코드 팝업 */}
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
            await Share.share({
              message: `우리끼리 초대코드: ${inviteCode}`,
            });
          }}>
            <Text style={styles.icon}>📤</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
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
    zIndex: 10,
  },

  // relative 컨테이너
  memberWrapper: {
    position: 'relative',
    zIndex: 1,
  },
  // 메뉴 열린 카드만 zIndex 높임 → 아래 카드들 위에 메뉴가 뜸
  memberWrapperActive: {
    zIndex: 10,
  },

  // ── 컨텍스트 메뉴 팝업 ──
  menuSheet: {
    position: 'absolute',
    top: '20%',
    right: 40,
    width: 200,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
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
    zIndex: 1,
  },

  // ── 초대코드 팝업 ──
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
