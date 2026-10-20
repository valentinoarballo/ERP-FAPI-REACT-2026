import { useCallback, useEffect, useState } from "react";
import { getProveedores } from "../api.js";
import DataTable from "../components/DataTable.jsx";
import Modal from "../components/Modal.jsx";
import ProveedorForm from "../components/ProveedorForm.jsx";

export default function Proveedores({ notify }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRows(await getProveedores());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Columnas armadas a partir de los datos reales de la API
  const sample = rows[0] ?? {};
  const keys = Object.keys(sample);
  const columns = keys.map((key) => {
    const value = sample[key];
    if (Array.isArray(value)) {
      return { key, label: key, align: "right", render: (r) => r[key]?.length ?? 0 };
    }
    if (typeof value === "boolean") {
      return { key, label: key, render: (r) => <span className={`badge ${r[key] ? "badge-ok" : "badge-off"}`}>{r[key] ? "Sí" : "No"}</span> };
    }
    return { key, label: key, render: (r) => (key === "id" ? <span className="muted">#{r[key]}</span> : r[key]) };
  });

  return (
    <section className="panel">
      <div className="toolbar">
        <span className="muted">{rows.length} proveedores</span>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          Nuevo proveedor
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}
      <DataTable columns={columns.length ? columns : [{ key: "id", label: "Proveedor" }]} rows={rows} loading={loading} emptyText="No hay proveedores. Creá el primero con “Nuevo proveedor”." />

      {open && (
        <Modal title="Nuevo proveedor" onClose={() => setOpen(false)}>
          <ProveedorForm
            onCancel={() => setOpen(false)}
            onCreated={() => {
              setOpen(false);
              notify("Proveedor creado");
              load();
            }}
          />
        </Modal>
      )}
    </section>
  );
}
