import {
    getAllUsers,
    getUserByEmail,
    getUserByName,
    insertUser,
    updatePasswordUserByEmail
} from '../services/user.service';
import bcrypt from "bcrypt";

export const getUsers = async (req:any, res:any) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

export const createUser = async (req:any, res:any) => {
    const { name, password ,email } = req.body;
    try {
        const existingUser = await getUserByName(name);
        if (existingUser && existingUser.length > 0) {
            return res.status(400).json({ error: 'El nombre de usuario ya está registrado' });
        }
        const existingEmail = await getUserByEmail(email);
        if (existingEmail && existingEmail.length > 0) {
            return res.status(400).json({ error: '"El correo electrónico ya está registrado. Si ya tienes una cuenta, podés intentar recuperar tu contraseña'});
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await insertUser(name,hashedPassword, email);
        res.status(201).json({ message: 'Usuario registrado correctamente.', user});
    } catch (err:any) {
        res.status(500).json({ error: err.message });
    }
};

export const updatePasswordUser = async (req:any , res:any) => {
    const { password ,email } = req.body;
    try{
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await updatePasswordUserByEmail(email,hashedPassword);
        res.status(200).json({ message: 'Usuario actualizado correctamente.', user});
    }catch (err:any) {
        res.status(500).json({ error: err.message });
    }

}
