import nodemailer from "nodemailer";
import '../config/env';

export const sendEmailWithCode = async (to: string, code: string) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        },
    });

    await transporter.sendMail({
        from: `"Soporte sistema de venta" <${process.env.MAIL_USER}>`,
        to,
        subject: "Código de recuperación de contraseña",
        text: `Tu código de verificación es: ${code}`,
        html: `<p>Tu código de verificación es: <b>${code}</b></p>`,
    });
};
