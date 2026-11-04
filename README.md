# RideEase: Two-Wheeler Rental and Fleet Management Platform

RideEase is an enterprise-grade web application engineered for two-wheeler rentals, fleet management, and automated booking operations. Built on a decoupled client-server architecture using React, Node.js, Express, and MongoDB, the platform delivers end-to-end rental management, including real-time vehicle availability tracking, automated Driving License KYC verification, secure digital payments, and administrative business intelligence.

---

## Table of Contents

- [Architectural Overview](#architectural-overview)
- [Core Capabilities](#core-capabilities)
  - [Automated Driving License Verification (KYC)](#automated-driving-license-verification-kyc)
  - [Date-Slot Reservation and Concurrency Control](#date-slot-reservation-and-concurrency-control)
  - [Payment Processing and Settlement](#payment-processing-and-settlement)
  - [Administrative Dashboard and Fleet Operations](#administrative-dashboard-and-fleet-operations)
  - [Customer Inquiries and Structured Response Workflow](#customer-inquiries-and-structured-response-workflow)
- [Technology Stack](#technology-stack)
- [Directory Layout](#directory-layout)
- [API Specification](#api-specification)
- [Environment Configuration](#environment-configuration)
- [Installation and Setup](#installation-and-setup)
- [Quality Assurance and Testing](#quality-assurance-and-testing)
- [Security and Compliance](#security-and-compliance)
- [License and Attribution](#license-and-attribution)

---

## Architectural Overview

RideEase implements a layered RESTful software architecture:

1. **Client Tier**: A responsive Single Page Application (SPA) built with React 18, Ant Design, Tailwind CSS, and Redux Toolkit for centralized state management.
2. **Application Tier**: A modular Node.js/Express service providing routing, business logic, asynchronous file processing, and KYC document verification.
3. **Data Tier**: A MongoDB database managed via Mongoose schemas, handling documents, relationships, reservation indexing, and audit fields.
4. **Integration Tier**: External service adapters for payment processing (Razorpay), email notifications (Nodemailer via SMTP), and multimodal document inspection (Google Gemini Vision API and Tesseract.js).

---

## Core Capabilities

### Automated Driving License Verification (KYC)

The booking checkout enforces a two-tier verification pipeline to guarantee that user-uploaded documents are authentic, government-issued Driving Licenses before any transaction is authorized:

- **Format and Header Validation**: Validates file buffer magic bytes. Direct digital PDFs issued by Parivahan or DigiLocker are verified and passed natively.
- **Multimodal AI Analysis (Tier 1)**: When configured, the platform leverages Google Gemini 1.5 Flash Vision to inspect card geometry, typography, and authority seals, distinguishing licenses from selfies, pets, landscape photos, or unrelated identity documents.
- **In-House OCR Scanner (Tier 2)**: An embedded Tesseract.js OCR engine analyzes extracted image tokens against official Indian Transport Department markers (`DRIVING LICENCE`, `UNION OF INDIA`, `TRANSPORT DEPARTMENT`, `FORM 7`, `DL NO`, `LMV`, `MCWG`, and statutory regex patterns).
- **Backend Gatekeeping**: The server rejects unauthorized document updates with `HTTP 422 Unprocessable Entity`, preventing non-license records from entering persistent storage.

### Date-Slot Reservation and Concurrency Control

- **Overlap Collision Prevention**: Mathematical validation `(existingStart <= requestedEnd) && (existingEnd >= requestedStart)` prevents double bookings across the same vehicle asset.
- **Dynamic Calendar Locking**: Date pickers on vehicle detail views query active reservation intervals and disable reserved ranges in real time.
- **Atomic Booking Authorization**: Server-side concurrency checks execute prior to payment capture to eliminate race conditions between simultaneous users.

### Payment Processing and Settlement

- **Razorpay Checkout Integration**: Full integration with Razorpay Orders API for handling UPI, Net Banking, and credit/debit cards.
- **HMAC SHA256 Signature Verification**: Server validates payment integrity via cryptographic signature checking before confirming bookings and generating receipts.

### Administrative Dashboard and Fleet Operations

- **Vehicle Fleet Management**: Full CRUD operations for bikes and scooters with multi-field filtering, category assignment, and mileage/pricing controls.
- **Category Classification**: Dynamic category cataloging (Economy, Commuter, Cruiser, Sports) with automated URL slug generation.
- **Customer Lifecycle Analytics**: Sortable user directory displaying total completed rentals, registration timestamps, and contact data.
- **Financial and Inventory Reporting**: Dashboard metrics tracking revenue volume, active rentals, and pending maintenance.

### Customer Inquiries and Structured Response Workflow

- **Inquiry Ticketing**: Public inquiry submission integrated with administrative review workflows.
- **Single-Response Enforcement**: Prevents cyclical multi-chat overhead by enforcing a strict single administrative response policy. Once addressed, administrative responses lock into a read-only state with server-side validation.

---

## Technology Stack

| Layer | Component | Version / Description |
| :--- | :--- | :--- |
| **Frontend Runtime** | React.js | 18.2.0 |
| **State Management** | Redux Toolkit, React-Redux | 1.9.5 |
| **UI Frameworks** | Ant Design, Tailwind CSS | 5.24.6 / 3.x |
| **Iconography** | FontAwesome 6, Heroicons | SVG Core 6.7.2 |
| **HTTP Client** | Axios | 1.4.0 (with Bearer interceptors) |
| **Backend Runtime** | Node.js | v18+ / v20+ / v22+ |
| **Server Framework** | Express.js | 4.21.2 |
| **Database** | MongoDB | Mongoose 7.8.6 |
| **Computer Vision / OCR** | Tesseract.js, Gemini Vision | 7.0.0 / @google/generative-ai 0.24.1 |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt | JWT 9.0.0 / Bcrypt 5.1.0 |
| **Payments** | Razorpay SDK | 2.9.6 |
| **Mail Services** | Nodemailer | 6.10.0 (SMTP / TLS) |

---

## Directory Layout

```text
bike-4-rent/
|-- backend/
|   |-- config/              # Database connection and client bindings
|   |-- controllers/         # Business logic (Auth, Bike, Category, Order, Review)
|   |-- helpers/             # Security hashing, license verification engine
|   |-- middlewares/         # JWT verification, Role-Based Access Control (RBAC)
|   |-- models/              # Mongoose data schemas (User, Bike, Category, Order, Inquiry)
|   |-- routes/              # Express API endpoint definitions
|   |-- server.js            # Express application bootstrap and global error traps
|   |-- package.json         # Backend dependency definitions
|   `-- .gitignore           # Backend environment and binary exclusions
|-- frontend/
|   |-- public/              # Static brand assets, favicons, manifests
|   |-- src/
|   |   |-- components/      # User-facing views (Home, Order, Terms, Checkout, Profile)
|   |   |-- dashboard/       # Administrative management consoles (Fleet, Categories, Users)
|   |   |-- Helper/          # Axios HTTP instances, route guards, UI spinners
|   |   |-- redux/           # Redux Toolkit slices and asynchronous actions
|   |   |-- App.js           # Route switchboard and authentication listeners
|   |   `-- index.js         # Frontend application mounting point
|   |-- package.json         # Frontend dependencies and build scripts
|   `-- tailwind.config.js   # Tailwind layout and color palette configurations
|-- .gitignore               # Root version control filter
`-- README.md                # System documentation
```

---

## API Specification

### Authentication and User Services

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Registers a new customer account |
| `POST` | `/api/v1/auth/login` | Public | Authenticates credentials and returns JWT bearer token |
| `GET` | `/api/v1/auth/me` | Authenticated | Retrieves profile of currently authenticated user |
| `POST` | `/api/v1/auth/verify-license-doc` | Authenticated | Pre-checks driving license document authenticity |
| `POST` | `/api/v1/auth/update-license` | Authenticated | Validates and updates user driving license records |
| `GET` | `/api/v1/auth/getallusers` | Admin | Lists all registered users sorted by creation date |

### Vehicle Inventory and Categories

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/bike/get-bike` | Public | Returns complete vehicle fleet catalog |
| `GET` | `/api/v1/bike/get-bike/:slug` | Public | Retrieves specific vehicle details by URL slug |
| `POST` | `/api/v1/bike/create-bike` | Admin | Creates a new vehicle record with specifications |
| `PUT` | `/api/v1/bike/update-bike/:id` | Admin | Updates vehicle metadata, status, or pricing |
| `DELETE` | `/api/v1/bike/delete-bike/:id` | Admin | Removes vehicle from inventory |
| `GET` | `/api/v1/category/get-category` | Public | Lists all active rental vehicle categories |

### Orders, Bookings, and Reservations

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/order/bike-booked-slots/:bikeId` | Public | Returns booked date intervals for a vehicle |
| `POST` | `/api/v1/order/make-order` | Authenticated | Creates a reservation record post-payment verification |
| `GET` | `/api/v1/order/user-orders/:userId` | Authenticated | Retrieves rental history for a specific customer |
| `GET` | `/api/v1/order/all-orders` | Admin | Displays comprehensive company rental orders |

### Payments

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/getKey` | Authenticated | Returns Razorpay public Key ID |
| `POST` | `/api/v1/checkout` | Authenticated | Initializes a Razorpay order entity with amount |
| `POST` | `/api/v1/paymentverification` | Authenticated | Verifies cryptographic signature of completed payment |

---

## Environment Configuration

Create a `.env` configuration file in the `backend/` directory:

```env
# Application Port and Mode
PORT=5001
DEV_MODE=development

# Database Configuration
MONGO_URL=mongodb://127.0.0.1:27017/rideease

# JSON Web Token Secret
JWT_SECRET=your_secure_random_jwt_secret_key_here

# Payment Gateway (Razorpay Test or Live Keys)
RAZORPAY_API_KEY=rzp_test_your_key_id
RAZORPAY_API_SECRET=your_key_secret

# Mail Notifications (SMTP)
MAIL_USER=your_smtp_email@example.com
MAIL_PASS=your_smtp_app_password

# Multimodal KYC Inspection (Optional, enables Gemini Vision Tier 1)
GEMINI_API_KEY=your_gemini_api_key_here
```

Create a `.env` configuration file in the `frontend/` directory (optional for local development, defaults to `http://localhost:5001`):

```env
REACT_APP_API_URL=http://localhost:5001
```

---

## Installation and Setup

### Prerequisites

- Node.js (v18.0.0 or higher recommended)
- MongoDB Server (local installation or MongoDB Atlas instance)
- npm (v9.0.0 or higher) or Yarn

### Step 1: Clone Repository

```bash
git clone https://github.com/diajain315/RideEase_Backup.git
cd RideEase_Backup
```

### Step 2: Backend Installation and Startup

```bash
cd backend
npm install
```

Configure your `backend/.env` file with MongoDB connection string and credentials. Then start the server:

```bash
# Production mode
npm start

# Development mode (requires nodemon)
npm run dev
```

The backend server runs on `http://localhost:5001`.

### Step 3: Frontend Installation and Startup

Open a separate terminal shell:

```bash
cd frontend
npm install
npm start
```

The client application compiles and serves on `http://localhost:3000`.

---

## Quality Assurance and Testing

The repository incorporates automated verification scripts for mission-critical paths. To run the automated Driving License verification test suite:

```bash
cd backend
node test_dl_verify.mjs
```

### Verification Criteria

- Non-license images (e.g., vehicles, landscapes, personal portraits) are rejected with clear diagnostic reasons.
- Digital PDF licenses (Parivahan / DigiLocker) are validated and accepted.
- Profile update requests containing invalid documents are blocked with `HTTP 422 Unprocessable Entity`.

---

## Security and Compliance

- **Password Cryptography**: Passwords undergo one-way cryptographic hashing using Bcrypt prior to persistence.
- **Session Protection**: JSON Web Tokens are tied to server instance identifiers, invalidating stale client tokens upon backend restart.
- **Credential Segregation**: Environment configuration files (`.env`), credentials, and OCR model artifacts (`*.traineddata`) are excluded from version control via `.gitignore`.
- **Input Sanitization**: Request bodies are validated for structure, type, and size limits to guard against buffer overruns and script injection.

---

## License and Attribution

This project is maintained by Dia Jain. Distributed under the ISC License.

Repository: [https://github.com/diajain315/RideEase_Backup.git](https://github.com/diajain315/RideEase_Backup.git)
