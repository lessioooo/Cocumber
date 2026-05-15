
# Cocumber 🥒
Cocumber is a mobile application made with Expo focused on calorie and weight loss tracking.

## Features

- Integrated secure user authentication using Clerk.
- Implemented a serverless Convex database to ensure real-time data persistence and seamless state management.


## Roadmap

- Implementing Core Mechanics, such as actual daily calorie intake calculation and macro tracking.

- Refining UI/UX to deliver a more engaging and intuitive user experience..


## Authors

- [@lessioooo](https://github.com/lessioooo)
- [@abnezz](https://github.com/abnezz)

## Getting Started

To run this project locally, you will need to set up the environment variables for authentication and the database.

### Prerequisites
* [Node.js](https://nodejs.org/) installed
* Expo CLI
* Expo Go installed on your mobile device (optional)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/lessioooo/Cocumber.git
2. Install dependencies:
    ```
    npm install
3. Create a .env file in the root directory and add your development keys:
    ```
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    EXPO_PUBLIC_CONVEX_URL=your_convex_deployment_url
4. Start the application:
    ```Bash
    npx expo start