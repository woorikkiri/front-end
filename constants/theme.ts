// ─── Brand Colors ────────────────────────────────────────────
export const Colors = {
  primary: '#F29A2E',       // 오렌지 (메인 브랜드)
  primaryLight: '#FEF3E2',  // 연한 오렌지 배경
  primaryDark: '#E0941A',   // 진한 오렌지 (pressed state)
  primaryAlpha: '#ffb55aec', // 오렌지 투명 (hover state)
  primaryBorder: '#F9C97A',

  black: '#1A1A1A',
  gray900: '#2D2D2D',
  gray700: '#555555',
  gray500: '#888888',
  gray300: '#C0C0C0',
  gray200: '#F0F0F0',
  gray100: '#F5F5F5',
  gray50: '#FAFAFA',
  white: '#FFFFFF',

  error: '#E53E3E',
  errorLight: '#FFF5F5',
  errorbackground: '#FFE9E9',
  success: '#38A169',

  border: '#EBEBEB',
  inputBg: '#F7F7F7',
  placeholder: '#BBBBBB',
} as const;

// ─── Typography ───────────────────────────────────────────────
export const Typography = {
  // Font families - Expo 기본 내장 폰트 사용
  fontRegular: undefined,   // system font
  fontMedium: undefined,
  fontBold: undefined,

  // Tailwind 기준
  // 모바일 앱 기본 글씨 = 14~16px, 버튼 = 16~18px 제목 = 20px 이상

  // Size scale
  xs: 11, // 아주 작은 글씨 (에러메시지, 힌트)
  sm: 13, // 작은 글씨 (라벨)
  base: 15, // 기본 글씨 (본문)
  md: 16, // 중간 글씨 (입력칸)
  lg: 18, // 큰 글씨 (버튼)
  xl: 22, // 더 큰 글씨 (소제목)
  '2xl': 26,  // 제목
  '3xl': 32,  // 큰 제목
} as const;

// ─── Spacing ──────────────────────────────────────────────────
// 4의 배수 -> 대부분 디자인 툴(피그마)이 4px 그리드 기준으로 만들어져서 좋다고 함.
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

// ─── Border Radius ────────────────────────────────────────────
// 둥근 모서리
export const Radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  '2xl': 24,
  full: 9999,
} as const;

// ─── Shadow ───────────────────────────────────────────────────
export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#F5A623',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// ─── Calendar Theme ───────────────────────────────────────────
export const CalendarTheme = {
    todayBackgroundColor: Colors.primary,
    todayTextColor: Colors.white,
    selectedDayBackgroundColor: Colors.primaryLight,
    selectedDayTextColor: Colors.primary,
    arrowColor: Colors.primary,
    monthTextColor: Colors.black,
    textDayFontSize: 13,
    textMonthFontSize: 15,
    textDayFontWeight: '500' as const,
    textMonthFontWeight: '700' as const,
    selectedDayBorderColor: Colors.primary,  
    dotColor: Colors.primary,                
    textSectionTitleColor: Colors.gray500,
    textDisabledColor: Colors.gray300, 
} as const;