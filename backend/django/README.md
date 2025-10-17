# NOTION RIDES BACKEND

## AVAILABLE ENDPOINTS

* baseURL = https://notionridesbackend.onrender.com/api

### AUTH
- {{baseURL}}/accounts/register/customer/   REGISTER CUSTOMER [POST]
- {{baseURL}}/accounts/register/owner/      REGISTER ONWER [POST]
- {{baseURL}}/login/    LOGIN [POST]
- {{baseURL}}/refresh-token/    REFRESH-TOKEN [POST]
- {{baseURL}}accounts/verify/{uid}/{token}/      VERIFYEMAIL [GET]
- {{baseURL}}/accounts/verify/send/     RESEND VERIFICATION MAIL [POST]
- {{baseURL}}/accounts/password-reset/      REQUEST PASSWORD-RESET [POST]
- {{baseURL}}/accounts/reset/{uid}/{token}/       RESET PASSWORD [POST]

### CARS
#### OWNERS ONLY
- {{baseURL}}/cars/create/      UPLOAD CARS [POST]
- {{baseURL}}/cars/{id}/manage     UPDATE CARS [PUT]
#### ANYONE
- {{baseURL}}/cars/             FETCH CARS [GET]
- {{baseURL}}/cars/{id}         FETCH CAR DETAILS [GET]

### PROFILE
- {{baseURL}}/accounts/profile/         FETCH PROFILE [GET]
- {{baseURL}}/accounts/profile/         UPDATE PROFILE [PATCH]
