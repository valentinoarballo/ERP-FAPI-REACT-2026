import { useCallback, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Articulos from "./pages/Articulos.jsx";
import Proveedores from "./pages/Proveedores.jsx";

const VIEWS = {
  dashboard: { title: "Resumen", Component: Dashboard },
  articulos: { title: "Artículos", Component: Articulos },
  proveedores: { title: "Proveedores", Component: Proveedores },
};

export default function App() {
  const [view, setView] = useState("dashboard");
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, type = "ok") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const { title, Component } = VIEWS[view];

  return (
    <div className="shell">
      <Sidebar current={view} onChange={setView} />
      <main className="main">
        <header className="topbar">
          <h1>{title}</h1>
        </header>
        <Component notify={notify} goTo={setView} />
      </main>
      {toast && (
        <div className={`toast toast-${toast.type}`} role="status">
          {toast.message}
        </div>
      )}
    </div>
  );
}
