import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

const Home = () => {
  return (
    <div className="flex text-gray-200 flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome To Tasky</h1>
      <h2 className="text-2xl mb-6">Select your role</h2>
      <div className="space-y-4">
        <Link to="user/signup">
          <Button className="w-32">User</Button>
        </Link>{" "}
        <Link to="admin/signup">
          <Button className="w-32">Admin</Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
