import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function GetAllTasks() {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [filters, setFilters] = useState({
    priority: false,
    dueDate: false,
    status: false,
  });
  const tasksPerPage = 5;
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.auth.role);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const query = new URLSearchParams({
          page: currentPage,
          limit: tasksPerPage,
          ...(filters.priority && { priority: true }),
          ...(filters.dueDate && { dueDate: true }),
          ...(filters.status && { status: true }),
        }).toString();

        const response = await axios.get(`/api/v1/tasks/getAllTasks?${query}`);
        setTasks(response.data.tasks);
        setTotalTasks(response.data.totalTasks);
      } catch (error) {
        alert(
          "Error fetching tasks: " +
            (error.response?.data?.message || error.message)
        );
      }
    };
    fetchTasks();
  }, [currentPage, filters]);

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`/api/v1/tasks/delete/${taskId}`);
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, deleted: true } : task
        )
      );
      alert("Task deleted successfully!");
    } catch (error) {
      alert(
        "Error deleting task: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      {/* Left Side - Filters */}
      <div className="w-1/3 p-4 bg-gray-800 flex flex-col">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400">
            Privilege:
          </label>
          <div className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm">
            <span className="font-bold uppercase">{userRole}</span>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-400">Filters</h3>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-400">
              <input
                type="checkbox"
                name="priority"
                checked={filters.priority}
                onChange={handleFilterChange}
                className="mr-2"
              />
              Filter by Priority
            </label>
            <label className="block text-sm font-medium text-gray-400">
              <input
                type="checkbox"
                name="dueDate"
                checked={filters.dueDate}
                onChange={handleFilterChange}
                className="mr-2"
              />
              Filter by Due Date
            </label>
            <label className="block text-sm font-medium text-gray-400">
              <input
                type="checkbox"
                name="status"
                checked={filters.status}
                onChange={handleFilterChange}
                className="mr-2"
              />
              Filter by Status
            </label>
          </div>
        </div>
      </div>

      {/* Right Side - Tasks */}
      <div className="w-2/3 p-4 flex flex-col">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task._id}
              className={`bg-gray-800 shadow overflow-hidden sm:rounded-lg p-4 mb-4 ${
                task.deleted ? "line-through" : ""
              }`}
            >
              <h3
                className="text-lg leading-6 font-medium text-gray-200 cursor-pointer"
                onClick={() =>
                  setExpandedTaskId(
                    task._id === expandedTaskId ? null : task._id
                  )
                }
              >
                {task.title}
              </h3>
              {expandedTaskId === task._id && (
                <div>
                  <p className="mt-1 max-w-2xl text-sm text-gray-400">
                    {task.description}
                  </p>
                  <p className="mt-1 max-w-2xl text-sm text-gray-400">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                  <div className="mt-4">
                    <button
                      onClick={() => navigate(`/user/updateTask/${task._id}`)}
                      className="mr-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-200 bg-indigo-700 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-200 bg-red-700 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No tasks available. Please create a new task.</p>
        )}
        <div className="flex justify-between items-center mt-4">
          <div>
            {Array.from(
              { length: Math.ceil(totalTasks / tasksPerPage) },
              (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 border ${
                    currentPage === i + 1
                      ? "bg-gray-700 text-gray-200"
                      : "bg-gray-800 text-gray-400"
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
          <button
            onClick={() => navigate("/user/createTask")}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-200 bg-green-700 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Create New Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default GetAllTasks;
