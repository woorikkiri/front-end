const BASE_URL = "http://3.38.27.229:8080";

export const API = {
  // ───── 인증 ─────
  signup: `${BASE_URL}/api/auth/signup`,          // POST
  checkEmail: (email: string) => `${BASE_URL}/api/auth/check-email?email=${email}`, // GET
  login: `${BASE_URL}/api/auth/login`,            // POST
  logout: `${BASE_URL}/api/auth/logout`,          // POST
  sendResetEmail: `${BASE_URL}/api/auth/password-reset/email`, // POST
  verifyResetCode: `${BASE_URL}/api/auth/password-reset/verify`, // POST
  confirmResetPassword: `${BASE_URL}/api/auth/password-reset/confirm`, // POST

  // ───── 유저 ─────
  updatePassword: `${BASE_URL}/api/users/password`, // PATCH
  mypage: `${BASE_URL}/api/users/mypage`,         // GET
  getMe: `${BASE_URL}/api/users/me`,              // GET
  updateMe: `${BASE_URL}/api/users/me`,           // PATCH

  // ───── 모임 ─────
  createMeeting: `${BASE_URL}/api/meetings`,          // POST
  getMyMeetings: `${BASE_URL}/api/meetings/my`,       // GET
  joinMeeting: `${BASE_URL}/api/meetings/join`,       // POST
  deleteMeeting: (meetingId: number) => `${BASE_URL}/api/meetings/${meetingId}`,  // DELETE
  getMeetingInviteCode: (meetingId: number) => `${BASE_URL}/api/meetings/${meetingId}/invite-code`,  // GET
  leaveMeeting: (meetingId: number) => `${BASE_URL}/api/meetings/${meetingId}/members/me`, // DELETE
  updateMeeting: (meetingId: number) => `${BASE_URL}/api/meetings/${meetingId}`,  // PATCH
  // 모임검색 프론트에서
  getMeeting: (meetingId: number) => `${BASE_URL}/api/meetings/${meetingId}/home`,     // GET
  getMembers: (meetingId: number) => `${BASE_URL}/api/meetings/${meetingId}/members`, // GET
  transferOwnership: (meetingId: number) => `${BASE_URL}/api/meetings/${meetingId}/transfer-ownership`,  // POST
  kickMember: (meetingId: number, memberId: number) => `${BASE_URL}/api/meetings/${meetingId}/members/${memberId}`,  // DELETE

  // ───── 일정 조율 ─────
  createSchedulePoll: (meetingId: number) => `${BASE_URL}/api/meetings/${meetingId}/schedule-polls`,  // POST
  getSchedulePolls: (meetingId: number) => `${BASE_URL}/api/meetings/${meetingId}/schedule-polls`,    // GET
  getSchedulePoll: (meetingId: number, schedulePollId: number) => `${BASE_URL}/api/meetings/${meetingId}/schedule-polls/${schedulePollId}`,     // GET
  updateSchedulePoll: (meetingId: number, schedulePollId: number) => `${BASE_URL}/api/meetings/${meetingId}/schedule-polls/${schedulePollId}`,  // PATCH
  deleteSchedulePoll: (meetingId: number, schedulePollId: number) => `${BASE_URL}/api/meetings/${meetingId}/schedule-polls/${schedulePollId}`,  // DELETE
  submitAvailability: (meetingId: number, schedulePollId: number) => `${BASE_URL}/api/meetings/${meetingId}/schedule-polls/${schedulePollId}/availabilities/me`, // PUT
  closeSchedulePoll: (meetingId: number, schedulePollId: number) => `${BASE_URL}/api/meetings/${meetingId}/schedule-polls/${schedulePollId}/close`,           // PATCH
  getDateMembers: (meetingId: number, schedulePollId: number, date: string) => `${BASE_URL}/api/meetings/${meetingId}/schedule-polls/${schedulePollId}/available-dates/${date}/members`, // GET
  getRequiredMembers: (meetingId: number, schedulePollId: number, userId: number) => `${BASE_URL}/api/meetings/${meetingId}/schedule-polls/${schedulePollId}/members/${userId}/availabilities`, // GET

  // ───── 확정 일정 ─────
  createFinalSchedule: (meetingId: number) => `${BASE_URL}/api/meetings/${meetingId}/final-schedules`,  // POST
  getFinalSchedules: (meetingId: number) => `${BASE_URL}/api/meetings/${meetingId}/final-schedules`,  // GET
  getFinalSchedule: (meetingId: number, scheduleId: number) => `${BASE_URL}/api/meetings/${meetingId}/final-schedules/${scheduleId}`,  // GET
  updateFinalSchedule: (meetingId: number, scheduleId: number) => `${BASE_URL}/api/meetings/${meetingId}/final-schedules/${scheduleId}`,  // PATCH
  deleteFinalSchedule: (meetingId: number, scheduleId: number) => `${BASE_URL}/api/meetings/${meetingId}/final-schedules/${scheduleId}`,  // DELETE

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