//pages/api/nutriologos/getNutriologo
export default async function handler(req, res) {
    const token = req.headers.authorization?.split(" ")[1]; // Obtener el token del encabezado
    if (!token) {
      return res.status(401).json({ error: 'Token de autorización no proporcionado' });
    }
  
    try {
      if (req.method === 'GET') {
        // Manejo de solicitud GET para visualizar el perfil
        // console.log("Token recibido para GET:", token);
  
        const response = await fetch('http://localhost:3000/nutriologos', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token
          },
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          return res.status(response.status).json({ error: data.error });
        }
  
        res.status(200).json(data); // Devuelve los datos del perfil
      } else {
        res.status(405).json({ error: 'Método no permitido' });
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
}