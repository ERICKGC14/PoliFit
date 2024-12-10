// pages/api/nutriologos/register.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const response = await fetch('http://localhost:3000/nutriologos/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req.body),
            });

            const data = await response.json();
            if (!response.ok) {
                return res.status(response.status).json({ error: data.error });
            }

            res.status(201).json(data);
        } catch (error) {
            res.status(500).json({ error: 'Error al conectar con el servidor' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}
