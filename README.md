# Eat-With-Me

## Development Instructions

### Prerequisites
1. [Node.js v17.7.0+](https://nodejs.org/)
2. [Expo CLI](https://expo.dev/tools#cli) for real-time prototyping: `npm install -g expo-cli`
3. (Optional) [Firebase CLI](https://firebase.google.com/docs/cli) for hosting and deployment: `npm install -g firebase-tools`

### Clone Repository
1. Clone this repository onto your local machine.
2. Navigate to the root directory of the repository.
3. Install the npm dependencies by running `npm install`.

### Setup Firebase Environment
This project uses Firebase for backend management, including authentication, database storage, and hosting. This can all be done for free with any Google account.
1. **Project Setup:** Create a new Firebase project and web app from the [Firebase console](https://console.firebase.google.com/). Detailed instructions available in the [Firebase documentation](https://firebase.google.com/docs/web/setup#create-project) under "Create a Firebase project." Do not follow the rest of the steps for now.
2. **Authentication:**
   1. In the Firebase console, open your project and navigate to **Build > Authentication** on the left sidebar.
   2. Click **Get Started** and select **Email/Password** as your sign-in provider.
   3. Enable the provider and save your changes.
3. **Firestore Database:**
   1. In the Firebase console, open your project and navigate to **Build > Firestore Database** on the left sidebar.
   2. Click **Create database** and start in production mode.
   3. Choose the region appropriate for your development location. Click **Enable**.
   4. Once your Firestore database loads, go to the **Rules** tab. Change line 5 to `allow read, write: if request.auth != null;` and Publish the changes.
4. **Configure Web App**: Create a new web app by following [these instructions](https://firebase.google.com/docs/web/setup#register-app). Hosting is optional (requires Firebase CLI). Once the app is registered, a list of configuration keys will appear. Use these in the next step.
5. **Configure Firebase Environment** Create a `.env` file in the root directory of the repository to store your Firebase project credentials. These credentials were displayed from the previous step. **_This file must be added to `.gitignore` as these keys must remain private._**

```
FIREBASE_API_KEY=<apiKey>
FIREBASE_AUTH_DOMAIN=<authDomain>
FIREBASE_PROJECT_ID=<projectId>
FIREBASE_STORAGE_BUCKET=<storageBucket>
FIREBASE_MESSAGING_SENDER_ID=<messagingSenderId>
FIREBASE_APP_ID=<appId>
```

### Run the app
Navigate to the root directory of the repository and run `npm start`. This will build the app and present a list of options from Expo to run the app in a web browser, iOS simulator (requires a Mac with Xcode), and Android simulator. There is also a QR code for you to run the app on another device using the [Expo Go](https://expo.dev/client) app.

Additional commands to build and run the app:
```
npm run web -> run the app in a web browser
npm run ios -> run the app in an iOS simulator
npm run android -> run the app in an Android simulator
```