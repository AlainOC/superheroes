const API_URL = "https://superheroes-rxcu.onrender.com/api";

export async function getMascotas(token: string) {
  const res = await fetch(`${API_URL}/mascotas`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Error al obtener mascotas");
  return res.json();
}

export async function getMascotaById(id: string, token: string) {
  const res = await fetch(`${API_URL}/mascotas/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Error al obtener mascota");
  return res.json();
}

export async function crearMascota(data: any, token: string) {
  console.log("Enviando datos al backend:", data); // Debug log
  const res = await fetch(`${API_URL}/mascotas`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Error al crear mascota");
  const result = await res.json();
  console.log("Respuesta del backend:", result); // Debug log
  return result;
}

export async function actualizarMascota(id: string, data: any, token: string) {
  const res = await fetch(`${API_URL}/mascotas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Error al actualizar mascota");
  return res.json();
}

export async function eliminarMascota(id: string, token: string) {
  const res = await fetch(`${API_URL}/mascotas/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Error al eliminar mascota");
  return true;
}

export async function alimentarMascota(id: string, token: string) {
  const res = await fetch(`${API_URL}/mascotas/${id}/alimentar`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Error al alimentar mascota");
  return res.json();
}

export async function pasearMascota(id: string, token: string) {
  const res = await fetch(`${API_URL}/mascotas/${id}/pasear`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Error al pasear mascota");
  return res.json();
}

export async function personalizarMascota(id: string, item: string, token: string) {
  const res = await fetch(`${API_URL}/mascotas/${id}/personalizar`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ item })
  });
  if (!res.ok) throw new Error("Error al personalizar mascota");
  return res.json();
}

export async function enfermarMascota(id: string, enfermedad: string, token: string) {
  const res = await fetch(`${API_URL}/mascotas/${id}/enfermar`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ enfermedad })
  });
  if (!res.ok) throw new Error("Error al enfermar mascota");
  return res.json();
}

export async function curarMascota(id: string, enfermedad: string, token: string) {
  const res = await fetch(`${API_URL}/mascotas/${id}/curar`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ enfermedad })
  });
  if (!res.ok) throw new Error("Error al curar mascota");
  return res.json();
}

export async function revivirMascota(id: string, token: string) {
  const res = await fetch(`${API_URL}/mascotas/${id}/revivir`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Error al revivir mascota");
  return res.json();
}

export async function matarMascota(id: string, causa: string, token: string) {
  const res = await fetch(`${API_URL}/mascotas/${id}/matar`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ causa })
  });
  if (!res.ok) throw new Error("Error al matar mascota");
  return res.json();
}

export async function pocionVidaMascota(id: string, token: string) {
  const res = await fetch(`${API_URL}/mascotas/${id}/pocion-vida`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Error al aplicar poción de vida");
  return res.json();
}

export async function getMascotasDisponibles(token: string) {
  const res = await fetch(`${API_URL}/adopcion/disponibles`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Error al obtener mascotas disponibles");
  return res.json();
} 