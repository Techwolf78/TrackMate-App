# Sales User Dropdown Component

This is a **React** component for displaying a user dropdown that shows the user's profile image and a welcome message. The component integrates Firebase authentication for logging out users and uses **Tailwind CSS** for styling. It is also responsive, displaying the welcome message only on larger screens.

## Features

- **User Profile Dropdown**: 
  - Displays the user's profile image in a circular format.
  
- **Responsive Design**: 
  - The welcome message is hidden on small screens and shown only on medium and larger screens (`sm` and up).

- **Logout Functionality**: 
  - Allows users to log out using Firebase authentication.

- **Click Outside to Close**: 
  - The dropdown menu automatically closes if you click outside of it.

## Installation

Follow these steps to get the project up and running on your local machine.

### 1. Clone the repository

```
git clone https://github.com/Techwolf78/TrackMate-App.git
cd TRACKER-APP
```
### 2. Install dependencies
Make sure you have Node.js installed, then run:

```
npm install
```
This will install all the required dependencies, including React, Firebase, and Tailwind CSS.

### 3. Set up Firebase
To use Firebase authentication, create a Firebase project and set up authentication by following the instructions in the Firebase Docs.

Add your Firebase configuration to firebaseConfig.js and replace the placeholder values with your actual Firebase project configuration.
```
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
```
### 4. Tailwind CSS Configuration
If you haven't already configured Tailwind CSS in your React project, you can follow the official Tailwind setup guide: Tailwind CSS Installation.

Make sure to add the necessary files and configurations for Tailwind to work correctly in your project.

### 5. Run the application
```
npm start
```
This will start the development server, and you can view the component in action in your browser at http://localhost:3000.


### Contributing
Fork the repository.

Create a new branch (git checkout -b feature/your-feature).

Commit your changes (git commit -am 'Add new feature').

Push to the branch (git push origin feature/your-feature).

Open a pull request.

### License
This project is licensed under the MIT License - see the LICENSE file for details.

### Acknowledgments
React for building the UI.
Tailwind CSS for utility-first CSS styling.
Firebase for authentication handling.
