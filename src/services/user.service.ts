// @ts-ignore
import sql from '../db/postgres';
import {User} from "../types/user.interface";

export const getAllUsers = async () => {
    return sql`SELECT *
               FROM sales_bd."user"`;
};

export const insertUser = async (
    name: string,
    password: string,
    email: string
): Promise<User[]> => {
    return sql<User[]>`
        INSERT INTO sales_bd."user" (name, password_user, email_user)
        VALUES (${name}, ${password}, ${email})
            RETURNING *;
    `;
};

export const updatePasswordUserByEmail = async (
    email: string,
    password: string
): Promise<User[]> => {
    return sql<User[]>`
        UPDATE sales_bd."user"
        SET password_user = ${password}
        WHERE email_user = ${email}
            RETURNING *;
    `;
};

export const getUserByEmail = async (email:string): Promise<User[]> => {
    return sql`SELECT *
               FROM sales_bd."user"
               WHERE email_user=${email}`;
}

export const getUserByName = async (name: string): Promise<User[]> => {
    return sql`SELECT *
               FROM sales_bd."user"
               WHERE name=${name}`;
};