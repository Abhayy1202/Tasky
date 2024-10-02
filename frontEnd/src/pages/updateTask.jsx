import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function UpdateTask({ taskId, onTaskUpdated }) {
  const [task, setTask] = useState({ title: "", description: "", dueDate: "" });
  const [userIds, setUserIds] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const userRole = useSelector((state) => state.auth.role);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`/api/v1/tasks/${taskId}`);
        setTask(response.data.data);
        setUserIds(response.data.data.userIds || []);
      } catch (error) {
        alert(
          "Error fetching task: " +
            (error.response?.data?.message || error.message)
        );
      }
    };
    fetchTask();

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
  }, [taskId, userRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api1/v1/updateTask/${taskId}`, { ...task, userIds });
      alert("Task updated successfully!");
      onTaskUpdated();
    } catch (error) {
      alert(
        "Error updating task: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label
          htmlFor="dueDate"
          className="block text-sm font-medium text-gray-700"
        >
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          value={task.dueDate}
          onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
          disabled={userRole !== "admin"}
        />
      </div>
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
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Update Task
      </button>
    </form>
  );
}

export default UpdateTask;
