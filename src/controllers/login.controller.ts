import bcrypt from "bcrypt";
import {UserService} from '../services/user.service';
import {MESSAGES} from "../constants/message";
import {autoInjectable} from "tsyringe";
@autoInjectable()
export class LoginController {
    constructor(private readonly service: UserService) {
    }
    async getUser(req:any, res:any) {
        const { name, password } = req.body;

        try {
            const user = await this.service.getUserByName(name);

            if (!user) {
                return res.status(404).json({ error: MESSAGES.USER_NOT_FOUND });
            }

            const isMatch = await bcrypt.compare(password, user[0].password_user);

            if (!isMatch) {
                return res.status(401).json({ error: MESSAGES.INCORRECT_PASSWORD });
            }
            res.status(200).json({ message: MESSAGES.LOGIN_SUCCESS, user });
        } catch (err:any) {
            res.status(500).json({ error: err.message });
        }
    };
}