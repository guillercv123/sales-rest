import {getAllUsers, getUserByName, insertUser} from '../services/user.service';
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
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const inserted = await insertUser(name,hashedPassword, email);
        res.status(201).json(inserted[0]);
    } catch (err:any) {
        res.status(500).json({ error: err.message });
    }
};
