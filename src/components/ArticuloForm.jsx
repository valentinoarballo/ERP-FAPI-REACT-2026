import { useState } from "react";
import { createArticulo } from "../api.js";

export default function ArticuloForm({ proveedores, onCreated, onCancel }) {
  const [form, setForm] = useState({
    nombre: "",
    stock: 0,
    precio: 0,
    activo: true,
    proveedor_id: proveedores[0]?.id ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const created = await createArticulo({
        nombre: form.nombre.trim(),
        stock: Number(form.stock),
        precio: Number(form.precio),
        activo: form.activo,
        proveedor_id: Number(form.proveedor_id),
      });
      onCreated(created);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <label>
        Nombre
        <input required value={form.nombre} onChange={(e) => set("nombre", e.target.value)} autoFocus />
      </label>

      <div className="form-row">
        <label>
          Stock
          <input type="number" min="0" step="1" required value={form.stock} onChange={(e) => set("stock", e.target.value)} />
        </label>
        <label>
          Precio
          <input type="number" min="0" step="any" required value={form.precio} onChange={(e) => set("precio", e.target.value)} />
        </label>
      </div>

      <label>
        Proveedor
        {proveedores.length > 0 ? (
          <select value={form.proveedor_id} onChange={(e) => set("proveedor_id", e.target.value)}>
            {proveedores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre ?? `Proveedor ${p.id}`}
              </option>
            ))}
          </select>
        ) : (
          <input type="number" min="0" value={form.proveedor_id} onChange={(e) => set("proveedor_id", e.target.value)} />
        )}
      </label>

      <label className="check">
        <input type="checkbox" checked={form.activo} onChange={(e) => set("activo", e.target.checked)} />
        Artículo activo
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancelar
        </button>
        <button className="btn btn-primary" disabled={saving}>
          {saving ? "Guardando…" : "Crear artículo"}
        </button>
      </div>
    </form>
  );
}
