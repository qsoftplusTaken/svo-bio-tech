# SPR Biotech Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- Firebase Account
- Razorpay Account

## 1. Project Scaffolding
Initialize the Next.js 14 project with Tailwind CSS, TypeScript, and App Router:

```bash
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*"
```

## 2. Install Dependencies
Install all required packages for styling, state management, UI, and integrations:

```bash
# Core UI and State
npm install framer-motion zustand sonner tailwind-merge clsx lucide-react

# Firebase
npm install firebase firebase-admin

# Razorpay
npm install razorpay
```

## 3. Environment Setup
Create a `.env.local` file at the root of the project and add the following keys. **Do not commit this file to version control.**

```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Server-side)
FIREBASE_CLIENT_EMAIL=your_firebase_admin_client_email
FIREBASE_PRIVATE_KEY="your_firebase_admin_private_key"

# Razorpay Keys
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## 4. Firebase Setup
1. Go to the Firebase Console and create a new project.
2. Enable **Authentication** (Email/Password, Google).
3. Enable **Firestore Database** (Start in production mode, apply the `firestore.rules` file).
4. Enable **Firebase Storage** (Apply the `storage.rules` file).
5. Generate a new Private Key from Project Settings > Service Accounts for your Admin SDK.

## 5. Development Server
Run the local development server:

```bash
npm run dev
```
Open `http://localhost:3000` to view the app.

## 6. Testing Security Rules
We have set up a test environment for Firestore and Storage security rules using Mocha and the Firebase Local Emulator Suite.

To install test dependencies:
```bash
npm install
```

To run the security rule tests:
```bash
npm test
```
This will start the Firebase emulators for Firestore and Storage, run the tests in the `tests/` directory, and verify that all rules (allow/deny access correctly) are functioning properly.
