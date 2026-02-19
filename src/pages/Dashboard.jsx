import { useEffect, useMemo, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import ConfirmModal from '../components/ConfirmModal';
import ThemeToggle from '../components/ThemeToggle';
import TodoItem from '../components/TodoItem';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';

function Dashboard() {
  const { currentUser } = useAuth();
  const [todoText, setTodoText] = useState('');
  const [todos, setTodos] = useState([]);
  const [loadingTodos, setLoadingTodos] = useState(true);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!currentUser) return undefined;

    const todosRef = collection(db, 'todos');
    const todosQuery = query(
      todosRef,
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(
      todosQuery,
      (snapshot) => {
        const nextTodos = snapshot.docs.map((todoDoc) => ({
          id: todoDoc.id,
          ...todoDoc.data(),
        }));
        setTodos(nextTodos);
        setLoadingTodos(false);
      },
      () => {
        toast.error('Failed loading your todos.');
        setLoadingTodos(false);
      },
    );

    return unsubscribe;
  }, [currentUser]);

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos],
  );

  const handleAddTodo = async (event) => {
    event.preventDefault();
    const title = todoText.trim();
    if (!title || !currentUser) return;

    try {
      await addDoc(collection(db, 'todos'), {
        title,
        completed: false,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      });
      setTodoText('');
      toast.success('Todo added');
    } catch {
      toast.error('Could not add todo');
    }
  };

  const handleToggleStatus = async (id, previousStatus) => {
    try {
      await updateDoc(doc(db, 'todos', id), { completed: !previousStatus });
      toast.success(`Marked as ${previousStatus ? 'pending' : 'completed'}`);
    } catch {
      toast.error('Status update failed');
    }
  };

  const handleSaveEdit = async (id, title) => {
    try {
      await updateDoc(doc(db, 'todos', id), { title });
      toast.success('Todo updated');
    } catch {
      toast.error('Update failed');
    }
  };

  const handleDeleteTodo = async () => {
    if (!pendingDeleteId) return;

    try {
      await deleteDoc(doc(db, 'todos', pendingDeleteId));
      toast.success('Todo deleted');
      setPendingDeleteId(null);
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <section className="dashboard-wrapper">
      <div className="dashboard-header">
        <div>
          <h1>Your Todos</h1>
          <p>
            {completedCount}/{todos.length} completed
          </p>
        </div>
        <ThemeToggle
          theme={theme}
          onToggle={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
        />
      </div>

      <form className="todo-form" onSubmit={handleAddTodo}>
        <input
          className="text-input"
          placeholder="Add a new todo..."
          value={todoText}
          maxLength={120}
          onChange={(event) => setTodoText(event.target.value)}
        />
        <button className="btn btn-primary">Add</button>
      </form>

      {loadingTodos ? (
        <div className="status-card">Loading todos…</div>
      ) : todos.length === 0 ? (
        <div className="status-card">No todos yet. Add your first one ✨</div>
      ) : (
        <div className="todo-grid">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleStatus={handleToggleStatus}
              onSaveEdit={handleSaveEdit}
              onDelete={setPendingDeleteId}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(pendingDeleteId)}
        title="Delete todo?"
        description="This action cannot be undone."
        onConfirm={handleDeleteTodo}
        onCancel={() => setPendingDeleteId(null)}
      />
    </section>
  );
}

export default Dashboard;
