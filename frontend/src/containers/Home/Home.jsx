import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import axios from "../../api/axios";
import { todosRoute } from "../../api/routes";
import { useAuthContext } from "../../contexts/AuthContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/fontawesome-free-solid";

import "./Home.scss";

function Home() {
  const { isLoggedIn } = useAuthContext();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(todosRoute);
      if (response.data.success) {
        setTodos(response.data.todos);
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to load todos.");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchTodos();
    }
  }, [isLoggedIn]);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      toast.error("Please enter a todo item.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(todosRoute, {
        title: newTodo.trim(),
      });
      if (response.data.success) {
        setTodos([response.data.todo, ...todos]);
        setNewTodo("");
        toast.success(response.data.msg);
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to add todo.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (todoId, currentCompleted) => {
    try {
      const response = await axios.put(`${todosRoute}/${todoId}`, {
        completed: !currentCompleted,
      });
      if (response.data.success) {
        setTodos(
          todos.map((todo) =>
            todo._id === todoId ? response.data.todo : todo
          )
        );
        toast.success(response.data.msg);
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to update todo.");
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      const response = await axios.delete(`${todosRoute}/${todoId}`);
      if (response.data.success) {
        setTodos(todos.filter((todo) => todo._id !== todoId));
        toast.success(response.data.msg);
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to delete todo.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="text-center">
        <main>
          <h1 className="mt-4 mb-2">Welcome to the Home Page!</h1>
          <p>Believe you can and you're halfway there.</p>
          <p className="mt-4">
            Please <Link to="/login">Login</Link> or{" "}
            <Link to="/register">Register</Link> to manage your todos.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="todo-container">
      <main className="todo-main">
        <h1 className="todo-header">My Todo List</h1>

        <form onSubmit={addTodo} className="add-todo-form">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Add a new todo..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="btn btn-dark add-btn"
              disabled={loading}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        </form>

        <div className="todo-list">
          {todos.length === 0 ? (
            <div className="empty-state">
              <p>No todos yet. Add your first todo above!</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo._id}
                className={`todo-item ${todo.completed ? "completed" : ""}`}
              >
                <div className="todo-content">
                  <input
                    type="checkbox"
                    className="todo-checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo._id, todo.completed)}
                  />
                  <span className="todo-title">{todo.title}</span>
                </div>
                <button
                  className="btn btn-outline-danger delete-btn"
                  onClick={() => deleteTodo(todo._id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
