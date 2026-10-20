import { useState } from "react";
import { createProveedor } from "../api.js";

export default function ProveedorForm({ onCreated, onCancel }) {
  const [form, setForm] = useState({ nombre: "", telefono: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const created = await createProveedor({
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim(),
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
        <input required maxLength={90} value={form.nombre} onChange={(e) => set("nombre", e.target.value)} autoFocus />
      </label>

      <label>
        Teléfono
        <input required type="tel" value={form.telefono} onChange={(e) => set("telefono", e.target.value)} />
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancelar
        </button>
        <button className="btn btn-primary" disabled={saving}>
          {saving ? "Guardando…" : "Crear proveedor"}
        </button>
      </div>
    </form>
  );
}
