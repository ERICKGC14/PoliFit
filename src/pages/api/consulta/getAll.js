export default async function handler(req, res) {
    if (req.method === 'GET') {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: 'Token de autorización no proporcionado' });
      }
  
      try {
        console.log("Iniciando solicitud al backend...");
  
        const response = await fetch("http://localhost:3000/consulta/getAll", {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        const contentType = response.headers.get("content-type");
        console.log("Content-Type del backend:", contentType);
  
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          console.log("Datos recibidos del backend:", data);
          return res.status(200).json(data);
        } else {
          const errorText = await response.text();
          console.error("Respuesta inesperada del backend:", errorText);
          return res.status(500).json({ error: "Respuesta inesperada del backend", details: errorText });
        }
      } catch (error) {
        console.error("Error al conectar con el backend:", error.message);
        res.status(500).json({ error: 'Error al conectar con el backend', details: error.message });
      }
    } else {
      res.status(405).json({ error: 'Método no permitido' });
    }
  }
  