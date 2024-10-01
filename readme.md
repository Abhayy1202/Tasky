# Tasky

Tasky is a task management application designed to help users and administrators manage tasks efficiently. It provides features for creating, updating, deleting, and viewing tasks, with role-based access control for users and administrators.

## Features

- User and Admin registration and login
- Create, update, and delete tasks
- Assign tasks to users
- Filter tasks by priority, due date, and status
- Role-based access control

## Technologies Used

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React, Redux, Tailwind CSS
- **Authentication**: JWT (JSON Web Tokens)
- **Middleware**: Custom middleware for authentication and error handling

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Abhayy1202/tasky.git
   cd tasky
   ```

2. **Backend Setup:**
   - Navigate to the backend directory:
     ```sh
     cd Backend
     ```
   - Install dependencies:
     ```sh
     npm install
     ```
   - Create a `.env` file in the `Backend` directory and add the following environment variables:
     ```env
     ACCESS_TOKEN_SECRET=youraccesstokensecret
     REFRESH_TOKEN_SECRET=yourrefreshtokensecret
     ACCESS_TOKEN_EXPIRY=1h
     REFRESH_TOKEN_EXPIRY=7d
     MONGO_URI=yourmongodburi
     ```
   - Start the backend server:
     ```sh
     npm run dev
     ```

3. **Frontend Setup:**
   - Navigate to the frontend directory:
     ```sh
     cd ../frontEnd
     ```
   - Install dependencies:
     ```sh
     npm install
     ```
   - Start the frontend development server:
     ```sh
     npm run dev
     ```

## Usage

1. **Register and Login:**
   - Users and admins can register and login through the respective routes.
   - Admins have additional privileges to manage tasks and users.

2. **Task Management:**
   - Users can create, update, and delete their tasks.
   - Admins can assign tasks to users and manage all tasks.

3. **Task Filtering:**
   - Tasks can be filtered by priority, due date, and status.

## API Endpoints

### User Routes

- **POST** `/api/v1/user/register`: Register a new user
- **POST** `/api/v1/user/login`: Login a user
- **POST** `/api/v1/user/logout`: Logout a user
- **POST** `/api/v1/user/refresh-token`: Refresh access token
- **POST** `/api/v1/user/change-password`: Change user password

### Admin Routes

- **POST** `/api/v1/admin/register`: Register a new admin
- **POST** `/api/v1/admin/login`: Login an admin
- **PATCH** `/api/v1/admin/assignTask`: Assign users to a task

### Task Routes

- **POST** `/api/v1/tasks`: Create a new task
- **PATCH** `/api/v1/tasks/update/:taskId`: Update a task
- **DELETE** `/api/v1/tasks/delete/:taskId`: Delete a task
- **GET** `/api/v1/tasks/allTasks`: Get all tasks

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License.
