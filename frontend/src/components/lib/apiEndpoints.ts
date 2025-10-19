export enum apiEndpoints {
  // Authentication
  LOGIN = '/login/',
  BUSINESS_SIGNUP = '/register/business',
  USER_SIGNUP = '/register/customer',
  VERIFY_EMAIL = '/email/veriffication-notification',

  // REFRESH_TOKEN
  REFRESH_TOKEN = '/refresh-token/',

  // Profile
  // GET_USER_PROFILE = '/profile',
  GET_USER_PROFILE = '/accounts/profile',
  UPDATE_USER_PROFILE = '/accounts/profile',
}