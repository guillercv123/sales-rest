import {
    getAllUsers,
    getUserByEmail,
    getUserByName,
    insertUser,
    updatePasswordUserByEmail
} from '../services/user.service';
import bcrypt from "bcrypt";
import {MESSAGES} from "../constants/message";

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
            return res.status(400).json({ error: MESSAGES.USERNAME_TAKEN });
        }
        const existingEmail = await getUserByEmail(email);
        if (existingEmail && existingEmail.length > 0) {
            return res.status(400).json({ error: MESSAGES.EMAIL_ALREADY_REGISTERED});
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await insertUser(name,hashedPassword, email);
        res.status(201).json({ message: MESSAGES.USER_REGISTERED_SUCCESS, user});
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
        res.status(200).json({ message: MESSAGES.USER_UPDATED_SUCCESS, user});
    }catch (err:any) {
        res.status(500).json({ error: err.message });
    }

}
