import { useState } from 'react';

function TodoItem({ todo, onToggleStatus, onDelete, onSaveEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);

  const handleSave = () => {
    if (!editText.trim()) return;
    onSaveEdit(todo.id, editText.trim());
    setIsEditing(false);
  };

  return (
    <article className="todo-card">
      <label className="todo-main">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggleStatus(todo.id, todo.completed)}
        />
        {isEditing ? (
          <input
            className="text-input"
            value={editText}
            onChange={(event) => setEditText(event.target.value)}
            maxLength={120}
          />
        ) : (
          <span className={todo.completed ? 'todo-title done' : 'todo-title'}>
            {todo.title}
          </span>
        )}
      </label>

      <div className="todo-actions">
        {isEditing ? (
          <>
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
            <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <button className="btn btn-danger" onClick={() => onDelete(todo.id)}>
              Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
}

export default TodoItem;
