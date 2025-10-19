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
  GET__ALL_CARS = '/cars/',
  ADD_CAR = '/cars/create/',
  GET_ALL_CARS_BY_OWNER_ID = '/cars/?owner_id',
  GET_CAR_DETAILS = '/cars/:id',
  UPDATE_CAR = '/cars/:id/manage',
  DELETE_CAR = '/cars/',

}