// URL base de la API. Podés cambiarla con VITE_API_URL en un archivo .env
const BASE = (
  import.meta.env.VITE_API_URL
).replace(/\/$/, "");

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail =
        typeof body.detail === "string"
          ? body.detail
          : JSON.stringify(body.detail ?? body);
    } catch {
      /* respuesta sin JSON */
    }
    throw new Error(`Error ${res.status}: ${detail}`);
  }
  return res.json();
}

// ---------- Artículos ----------
export const getArticulos = (page = 1, size = 10) =>
  request(`/articulos/?page=${page}&size=${size}`);

export const createArticulo = (data) =>
  request("/articulos/", { method: "POST", body: JSON.stringify(data) });

// ---------- Proveedores ----------
export const getProveedores = () => request("/proveedor/");

export const createProveedor = (data) =>
  request("/proveedor/proveedor", { method: "POST", body: JSON.stringify(data) });
