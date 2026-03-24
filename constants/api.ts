const BASE_URL = "https://api.woorikkiri.com";

export const API = {
  // ───── 인증 ─────
  signup: `${BASE_URL}/api/auth/signup`,          // POST-
  checkEmail: `${BASE_URL}/api/auth/check-email`, // GET-
  login: `${BASE_URL}/api/auth/login`,            // POST-
  logout: `${BASE_URL}/api/auth/logout`,          // POST-

  // ───── 유저 ─────
  updatePassword: `${BASE_URL}/api/users/password`, // PATCH
  mypage: `${BASE_URL}/api/users/mypage`,         // GET-
  getMe: `${BASE_URL}/api/users/me`,              // GET-
  updateMe: `${BASE_URL}/api/users/me`,           // PATCH


  // ───── 모임 ─────
  createMeeting: `${BASE_URL}/api/meetings`,          // POST
  getMyMeetings: `${BASE_URL}/api/meetings/my`,       // GET
  joinMeeting: `${BASE_URL}/api/meetings/join`,       // POST
  deleteMeeting: (meetingId: number) => `${BASE_URL}/api/meetings/${meetingId}`,  // DELETE
  leaveMeeting: (meetingId: number) => `${BASE_URL}/api/meetings/${meetingId}/leave`, // DELETE
  updateMeeting: (meetingId: number) => `${BASE_URL}/api/meetings/${meetingId}`,  // PATCH
  //모임검색도 추가해야함. 엔드포인트? 주소가 없음.
  getMeeting: (meetingId: number) => `${BASE_URL}/api/meetings/${meetingId}`,     // GET
  getMembers: (meetingId: number) => `${BASE_URL}/api/meetings/${meetingId}/members`, // GET

  // ───── 일정 조율 ─────
  createSchedulePoll: (meetingId: number) => `${BASE_URL}/api/meetings/${meetingId}/schedule-polls`,  // POST
  getSchedulePolls: (meetingId: number) => `${BASE_URL}/api/meetings/${meetingId}/schedule-polls`,    // GET
  getSchedulePoll: (pollId: number) => `${BASE_URL}/api/schedule-polls/${pollId}`,     // GET
  updateSchedulePoll: (pollId: number) => `${BASE_URL}/api/schedule-polls/${pollId}`,  // PATCH
  deleteSchedulePoll: (pollId: number) => `${BASE_URL}/api/schedule-polls/${pollId}`,  // PATCH
  submitAvailability: (pollId: number) => `${BASE_URL}/api/schedule-polls/${pollId}/availabilities`, // POST
  closeSchedulePoll: (pollId: number) => `${BASE_URL}/api/schedule-polls/${pollId}/close`,           // PATCH
  getDateMembers: (pollId: number, date: string) => `${BASE_URL}/api/schedule-polls/${pollId}/dates/${date}/members`, // GET
  getRequiredMembers: (pollId: number, userId: number) => `${BASE_URL}/api/schedule-polls/${pollId}/members/${userId}`, // GET

  // ───── 확정 일정 ─────
  createFinalSchedule: (pollId: number) => `${BASE_URL}/api/schedule-polls/${pollId}/final-schedules`,      // POST
  getFinalSchedules: (meetingId: number) => `${BASE_URL}/api/meetings/${meetingId}/final-schedules`,        // GET
  getFinalSchedule: (scheduleId: number) => `${BASE_URL}/api/final-schedules/${scheduleId}`,                // GET
  updateFinalSchedule: (scheduleId: number) => `${BASE_URL}/api/final-schedules/${scheduleId}`,             // PATCH
  deleteFinalSchedule: (scheduleId: number) => `${BASE_URL}/api/final-schedules/${scheduleId}`,             // DELETE

  // ───── 알림 ─────
  updateNotificationSettings: `${BASE_URL}/api/users/me/notification-settings`, // PATCH
  getNotifications: `${BASE_URL}/api/notifications`,                             // GET

  // ───── 투표 ─────
  createVote: (meetingId: number) => `${BASE_URL}/api/meetings/${meetingId}/votes`,  // POST
  getVotes: (meetingId: number) => `${BASE_URL}/api/meetings/${meetingId}/votes`,    // GET
  getVote: (voteId: number) => `${BASE_URL}/api/votes/${voteId}`,                   // GET
  updateVote: (voteId: number) => `${BASE_URL}/api/votes/${voteId}`,                // PATCH
  deleteVote: (voteId: number) => `${BASE_URL}/api/votes/${voteId}`,                // DELETE

  // ───── 개인 일정 ─────
  getMySchedules: `${BASE_URL}/api/calendar/my-schedules`, // GET

  // ───── 게시글 ─────
  createPost: (meetingId: number) => `${BASE_URL}/api/meetings/${meetingId}/posts`,  // POST
  getPosts: (meetingId: number) => `${BASE_URL}/api/meetings/${meetingId}/posts`,    // GET
  getPost: (postId: number) => `${BASE_URL}/api/posts/${postId}`,                   // GET
  updatePost: (postId: number) => `${BASE_URL}/api/posts/${postId}`,                // PATCH
  deletePost: (postId: number) => `${BASE_URL}/api/posts/${postId}`,                // DELETE
  setNotice: (postId: number) => `${BASE_URL}/api/posts/${postId}/notice`,          // PATCH

  // ───── 댓글 ─────
  createComment: (postId: number) => `${BASE_URL}/api/posts/${postId}/comments`,      // POST
  getComments: (postId: number) => `${BASE_URL}/api/posts/${postId}/comments`,        // GET
  updateComment: (commentId: number) => `${BASE_URL}/api/comments/${commentId}`,      // PATCH
  deleteComment: (commentId: number) => `${BASE_URL}/api/comments/${commentId}`,      // DELETE
};