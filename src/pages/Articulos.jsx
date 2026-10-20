import { useCallback, useEffect, useMemo, useState } from "react";
import { getArticulos, getProveedores } from "../api.js";
import DataTable from "../components/DataTable.jsx";
import Modal from "../components/Modal.jsx";
import ArticuloForm from "../components/ArticuloForm.jsx";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "USD" });

export default function Articulos({ notify }) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [data, setData] = useState({ items: [], total: 0, pages: 1 });
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await getArticulos(page, size));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    getProveedores().then(setProveedores).catch(() => {});
  }, []);

  const nombreProveedor = useMemo(
    () => Object.fromEntries(proveedores.map((p) => [p.id, p.nombre])),
    [proveedores]
  );

  const rows = data.items.filter((a) =>
    a.nombre.toLowerCase().includes(query.toLowerCase())
  );

  const columns = [
    { key: "id", label: "ID", render: (r) => <span className="muted">#{r.id}</span> },
    { key: "nombre", label: "Nombre", render: (r) => <strong>{r.nombre}</strong> },
    { key: "proveedor", label: "Proveedor", render: (r) => nombreProveedor[r.proveedor_id] ?? <span className="muted">Sin asignar</span> },
    { key: "stock", label: "Stock", align: "right", render: (r) => <span className={r.stock <= 5 ? "stock-low" : ""}>{r.stock}</span> },
    { key: "precio", label: "Precio", align: "right", render: (r) => money.format(r.precio) },
    { key: "activo", label: "Estado", render: (r) => <span className={`badge ${r.activo ? "badge-ok" : "badge-off"}`}>{r.activo ? "Activo" : "Inactivo"}</span> },
  ];

  return (
    <section className="panel">
      <div className="toolbar">
        <input className="search" placeholder="Buscar en esta página…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          Nuevo artículo
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}
      <DataTable columns={columns} rows={rows} loading={loading} emptyText="No hay artículos. Creá el primero con “Nuevo artículo”." />

      <footer className="pager">
        <span className="muted">{data.total} artículos</span>
        <div className="pager-controls">
          <select value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(1); }} aria-label="Filas por página">
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>{n} por página</option>
            ))}
          </select>
          <button className="btn btn-ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</button>
          <span className="muted">Página {page} de {Math.max(data.pages, 1)}</span>
          <button className="btn btn-ghost" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Siguiente</button>
        </div>
      </footer>

      {open && (
        <Modal title="Nuevo artículo" onClose={() => setOpen(false)}>
          <ArticuloForm
            proveedores={proveedores}
            onCancel={() => setOpen(false)}
            onCreated={() => {
              setOpen(false);
              notify("Artículo creado");
              load();
            }}
          />
        </Modal>
      )}
    </section>
  );
}
