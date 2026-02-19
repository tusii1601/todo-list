function ThemeToggle({ theme, onToggle }) {
  return (
    <button className="btn btn-secondary" onClick={onToggle}>
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}

export default ThemeToggle;
