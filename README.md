# ChatBT Backend

This is the backend server for the ChatBT application, a real-time chat platform. It is built with Node.js, Express, MongoDB, and Socket.io.

## Features

- **Real-time Messaging**: Uses Socket.io for instant messaging.
- **User Authentication**: Secure authentication using JWT and cookies.
- **Database**: MongoDB for storing users, conversations, and messages.
- **CORS Support**: Configured to work with the frontend hosted at `https://btchatting.onrender.com`.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Real-time Communication**: Socket.io
- **Authentication**: JSON Web Tokens (JWT), bcryptjs
- **Other Utilities**: dotenv, cors, cookie-parser, multer (file uploads)

## Prerequisites

- Node.js installed
- MongoDB instance (local or Atlas)

## Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/ahmedanany9812/ChatBT.git
    cd ChatBT
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Environment Configuration:
    Create a `config.env` file in the root directory (or ensure `.env` is loaded) with the following variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    # Add other necessary keys (JWT_SECRET, etc.)
    ```

## Running the Server

- **Development Mode** (with nodemon):

  ```bash
  npm run dev
  ```

  _Note: You might need to add a "dev" script to package.json if it's missing, or just run `npx nodemon index`._

- **Production Mode**:
  ```bash
  npm start
  ```

## API Endpoints

- `/users`: User management and authentication.
- `/conversations`: Manage chat conversations.
- `/messages`: Send and retrieve messages.

## Socket.io Events

- `addUser`: Register a user to the socket server.
- `send-message`: Send a message to a specific user.
- `typing` / `stopTyping`: Typing indicators.
- `logout`: Handle user logout.
