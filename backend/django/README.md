
# Notion Rides API
![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Python](https://img.shields.io/badge/Python-3.13-blue)
![Django](https://img.shields.io/badge/Django-5.0-darkgreen)
![DRF](https://img.shields.io/badge/DRF-REST%20Framework-red)
![Render](https://img.shields.io/badge/Deploy-Render-blueviolet)
![Docs](https://img.shields.io/badge/Docs-Swagger-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)


A production-ready backend API for managing car rentals, authentication, reservations, payments, and notifications.

##  Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Architecture](#architecture)
* [Getting Started](#getting-started)
* [Environment Variables](#environment-variables)
* [API Documentation](#api-documentation)

  * [Auth](#auth)
  * [Cars](#cars)
  * [Reservations](#reservations)
  * [Payments](#payments)
  * [Notifications](#notifications)
* [Database Models](#database-models)
* [Background Tasks](#background-tasks)
* [Contributing](#contributing)

---

##  Overview

**Notion Rides API** is a backend system designed for vehicle rental platforms. It supports account creation, authentication, car listing, availability management, reservation processing, payment handling, and automated email notifications.

It is built with **Django & Django REST Framework**, following clean architecture and scalable modular design.

---

## Features

* **Authentication & Authorization**

  * JWT-based auth
  * Password reset & email verification

* **Car Management**

  * Add, update, delete car listings
  * Upload car images
  * Track availability

* **Reservations**

  * Create & cancel reservations
  * Prevent double booking
  * Email confirmations

* **Payments**

  * Initialize and verify payments
  * Integrates with Paystack

* **Notifications**

  * Automatic emails for signup, reservations, cancellations
  * Automatic in-app notifications for reservations (registered owners and customers only)
  * Asynchronous processing (Threading/Celery)

* **Modular architecture**

  * Utilities separated into a `/utils` module
  * Tasks handled through a `/tasks` module

---

##  Tech Stack

| Layer             | Technology                          |
| ----------------- | ----------------------------------- |
| Language          | Python                              |
| Backend Framework | Django, Django REST Framework       |
| Auth              | JWT (djangorestframework-simplejwt) |
| Database          | PostgreSQL                          |
| Cache / Queue     | Redis                               |
| Background Jobs   | Celery                              |
| Deployment        | Render        |


---

##  Architecture

```
/project
│── /accounts
│── /cars
│── /core  
│── /notifications
│── /notion_rides  #contains project settings
│── /payments
│── manage.py
```


##  Getting Started

### -> Clone the repository

```bash
git https://github.com/team-notion/team-notion.git
cd backend/django
```

### -> Create a virtual environment

```bash
python -m venv venv
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
```

### -> Install dependencies

```bash
pip install -r requirements.txt
```

### -> Apply migrations

```bash
python manage.py migrate
```

### -> Start development server

```bash
python manage.py runserver
```

---

## Environment Variables

Create a `.env` file containing, and use .env.example as a template to fill in necessary credentials.

---

## API Documentation

> Full Swagger docs available at:

```
/api/docs
/api/schema/redoc
```

---

###  Auth

| Method | Endpoint                            | Description       |
| ------ | ----------------------------------- | ----------------- |
| POST   | `/api/accounts/register/customer/`               | Create account as customer   |
| POST   | `/api/accounts/register/owner/`               | Create account as owner   |
| POST   | `/api/login/`                  | Login & get JWT   |
| POST   | `/api/refresh-token/`                  | Refresh Token  |
| POST   | `/api/accounts/verify/{uid}/{token}/`           | Verify user email |
| POST   | `/api/accounts/verify/send/`           | Resend Verification email |
| POST   | `/api/accounts/password-reset/`         | Send reset link   |
| POST   | `/api/accounts/reset/{uid}/{token}/` | Reset password    |

---

###  Cars

| Method | Endpoint          | Description |
| ------ | ----------------- | ----------- |
| GET    | `/api/cars/`      | List cars   |
| GET    | `/api/cars/{id}/` | Fetch car details |
| POST   | `/api/cars/create/`      | Add car     |
| PATCH  | `/api/cars/{id}/manage/` | Update car  |


---

###  Reservations

| Method | Endpoint                         | Description         |
| ------ | -------------------------------- | ------------------- |
| POST   | `/api/cars/reserve/`             | Create reservation  |
| POST   | `/api/cars/reserve/guest/`             | Create reservation (Guest)  |
| GET    | `/api/cars/my-reservations/`             | List current user reservations   |
| POST | `/api/cars/reservations/request-cancel/` | Request reservation cancellation  |
| GET | `/api/cars/reservations/confirm-cancel/?token={token}` | Confirm reservation cancellation  |



---

###  Payments

| Method | Endpoint                  | Description    |
| ------ | ------------------------- | -------------- |
| POST   | `/api/payments/start/` | Start payment  |
| GET   | `/api/payments/{id}/` | Payment details  |
| POST   | `/api/payments/verify/?reference={reference}`   | Verify payment |

---

###  Notifications

Email triggers include:

* Signup verification
* Reservation confirmation
* Cancellation notice
* Password reset instructions

#### IN-APP
| Method | Endpoint                  | Description    |
| ------ | ------------------------- | -------------- |
| POST   | `/api/notifications/` | Fetch current user notifications |
| PATCH   | `/api/notifications/{id}/` | Update notification (read status) |


---

##  Database Models (example)

* **User** (custom USER model)
* **Profile**
* **Car**, **CarPhoto**
* **Reservation**
* **Payment**
* **Notification**

---

##  Background Tasks

Uses **Celery + Redis** for async tasks:

### Tasks Examples:

```py
@shared_task
def send_guest_reservation_email_task(user_id, link):
    ...
    
@shared_task
def send_cancel_confirmation_email_task(user_id, link):
    ...
```

---


##  Deployment

Guide includes:

* Render setup
* Gunicorn config
* Environment variable setup



---

##  Contributing

Pull requests are welcome.
For major changes, open an issue to discuss what you'd like to modify.

---

## Author

- Notion Rides Backend
- Built by: **Jethro Ayegbe**
- Backend Engineer – Django & REST APIs
- GitHub: https://github.com/JhayceeCodes



---


