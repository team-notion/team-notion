export enum apiEndpoints {
  // Authentication
  LOGIN = '/login/',
  BUSINESS_SIGNUP = '/accounts/register/owner/',
  USER_SIGNUP = '/accounts/register/customer/',
  VERIFY_EMAIL = '/accounts/verify/',
  RESET_PASSWORD = '/accounts/reset/',
  REQUEST_PASSWORD_RESET = '/accounts/password-reset/',

  // REFRESH_TOKEN
  REFRESH_TOKEN = '/refresh-token/',

  // PROFILE
  // GET_USER_PROFILE = '/profile',
  GET_USER_PROFILE = '/accounts/profile',
  UPDATE_USER_PROFILE = '/accounts/profile',

  // CARS
  GET_ALL_CARS = '/cars',
  ADD_CAR = '/cars/create/',
  GET_ALL_CARS_BY_OWNER_ID = '/cars/?owner_id=',
  GET_CAR_DETAILS = '/cars/',
  UPDATE_CAR = '/cars/:id/manage',
  DELETE_CAR = '/cars/',

  // RESERVATIONS
  MAKE_A_RESERVATION = '/cars/reserve/',
  MY_RESERVATIONS = '/cars/my-reservations/',
  UPDATE_RESERVATION = '/cars/reserve/:id',
  CANCEL_RESERVATION = '/cars/reserve/:id/cancel',

  // NOTIFICATIONS
  GET_NOTIFICATIONS = '/notifications',
  UPDATE_NOTIFICATIONS = '/notifications/:id',
}