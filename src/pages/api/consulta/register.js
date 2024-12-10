// pages/api/consulta/register.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: 'Token de autorización no proporcionado' });
      }
  
      try {
        const response = await fetch("http://localhost:3000/consulta/register", {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(req.body),
        });
  
        if (response.ok) {
          const data = await response.json();
          return res.status(200).json(data);
        } else {
          const errorData = await response.json();
          console.error("Error en la API de backend:", errorData);
          return res.status(response.status).json({ error: errorData.error });
        }
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
        res.status(500).json({ error: 'Error al conectar con el backend' });
      }
    } else {
      res.status(405).json({ error: 'Método no permitido' });
    }
  }
  