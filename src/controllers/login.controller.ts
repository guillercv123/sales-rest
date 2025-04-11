import bcrypt from "bcrypt";
import { getUserByName } from '../services/user.service';
import {MESSAGES} from "../constants/message";
import jwt from 'jsonwebtoken';

export const getUser = async (req:any, res:any) => {
    const { name, password } = req.body;

    try {
        const user = await getUserByName(name);

        if (!user) {
            return res.status(404).json({ error: MESSAGES.USER_NOT_FOUND });
        }

        const isMatch = await bcrypt.compare(password, user[0].password_user);

        if (!isMatch) {
            return res.status(401).json({ error: MESSAGES.INCORRECT_PASSWORD });
        }
        // const payload = {
        //     userId: user[0].id,
        //     username: user[0].name,
        // };
        // const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        res.json({ message: MESSAGES.LOGIN_SUCCESS, user });
    } catch (err:any) {
        res.status(500).json({ error: err.message });
    }
};