import { getAllUsers, insertUser } from '../services/user.service.js';
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

export const createUser = async (req, res) => {
    const { name, password ,email } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const inserted = await insertUser(name,hashedPassword, email);
        res.status(201).json(inserted[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
