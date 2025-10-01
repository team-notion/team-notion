# NotionRides Backend

## Description
...

## API Endpoints

1...Authentication
  POST /api/register/customer → Register a new customer
  POST /api/register/business → Register a new business owner
  POST /api/login → Login with email/phone + password
  POST /api/logout → Logout

2...Profile Management 
  GET /api/profile → Get user profile
  PUT /api/profile → Update user profile

3...Email Verification
  GET /api/email/verify 
  GET /api/email/verify/{id}/{hash} → Verify a user’s email
  POST /api/email/verification-notification → Resend verification link

