import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://localhost:5000/tasks"; // Update when hosting

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [deadline, setDeadline] = useState("");
    const [editingTask, setEditingTask] = useState(null);
    const [editText, setEditText] = useState("");
    const [editDeadline, setEditDeadline] = useState("");

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(API_URL);
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const addTask = async () => {
        if (!newTask.trim() || !deadline.trim()) return;
        try {
            const response = await axios.post(API_URL, { title: newTask, deadline });
            setTasks([...tasks, response.data]);
            setNewTask("");
            setDeadline("");
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const removeTask = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setTasks(tasks.filter((task) => task._id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const startEditing = (task) => {
        setEditingTask(task);
        setEditText(task.title);
        setEditDeadline(task.deadline);
    };

    const saveEdit = async () => {
        if (!editText.trim() || !editDeadline.trim()) return;
        try {
            await axios.put(`${API_URL}/${editingTask._id}`, { title: editText, deadline: editDeadline });
            setTasks(tasks.map((task) => (task._id === editingTask._id ? { ...task, title: editText, deadline: editDeadline } : task)));
            setEditingTask(null);
            setEditText("");
            setEditDeadline("");
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const isPastDeadline = (deadline) => new Date(deadline) < new Date();

    return (
        <div className="container mt-4">
            <div className="card shadow-lg p-4 border-0 rounded-4">
                <h2 className="text-center text-primary mb-4 fw-bold">📌 To-Do List</h2>

                {/* Add Task Section */}
                <div className="card p-3 mb-4 border-0 shadow-sm">
                    <h5 className="text-secondary mb-3">➕ Add New Task</h5>
                    <div className="d-flex flex-wrap gap-2">
                        <input
                            type="text"
                            className="form-control"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Enter a task..."
                        />
                        <input
                            type="date"
                            className="form-control"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                        />
                        <button className="btn btn-success px-4" onClick={addTask}>Add</button>
                    </div>
                </div>

                {/* Edit Task Section (Only Visible When Editing) */}
                {editingTask && (
                    <div className="card p-3 mb-4 border-0 shadow-sm">
                        <h5 className="text-warning mb-3">✏️ Editing Task</h5>
                        <div className="d-flex flex-wrap gap-2">
                            <input
                                type="text"
                                className="form-control"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                            />
                            <input
                                type="date"
                                className="form-control"
                                value={editDeadline}
                                onChange={(e) => setEditDeadline(e.target.value)}
                            />
                            <button className="btn btn-primary px-4" onClick={saveEdit}>Save</button>
                            <button className="btn btn-secondary" onClick={() => setEditingTask(null)}>Cancel</button>
                        </div>
                    </div>
                )}

                {/* Task List */}
                <ul className="list-group">
                    {tasks.length === 0 ? (
                        <p className="text-center text-muted">No tasks added yet.</p>
                    ) : (
                        tasks.map((task) => (
                            <li
                                key={task._id}
                                className={`list-group-item d-flex justify-content-between align-items-center rounded-3 shadow-sm border-0 mb-2 p-3 
                                ${isPastDeadline(task.deadline) ? "bg-warning text-dark" : "bg-light"}`}
                            >
                                <span className="fw-bold">
                                    {task.title} - <small className="text-muted">{task.deadline}</small>
                                </span>

                                <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-warning" onClick={() => startEditing(task)}>✏️ Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => removeTask(task._id)}>🗑️ Delete</button>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default TodoList;
