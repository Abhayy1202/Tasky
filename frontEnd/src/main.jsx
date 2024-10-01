import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import store from "./store/store.js";

import CreateTask from "./pages/createTask.jsx";
import GetAllTasks from "./pages/getAllTask.jsx";
import LoginAdmin from "./pages/loginAdmin.jsx";
import Home from "./pages/Home.jsx";
import LoginUser from "./pages/loginUser.jsx";
import Signup from "./pages/signupUser.jsx";
import SignupAdmin from "./pages/signupAdmin.jsx";
import AuthLayout from "./components/AuthLayout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // The shared main app layout or component
    children: [
      {
        path: "/", // Home route
        element: <Home />,
      },

      // User routes
      {
        path: "/user/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ), // Signup component for users
      },
      {
        path: "/user/login",
        element: (
          <AuthLayout authentication={false}>
            {" "}
            {/* authentication=false since login doesn't require authentication */}
            <LoginUser />
          </AuthLayout>
        ),
      }, // /user/login
      {
        path: "/user/createTask",
        element: (
          <AuthLayout authentication={true}>
            <CreateTask />
          </AuthLayout>
        ),
      }, // /user/createTask
      {
        path: "/user/getAllTasks",
        element: (
          <AuthLayout authentication={true}>
            <GetAllTasks />
          </AuthLayout>
        ),
      }, // /user/getAllTasks

      // Admin routes
      {
        path: "/admin/signup",
        element: (
          <AuthLayout authentication={false}>
            <SignupAdmin />
          </AuthLayout>
        ), // Signup component for admins
      },
      {
        path: "/admin/login",
        element: (
          <AuthLayout authentication={false}>
            <LoginAdmin />
          </AuthLayout>
        ), // /admin/login
      },
      {
        path: "/admin/createTask",
        element: (
          <AuthLayout authentication={true}>
            <CreateTask />
          </AuthLayout>
        ), // /admin/createTask
      },
      {
        path: "/admin/getAllTasks",
        element: (
          <AuthLayout authentication={true}>
            <GetAllTasks />
          </AuthLayout>
        ), // /admin/getAllTasks
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
