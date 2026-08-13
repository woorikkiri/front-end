# 우리끼리 (WooriKkiri)
- 모임 구성원들이 쉽고 빠르게 일정을 조율하고 소통할 수 있는 모임 관리 서비스

<img width="300" height="300" alt="우리끼리 앱 사진" src="https://github.com/user-attachments/assets/6b3655a4-44f7-4670-aedb-de2afa44f39b" />

# 1. 프로젝트 소개
- **우리끼리**는 모임 구성원 간 일정 조율 과정에서 발생하는 불편함을 해결하기 위해 개발한 서비스입니다.
- 사용자는 모임을 생성하여 구성원을 초대할 수 있으며, 일정 조율을 통해 모두가 가능한 날짜를 선택하고 최종 일정을 확정할 수 있습니다. 또한 게시판, 투표, 푸시 알림 등을 통해 모임 운영을 더욱 편리하게 지원합니다.

# 2. 팀 & 역할

| 이름 | 역할 |
|---|---|
| 소연 | Frontend 100% |
| 예은 | Backend / Infra 100% |

### 소연 (Frontend)
- Figma 기반 전체 UI/UX 설계 및 화면 구조 정의
- 로고 제작 (Procreate)
- React Native(Expo Router) 기반 전체 화면 구현
- Zustand 기반 인증 상태 관리, 커스텀 훅으로 로직 분리
- FCM 알림 수신 및 클라이언트 처리 로직 구현 (토큰 등록, 포그라운드/탭 핸들러)

# 3. 주요기능

### 📅 일정 조율 - 히트맵 기반 시각화
구성원별로 가능한 날짜를 입력받아, 참여 가능 인원 수에 따라 색이 진해지는 히트맵 캘린더로 한눈에 겹치는 일정을 파악할 수 있습니다. 내가 선택한 날짜는 초록 점으로 별도 표시되며, 특정 인원을 '필수 참여자'로 지정하면 해당 인원이 선택한 날짜가 강조 표시됩니다. 작성자 또는 방장은 조율을 마감하거나 삭제할 수 있습니다.

<img width="280" alt="일정조율_필수참여자" src="https://github.com/user-attachments/assets/333f8705-109a-42ba-a1f9-d50d42f2078a" />

### 🗳 투표
모임 내 안건을 투표로 빠르게 결정할 수 있습니다. 복수 선택과 익명 투표를 옵션으로 지원하며, 참여 즉시 선택지별 득표율과 참여자를 확인할 수 있습니다 (익명 투표 시 참여자는 비공개). 마감된 투표는 진행중 목록에서 종료 섹션으로 내려가며, 최다 득표 선택지가 1위로 표시됩니다. 작성자 또는 방장에게는 더보기(`···`) 메뉴가 노출되어 투표 수정 · 종료 · 삭제를 할 수 있습니다.

<img width="280" alt="투표_복수선택" src="https://github.com/user-attachments/assets/27ec7c7d-bfe2-4e30-9c8a-3b7e9194f867" /> <img width="280" alt="투표참여자" src="https://github.com/user-attachments/assets/f388726f-80cd-4921-8b88-929c16d8611e" />

### 📅 확정 일정
일정 조율 결과를 참고하여 새 일정을 생성하거나, 조율 없이 바로 일정을 추가할 수도 있습니다. 제목 · 기간 · 시간 · 장소를 입력해 관리하며, 다가오는 일정과 지난 일정을 구분해 보여줍니다. 작성자 또는 방장은 일정을 수정·삭제할 수 있습니다.

<img width="280" alt="일정생성" src="https://github.com/user-attachments/assets/c13e255a-b556-4733-a068-b27bbd6d7457" /> <img width="280" alt="확정된일정" src="https://github.com/user-attachments/assets/a07bc79a-2d71-4b80-ac14-8ed99adea600" />

### 🔔 알림
일정 확정, 투표 생성, 공지 등록 등 모임 내 주요 활동을 FCM 푸시 알림으로 실시간으로 받아볼 수 있습니다. 알림 유형별로 아이콘이 구분되어 표시되며, 홈 화면 벨 아이콘에는 읽지 않은 알림 뱃지가 표시됩니다. 사용자별로 알림 종류를 켜고 끌 수 있습니다.

<img width="280" alt="알림설정" src="https://github.com/user-attachments/assets/af2e84d0-233f-4ea9-830e-86c1ec0fb70a" /> <img width="280" alt="알림" src="https://github.com/user-attachments/assets/87c7721e-e524-45c6-b1e8-68439dfca0b2" />

### 그 외 기능
- 회원가입 / 로그인 / JWT 인증
- 이메일 인증 기반 비밀번호 재설정 / 로그인 후 비밀번호 변경
- 프로필 조회·수정 (닉네임, 프로필 이미지 변경·삭제)
- 모임 생성 / 초대코드로 멤버 초대 및 모임 참여
- 모임 권한 관리 (방장 위임, 멤버 강퇴, 모임 나가기, 모임 수정·삭제)
- 게시글 작성·수정·삭제 / 공지 등록 / 댓글 / 게시글 이미지 첨부
- 캘린더 월별·일별 일정 조회

# 4. 기술 스택

## Frontend
- React Native
- Expo Router
- TypeScript

## State Management
- Zustand

## Key Libraries
- @gorhom/bottom-sheet
- react-native-calendars
- react-native-svg
- react-native-popover-view

## Notification
- Firebase Cloud Messaging (FCM)

## Backend
- [백엔드 레포](https://github.com/woorikkiri/back-end) (Spring Boot, MySQL, AWS)

## Dev Environment
- Android Studio (Emulator)
- nvm (Node v20)

# 5. 시스템 아키텍처
```
    React Native 
        │ 
    REST API (HTTPS) 
        │
    Spring Boot 
            ├── Spring Security 
            ├── JWT 
            ├── JPA 
            └── FCM 
        │ 
    MySQL (AWS RDS) 
        │ 
    AWS EC2 
        │ 
    AWS S3
```
# 6. 프로젝트 구조

## 폴더 트리
```
    woorikkiri/
    ├── app/                          # Expo Router 기반 화면
    │   ├── (tabs)/                    # 캘린더 · 그룹 · 설정 탭
    │   ├── group/[meetingId]/         # 모임 상세 (게시판 · 일정조율 · 투표 · 멤버)
    │   └── mypage/
    ├── assets/
    │   └── images/                    # 로고, 아이콘 등 정적 리소스
    ├── components/
    │   ├── group/                     # 도메인별 컴포넌트 (board · member · schedule · vote)
    │   └── ui/                        # 공통 컴포넌트 (Button, TextInput, Header, Modal 등)
    ├── constants/                     # theme.ts, api.ts
    ├── hooks/                         # 커스텀 훅 (useAuth, useVote, useError 등)
    ├── store/                         # Zustand (useAuthStore, useMeetingStore)
    └── utils/                         # date.ts
```

## 상태관리
인증 상태(토큰, 유저ID)는 Zustand(`useAuthStore`)로 전역 관리하며 AsyncStorage에 영속화합니다(AsyncStorage는 암호화를 지원하지 않아 향후 expo-secure-store로 교체 예정). 화면별 데이터(투표, 일정조율, 알림 등)는 각 화면에서 커스텀 훅으로 가져오며, `useFocusEffect`를 사용해 화면 복귀 시 자동으로 최신 데이터를 다시 불러옵니다.

<img width="600" alt="state_management_flow" src="https://github.com/user-attachments/assets/547bc560-4d4e-47f7-ada1-5efd1c7505d5" />

초기에는 prop drilling으로 상위 컴포넌트에서 하위로 데이터를 계속 넘기는 구조였으나, 여러 컴포넌트가 같은 데이터를 공유해야 하는 경우가 늘면서 커스텀 훅으로 로직을 분리했습니다.

## API 명세
백엔드 API 명세는 아래 노션 문서를 참고해 프론트엔드와 연동했습니다.

[API 명세서 보기](https://stingy-girdle-af8.notion.site/39c258a222c480fcb79fc5ff6fe420ed?v=362258a222c48264bd48883c791b311b&source=copy_link)

# 7. 트러블슈팅

### 투표 기능 - prop drilling 문제와 커스텀 훅 리팩토링

**문제**: 투표 기능을 `VoteTab → VoteList → VoteCard` 3단계 컴포넌트로 나눴다. 
초기엔 삭제 기능 하나만 있어 `onDelete` prop 하나만 전달하면 됐지만, 종료·수정 
기능이 추가되면서 prop을 하나 바꾸거나 추가할 때마다 세 파일을 모두 수정해야 
했다. 예를 들어 `onDelete`를 `onSuccess`로 이름만 바꾸는 작업도 세 파일에 
전부 반영해야 했다.

**원인**: `VoteList`가 실제로 prop을 사용하지 않고 `VoteCard`로 그대로 
전달만 하는 역할만 하고 있었다 — 전형적인 prop drilling 구조였다.

**해결**: API 호출과 상태 관리를 `useVote` 커스텀 훅으로 분리하고, 단순 
전달 역할만 하던 `VoteList`를 제거해 `VoteTab`이 레이아웃을 직접 담당하도록 
구조를 바꿨다.

```
변경 전: VoteTab → VoteList → VoteCard   (prop drilling)
변경 후: useVote(API·상태) + VoteTab(레이아웃) → VoteCard(UI만)
```

```tsx
// useVote.ts
export default function useVote(meetingId: number) {
  const [votes, setVotes] = useState<VoteItem[]>([]);

  const handleDelete = async (voteId: number) => {
    const res = await fetch(API.deleteVote(voteId), { method: 'DELETE', ... });
    if (!res.ok) return false;
    await fetchVotes();
    return true;
  };

  return { votes, loading, fetchVotes, handleDelete, handleClose, ... };
}

// VoteTab.tsx — VoteCard에 바로 전달
<VoteCard
  onDelete={() => handleDelete(item.voteId)}
  onClose={() => handleClose(item.voteId)}
/>
```

**배운 점**: 컴포넌트 분리 자체가 목적이 되어선 안 된다는 걸 깨달았다. 
중간에 단순히 prop만 전달하는 컴포넌트가 생기면 오히려 유지보수가 
어려워진다. 여러 컴포넌트가 같은 데이터를 다뤄야 할 때는 훅으로 
로직을 분리하는 것이 맞다는 기준을 얻었다.

### 알림 읽음 처리 - useCallback 클로저 문제

**문제**: 알림함에 머무는 동안은 안 읽음 상태를 유지하다가, 화면을 나갈 때 
한꺼번에 읽음 처리하는 패턴을 구현하려 했다.

```tsx
useFocusEffect(
  useCallback(() => {
    fetchNotifications();
    return () => {
      markAllAsRead(); // notifications가 항상 빈 배열로 캡처됨
    };
  }, [])
);
```

**원인**: `useCallback`의 의존성 배열이 `[]`라서, `markAllAsRead`가 컴포넌트 
마운트 시점의 `notifications`(빈 배열)를 클로저로 캡처한 채 고정되어 있었다. 
이후 `setNotifications`로 값이 갱신돼도 cleanup 함수는 처음 캡처된 값을 
계속 참조했다.

**해결**: `useRef`로 최신 값을 별도로 추적해 cleanup에서는 state 대신 
ref를 참조하도록 수정했다.

```tsx
const notificationsRef = useRef<NotificationItem[]>([]);

const fetchNotifications = async () => {
  const data = await res.json();
  setNotifications(data);
  notificationsRef.current = data; // ref도 같이 갱신
};

const markAllAsRead = () => {
  const unreadIds = notificationsRef.current.filter(n => !n.read).map(n => n.id);
  // ...
};
```

**배운 점**: `useCallback`/`useEffect`의 클로저는 의존성 배열 시점의 값을 
고정하므로, 콜백 내부에서 이후에 바뀌는 값을 최신으로 읽어야 한다면 
`useRef`로 우회해야 한다는 걸 실감했다.
