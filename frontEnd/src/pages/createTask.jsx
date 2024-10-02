import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";

function CreateTask({ onTaskCreated }) {
  const [task, setTask] = useState({ title: "", description: "", dueDate: "" });
  const [userIds, setUserIds] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const userRole = useSelector((state) => state.auth.role);
  const userId = useSelector((state) => state.auth.userData?._id);

  useEffect(() => {
    if (userRole === "admin") {
      const fetchUsers = async () => {
        try {
          const response = await axios.get("/api/v1/admin/getUsers");
          setAllUsers(response.data.users);
        } catch (error) {
          alert(
            "Error fetching users: " +
              (error.response?.data?.message || error.message)
          );
        }
      };
      fetchUsers();
    }
  }, [userRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = userRole==="admin"?"/api/v1/admin/createTask":"/api/v1/tasks/createTask"
      await axios.post(url, {
        ...task,
        userIds: userRole === "admin" ? userIds : [userId],
      });
      alert("Task created successfully!");
      setTask({ title: "", description: "", dueDate: "" });
      setUserIds([]);
      onTaskCreated();
    } catch (error) {
      alert(
        "Error creating task: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
        <h2 className="text-center text-2xl font-bold leading-tight">
          Create a New Task
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Title: "
            placeholder="Enter task title"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            required
          />
          <Input
            label="Description: "
            placeholder="Enter task description"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            required
          />
          <Input
            label="Due Date: "
            type="date"
            value={task.dueDate}
            onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
            required
          />
          {userRole === "admin" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Assign Users:
              </label>
              <select
                multiple
                value={userIds}
                onChange={(e) =>
                  setUserIds(
                    [...e.target.selectedOptions].map((option) => option.value)
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                {allUsers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.fullName}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Privilege:
            </label>
            <div className="mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md shadow-sm">
              <span className="font-bold uppercase">{userRole}</span>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-100 duration-150 bg-gradient-to-r from-[#656561] to-[#125555] dark:from-teal-500 dark:to-blue-600 hover:from-pink-700 hover:to-orange-700"
          >
            Create Task
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreateTask;
