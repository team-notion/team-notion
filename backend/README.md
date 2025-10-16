# NotionRides Backend

## Description
...

## API Endpoints

### 1. Public Endpoints (No Authentication Required)
| **POST** |  `/api/register/customer`            | Register a new customer user. |
| **POST** |  `/api/register/business`            | Register a new business owner. |
| **POST** |  `/api/login`                        | Log in and receive a Sanctum token. |
| **GET** |   `/api/cars`                         | Get a list of all publicly visible cars. |
| **GET** |   `/api/cars/filter`                  | Filter the list of publicly visible cars. |
| **GET** |   `/api/cars/{car}`                   | Show details of a specific car. |
| **POST** |  `/api/customer/reservations/guest`  | Create a **provisional** reservation as a guest. |
| **GET** |   `/api/ping`                         | API health check. |

### 2. Authenticated Endpoints (Requires `auth:sanctum` Token)
#### User & Authentication
| **GET**   | `/api/profile`  | Get the authenticated user's profile. |
| **PUT**   | `/api/profile`  | Update the authenticated user's profile. |
| **POST**  | `/api/logout`   | Log out and revoke the current token. |

#### Email Verification
| **GET**   | `/api/email/verify`                     | Check email verification status. |
| **GET**   | `/api/email/verify/{id}/{hash}`         | Verify a user's email using a signed link. |
| **POST**  | `/api/email/verification-notification`  | Request a new email verification link. |

#### Analytics
| **GET**   | `/api/analytics/overview`   | Get an overview of key analytics data. |

### 3. Business Owner Endpoints (Requires `auth:sanctum` and Email Verified)
#### Car Management
| **GET**     | `/api/owner/my-cars`          | Get a list of the owner's cars. |
| **POST**    | `/api/owner/cars`             | Add a new car listing. |
| **PUT**     | `/api/owner/cars/{car}`       | Update an existing car listing. |
| **DELETE**  | `/api/owner/cars/{car}`       | Delete a car listing. |
| **DELETE**  | `/api/owner/cars/{car}/photo` | Remove a photo from a car listing. |
| **GET**     |   `/api/cars`                         | Get a list of all publicly visible cars. |
| **GET**     |   `/api/cars/filter`                  | Filter the list of publicly visible cars. |
| **GET**     |   `/api/cars/{car}`                   | Show details of a specific car. |


#### Reservation Management (Owner View)
| **GET**   | `/api/owner/reservations`                         | Get a list of all reservations for the owner's cars. |
| **POST**  | `/api/owner/reservations`                         | Create a manual reservation (Owner booking). |
| **PUT**   | `/api/owner/reservations/{reservation}/dates`     | Modify the dates of an existing reservation. |
| **PUT**   | `/api/owner/reservations/{reservation}/reassign`  | Reassign a reservation to a different car. |
| **PUT**   | `/api/owner/reservations/{reservation}/cancel`    | Cancel a specific reservation. |

### 4. Customer Endpoints (Requires `auth:sanctum` and Email Verified)
#### Booking & Reservation Management (Customer View)

| **POST** |   `/api/customer/reservations`                     | Create a **firm** (confirmed) reservation. |
| **PUT** |   `/api/customer/reservations/{reservation}`        | Modify details of an existing reservation. |
| **PUT** |   `/api/customer/reservations/{reservation}/cancel` | Cancel a specific customer reservation. |
| **GET** |   `/api/customer/bookings`                          | Get a list of all the authenticated customer's bookings. |

