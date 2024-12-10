export default async function handler(req, res) {
    if (req.method === 'PATCH') {
        try {
            const newPassword = req.body;
            const {token } = req.query;
            console.log("Si entre a la api");
            console.log("contra", newPassword);
            console.log("token", token);
            const response = await fetch(`http://localhost:3000/nutriologos/reset-password/${token}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req.body),
            });

            const data = await response.json();

            if (!response.ok) {
                return res.status(response.status).json({ error: data.error });
            }

            res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
        } catch (error) {
            console.error('Error al restablecer contraseña:', error);
            res.status(500).json({ error: 'Error interno del servidor.' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}