// pages/api/getUltimaConsulta.js

export default async function handler(req, res) {
    console.log("Hola desde la api de getMediciones");
    const { noBoleta } = req.query; // Obtener el parámetro noBoleta desde la URL

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: 'Token de autorización no proporcionado' });
    }

    try {
      const response = await fetch(`http://localhost:3000/consulta/getMediciones/${noBoleta}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json(errorData);
      }

      const data = await response.json();
      return res.status(200).json(data); // Retornar los datos obtenidos del backend

    } catch (error) {
      console.error('Error en la solicitud:', error);
      return res.status(500).json({ error: 'Error al hacer la solicitud al backend' });
    }
  }
