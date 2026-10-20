const ITEMS = [
  { id: "dashboard", label: "Resumen", icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" },
  { id: "articulos", label: "Artículos", icon: "M21 7.5 12 3 3 7.5v9L12 21l9-4.5v-9zM12 12 5 8.5M12 12l7-3.5M12 12v8.5" },
  { id: "proveedores", label: "Proveedores", icon: "M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6" },
];

export default function Sidebar({ current, onChange }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">E</span>
        <span>Inventario</span>
      </div>
      <nav>
        {ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${current === item.id ? "active" : ""}`}
            onClick={() => onChange(item.id)}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d={item.icon} />
            </svg>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
