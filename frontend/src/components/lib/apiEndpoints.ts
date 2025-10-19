export enum apiEndpoints {
  // Authentication
  LOGIN = '/login/',
  BUSINESS_SIGNUP = '/accounts/register/owner/',
  USER_SIGNUP = '/accounts/register/customer/',
  VERIFY_EMAIL = '/email/veriffication-notification',
  RESET_PASSWORD = '/accounts/reset/',
  REQUEST_PASSWORD_RESET = '/accounts/password-reset/',

  // REFRESH_TOKEN
  REFRESH_TOKEN = '/refresh-token/',

  // PROFILE
  // GET_USER_PROFILE = '/profile',
  GET_USER_PROFILE = '/accounts/profile',
  UPDATE_USER_PROFILE = '/accounts/profile',

  // CARS
  GET_CARS = '/cars/',
  ADD_CAR = '/cars/',
  UPDATE_CAR = '/cars/', // + car ID
  DELETE_CAR = '/cars/', // + car ID
}