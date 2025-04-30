# Task Tracker Application

A task tracker application that allows users to manage and track the progress of their projects and tasks. The application supports multiple users, and each user can have up to 4 projects with various tasks.

## Features

- **User Authentication**: Users can sign up, log in.
- **Project Management**: Users can create projects, and each project can have multiple tasks.
- **Task Management**: Users can create, read, update, and delete tasks associated with projects.
- **Task Status**: Tasks can have different statuses: "Pending", "In Progress", and "Completed".
- **JWT Authentication**: Secure login using JSON Web Tokens (JWT).
- **Responsive Design**: The frontend is designed to be responsive for different screen sizes.
- **Security Features**: Token storage options (localStorage or cookies) with a shorter token expiration time and "Remember Me" functionality.

## Tech Stack

- **Frontend**: ReactJS, TailwindCSS
- **Backend**: ExpressJS, NodeJS
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **State Management**: React state management (using `useState`, `useEffect`)