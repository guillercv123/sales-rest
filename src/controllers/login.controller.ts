import bcrypt from "bcrypt";
import { getUserByName } from '../services/user.service';



export const getUser = async (req:any, res:any) => {
    const { name, password } = req.body;

    try {
        const user = await getUserByName(name);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user[0].password_user);

        if (!isMatch) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        res.json({ message: 'Login exitoso', user });
    } catch (err:any) {
        res.status(500).json({ error: err.message });
    }
};