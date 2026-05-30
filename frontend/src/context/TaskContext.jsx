import { createContext, useContext, useReducer, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const TaskContext = createContext();

function taskReducer(state, action) {
  switch (action.type) {
    case 'SET_TASKS': return { ...state, tasks: action.payload, loading: false };
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'ADD_TASK': return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK': return { ...state, tasks: state.tasks.map((t) => t._id === action.payload._id ? action.payload : t) };
    case 'DELETE_TASK': return { ...state, tasks: state.tasks.filter((t) => t._id !== action.payload) };
    case 'MOVE_TASK': {
      const { taskId, newStatus, newPosition } = action.payload;
      return { ...state, tasks: state.tasks.map((t) => t._id === taskId ? { ...t, status: newStatus, position: newPosition } : t) };
    }
    default: return state;
  }
}

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, { tasks: [], loading: true });

  const fetchTasks = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data } = await api.get('/tasks');
      dispatch({ type: 'SET_TASKS', payload: data.data });
    } catch { toast.error('Failed to load tasks'); dispatch({ type: 'SET_LOADING', payload: false }); }
  }, []);

  const createTask = async (taskData) => {
    const { data } = await api.post('/tasks', taskData);
    dispatch({ type: 'ADD_TASK', payload: data.data });
    return data.data;
  };

  const updateTask = async (id, taskData) => {
    const { data } = await api.put(`/tasks/${id}`, taskData);
    dispatch({ type: 'UPDATE_TASK', payload: data.data });
    return data.data;
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const moveTask = async (taskId, newStatus, newPosition) => {
    dispatch({ type: 'MOVE_TASK', payload: { taskId, newStatus, newPosition } });
    try { await api.patch(`/tasks/${taskId}/move`, { status: newStatus, position: newPosition }); }
    catch { toast.error('Failed to save position'); fetchTasks(); }
  };

  const getByStatus = (status) => state.tasks.filter((t) => t.status === status).sort((a, b) => a.position - b.position);

  return <TaskContext.Provider value={{ ...state, fetchTasks, createTask, updateTask, deleteTask, moveTask, getByStatus }}>{children}</TaskContext.Provider>;
};

export const useTasks = () => useContext(TaskContext);
