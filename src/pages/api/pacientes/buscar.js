export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { nombre } = req.query;

    // Obtener el token de autorización y verificar que exista
    const token = req.headers.authorization?.split(" ")[1]; // Extraer solo el token, sin "Bearer"
    if (!token) {
      return res.status(401).json({ error: 'Token de autorización no proporcionado' });
    }

    console.log("Buscando paciente con nombre:", nombre); // Verifica el valor de nombre

    try {
      const response = await fetch(`http://localhost:3000/paciente/nombre/${nombre}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Incluir solo el token en el encabezado
        },
      });

      const contentType = response.headers.get("content-type");

      // Verificar si la respuesta es JSON válida
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (!response.ok) {
          console.error("Error en la respuesta de la API externa:", data);
          return res.status(response.status).json({ error: data.error });
        }
        return res.status(200).json(data); // Retorna los datos del paciente
      } else {
        const errorText = await response.text();
        console.error("Respuesta no JSON recibida de la API externa:", errorText);
        return res.status(500).json({ error: "Respuesta no válida de la API externa", detalle: errorText });
      }
    } catch (error) {
      console.error("Error al conectar con el servidor externo:", error);
      res.status(500).json({ error: 'Error al conectar con el servidor' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}


  