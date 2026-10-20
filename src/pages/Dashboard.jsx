import { useEffect, useState } from "react";
import { getArticulos, getProveedores } from "../api.js";
import DataTable from "../components/DataTable.jsx";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "USD" });

export default function Dashboard({ goTo }) {
  const [articulos, setArticulos] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getArticulos(1, 100), getProveedores()])
      .then(([a, p]) => {
        setArticulos(a);
        setProveedores(p);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="form-error">{error}</p>;
  if (!articulos) return <p className="muted">Cargando resumen…</p>;

  const items = articulos.items;
  const valor = items.reduce((acc, a) => acc + a.precio * a.stock, 0);
  const bajos = items.filter((a) => a.stock <= 5);

  const kpis = [
    { label: "Artículos", value: articulos.total },
    { label: "Proveedores", value: proveedores.length },
    { label: "Valor del inventario", value: money.format(valor) },
    { label: "Con stock bajo", value: bajos.length, warn: bajos.length > 0 },
  ];

  return (
    <>
      <div className="kpis">
        {kpis.map((k) => (
          <div key={k.label} className="kpi">
            <span className="kpi-label">{k.label}</span>
            <span className={`kpi-value ${k.warn ? "stock-low" : ""}`}>{k.value}</span>
          </div>
        ))}
      </div>

      <section className="panel">
        <div className="toolbar">
          <h2>Stock bajo (5 unidades o menos)</h2>
          <button className="btn btn-ghost" onClick={() => goTo("articulos")}>Ver artículos</button>
        </div>
        <DataTable
          columns={[
            { key: "nombre", label: "Artículo", render: (r) => <strong>{r.nombre}</strong> },
            { key: "stock", label: "Stock", align: "right", render: (r) => <span className="stock-low">{r.stock}</span> },
            { key: "precio", label: "Precio", align: "right", render: (r) => money.format(r.precio) },
          ]}
          rows={bajos}
          emptyText="Ningún artículo con stock bajo."
        />
      </section>
    </>
  );
}
