# Product Requirements Document (PRD) for NotionRides:

**Team Name:** Notion  
**Developed for:** QA Circle Hack  

**Product Name:** NotionRides  (Car Rental Platform)
**Version:** 1  

---

## Product Overview  

NotionRides is a car rental management platform designed for a single business owner with multiple customers. It streamlines car inventory management, reservations, payments, and customer interactions into one system. Customers can browse cars and reserve as guests or account holders; owners can add cars, set prices, manage bookings, and access analytics.  

---

## Problem Statement  

In real-world car rental businesses, especially in emerging markets, a single owner managing multiple vehicles often struggles with fragmented processes. Many small car rental businesses still rely on manual processes (calls, social media, cash payments), leading to double-bookings, poor tracking, and loss of revenue. There’s no unified way to handle guest reservations, payments, or conflicts. NotionRides solves these issues by centralizing inventory, reservations, and payments. NotionRides bridges that gap by offering a full-featured car rental management system specifically designed for a single business owner serving multiple customers.  

---

## Target Users  

- Business Owners  
- Customers who want to make car reservations  

---

## Scope  

### In-Scope (MVP)  

- Car inventory management and search (make/model, type, availability, price).  
- Reservation system for guests and account holders with conflict handling.  
- User accounts and profiles (including driver’s license and payment details).  
- Payment integration (Stripe/PayPal or placeholder API).  
- Booking management (view, modify, cancel).  
- Notifications (email/SMS/push for confirmations and changes).  
- Business owner dashboard (add/edit cars, manage reservations, view analytics).  

### Out-of-Scope (for MVP)  

- Loyalty/reward programs.  
- Referral codes.  
- Driver or car ratings and reviews.  
- Dynamic pricing or surge pricing.  
- In-app chat between renter and owner.  
- Offline-first mode.  

---

## Features & Functionality  

### Business Owner  

#### 1.1. User Accounts (Login/Sign up): User can login as a business owner  

Business Account Creation: User should be able to create an account via:  
- Business name  
- Email/password  
- Phone number  
- Social login (optional if time allows)  

System should validate user input and send verification email/SMS (if implemented).  

Business Account Login:  
- Email  
- Password  
- Social login (optional if time allows)  

#### 1.2. Business Owner Dashboard  

**Car Management/Inventory**  
User should be able to: Add cars, Edit cars, and Delete cars  

Add Cars: User should be able to add a car by providing:  
- Car model  
- Car type  
- Year of manufacture  
- Daily rental price  
- Photos (multiple uploads)  
- Availability dates (calendar picker)  
- Rental rules/terms (text field)  
- Enter deposit amount (fixed or % of price)  
- Enter cut-off reservation duration for guest customers  

User should be able to view all added cars in the car catalogue.  
User should be able to edit any of the above details on an added car at any time.  

#### 1.3 Reservation Management  

User should be able to:  
- View all reservations in one place, a dashboard view (table list and calendar view).  
- Create reservations on behalf of customers by:  
  - Entering customer info (Name, phone number,and email)  
  - Selecting the car, start and end dates  
- Adjust reservation dates  
- Cancel or reassign reservations dates  

**Reports/Analytics**  
User should be able to view at least basic metrics such as:  
- Total Fleets  
- Total bookings in a time range  
- Active bookings/cars  
- Total revenue in a time range  
- Utilization rate (cars booked ÷ cars available)  
- Most rented car(s)  

---

### Customer Account Owner  

#### 2.1. User Accounts (Login/Sign up): User can login as a business owner or customer  

Customers Account Creation / Login: User should be able to create an account via:  
- Email  
- Password  
- Phone number  
- Social login (optional if time allows)  

System should validate user input and send verification email.  

Customer Profile Management: User should be able to:  
- Update profile information (name, phone, email, address)  
- Upload driver’s licence or enter driver’s license ID  
- Add and manage payment methods – Users can add a credit/debit card, PayPal account, or stripe.  

Customers Account Login: User should be able to login to an account via:  
- Email  
- Password  
- Social login (optional if time allows)  

#### 2.2 Reservation Systems  

**Browse Cars:** From the landing page/homepage, customer can browse for all cars. User should be able to browse cars and filter by:  
- Model  
- Car Type  
- Availability Dates  
- Rental Price Range (highest to cheapest)  

**View Car details:** User should be able to click a car to view:  
- Photos  
- Details (car model, car type, and year of manufacture)  
- Rental rules added by the business owner  
- Price/day  
- Availability calendar  

**Make reservation** by selecting the start and end dates.  

**Make payment – Payment Processing Flow:**  
User should be able to:  
- Pay using Stripe/PayPal  
- The rental charges and deposit amount (if enabled by the business owner) is deducted  
- System should store payment history linked to the user. User can see the payment history.  
- System should immediately firm-reserve the car.  
- User should receive notification.  
- User can see the reserved car details on their dashboard.  

#### 2.3. Booking Management  

User should be able to:  
- View all upcoming and past reservations in a “My Bookings” section.  
- Cancel a reservation before a cut-off time defined by the business owner.  
- Modify a reservation before a cut-off time defined by the business owner.  
- Receive notifications (email and push) for confirmations, changes, and cancellations.  

---

### Customer (Guest User) – Soft Reserve  

#### 3.1 Reservation Systems  

Browse Cars: From the landing page/homepage, customer can browse for all cars. User should be able to browse cars and filter by:  
- Model  
- Car Type  
- Availability Dates  
- Rental Price Range (highest to cheapest)  

View Car details: User should be able to select/click a car to view:  
- Photos  
- Details (car model, car type, and year of manufacture)  
- Rental rules added by the business owner  
- Price/day  
- Availability calendar  

Make reservation by providing:  
- Name  
- Phone number  
- Email  
- Intended rental start and end dates  

System should soft-reserve the car for 24 hours (as configured by business owner).  
User should receive a notification (email) confirming the soft reservation.  
The notification mail’s content should read that the reservation is for a specific period of time as determined by the business owner and would be overridden if an account-based customer reserves the same fleet, hence they should complete the reservations by creating an account.  

---

### 4. Customer Account Owner Booking flow 2  

#### 4.1 Reservation Systems  

Browse Cars: From the landing page/homepage, customer can browse for all cars. User should be able to browse cars and filter by:  
- Model  
- Car Type  
- Availability Dates  
- Rental Price Range (highest to cheapest)  

View Car details: User should be able to select/click a car to view:  
- Photos  
- Details (car model, car type, and year of manufacture)  
- Rental rules added by the business owner  
- Price/day  
- Availability calendar  

Confirm login to proceed with reservation by:  
Complete Reservations by:  
- View selected car details, make reservation by selecting the start and end dates  
- Confirming payment  

System should immediately firm-reserve the car.  
User should receive notification.  
User can see the reserved car details on their dashboard.  

#### 4.2. Conflict Handling (Backend/Frontend)  

If an account holder reserves the same car while it’s soft-reserved by a guest:  
- System should automatically give priority to the account holder.  
- Guest should receive a notification of cancellation or override.  

---

## 5. Notifications – Trigger Points  

- When Account is created and confirmed (email notification)  
- When Reservation is confirmed (in-app and email notification)  
- Reservation cancelled/overridden (in-app and email notification)  
- When reservation is updated (in-app)  
- When payment is confirmed (in-app)  

**Channels:**  
- Email (resend email, firebase)  
- In-app notification (push notification, firebase...)  

---

## 9. Security & Permissions  

- Only the business owner should have access to the dashboard features (cars, reservations, analytics).  
- Customers should only see their own reservations.  
- Sensitive info (driver’s license, payment tokens) should be encrypted.  

---

## Technical Requirements Definition  

| Category        | Requirement |
|-----------------|-------------|
| Frontend        | React.js, React Query for query, Tailwind CSS for styling, React icons for icons |
| Backend         | Python/Django - to be concluded |
| Database        | PostgreSQL or MongoDB for cars, reservations, users. to be concluded |
| Authentication  | Firebase Auth for secure login sessions. |
| Payment Gateway | Stripe/PayPal integration. to be concluded |
| Notifications   | Firebase Push Notifications. |
| Hosting         | Vercel / Render for backend & frontend deployment. |
| Security        | HTTPS for all communications; encrypted storage for sensitive data (driver’s license, payment methods). |

---

## Conclusion  

This PRD outlines NotionRides streamlined car rental platform tailored to a single business owner serving multiple customers. The MVP ensures:  
- Customers can easily browse, reserve, and pay for cars as guests or account holders.  
- Business Owner can add cars, manage bookings, and monitor analytics.  
- System can handle conflicts and notify users in real time.  

---

## TEAM MEMBERS  

| S/N | Name                      | Role | 
|-----|---------------------------|------|
| 1   | Odegha Clementina         | PM   | 
| 2   | Ogbuefi Ikemsinachi       | PD   | 
| 3   | Shalom Nwachukwu-kanu     | PD   |
| 4   | Grace Nzubechukwu Okorie  | PD   |
| 5   | Obaloluwa Tubi            | FE   |
| 6   | Huncho Sherif             | FE   |
| 7   | George Udonte             | FE   |
| 8   | Niwagaba Clever           | BE   |
| 9   | Jethro Ayegbe             | BE   |

---

## RESOURCES  

- **Organization Repo:** https://github.com/team-notion  
- **Figma:** (link to be added later)  
- **Pitch Deck:** (link to be added later)
- **Demo:** (link to be added later)

