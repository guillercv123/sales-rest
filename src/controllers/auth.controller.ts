import {sendEmailWithCode} from "../services/mail.service";
import {storeCode, validateCode} from "../utils/codeStorage";
import {getUserByEmail} from "../services/user.service";

export const sendResetCode =  async (req:any, res:any) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "El email es requerido" });
    }
    const existingEmail = await getUserByEmail(email);
    if (!existingEmail || existingEmail.length === 0) {
        return res.status(400).json({ error: "El correo electrónico ingresado no está registrado." });
    }

    try{
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        await sendEmailWithCode(email, code);
        storeCode(email, code);
        res.json({ message: "Código enviado al correo" });
    }catch (err:any) {
        res.status(500).json({ error: err.message });
    }
}

export const validateResetCode = async (req:any, res:any) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ error: "Email y código son requeridos" });
    }

    const isValid = validateCode(email, code);

    if (!isValid) {
        return res.status(400).json({ error: "Código incorrecto o expirado" });
    }

    res.json({ message: "Código validado correctamente" });
};