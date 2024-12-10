export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const response = await fetch('http://localhost:3000/nutriologos/reset-password-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req.body),
            });

            const data = await response.json();

            if (!response.ok) {
                return res.status(response.status).json({ error: data.error });
            }

            res.status(200).json({ message: 'Correo enviado para restablecer contraseña.' });
        } catch (error) {
            console.error('Error en la solicitud de restablecimiento:', error);
            res.status(500).json({ error: 'Error interno del servidor.' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}
