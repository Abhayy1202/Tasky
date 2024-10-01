import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice.js";
import axios from "axios";

const LogoutBtn = () => {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.role); // Corrected state path
  const logoutHandler = () => {
    const logoutUrl =
      userRole === "admin" ? "/api/v1/admin/logout" : "/api/v1/user/logout";
    axios.post(logoutUrl).then(() => {
      dispatch(logout());
    });
  };
  return (
    <button
      className="inline-block px-6 py-2 duration-200 hover:bg-blue-100 dark:hover:bg-slate-600 rounded-full"
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
};

export default LogoutBtn;
