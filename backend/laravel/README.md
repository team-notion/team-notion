# NotionRides Backend

## Description
...

## API Endpoints

### Authentication
  - POST /api/register/customer → Register a new customer
  - POST /api/register/business → Register a new business owner
  - POST /api/login → Login with email/phone + password
  - POST /api/logout → Logout

### Profile Management 
  - GET /api/profile → Get user profile
  - PUT /api/profile → Update user profile

  
### Car Management
  - GET	    /api/cars	
  - GET	    /api/cars/{car}	->  Show details of a car
  - GET	    /api/my-cars	-> Lists cars
  - POST	  /api/cars	  ->  Add a new car
  - PUT	    /api/cars/{car}	->  Update an existing car
  - DELETE	/api/cars/{car}	->  Delete a car
  - DELETE	/api/cars/{car}/photo
  
### Email Verification
  - GET /api/email/verify 
  - GET /api/email/verify/{id}/{hash} → Verify a user’s email
  - POST /api/email/verification-notification → Resend verification link

