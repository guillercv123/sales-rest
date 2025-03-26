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


export const getUserByName = async (name: string): Promise<User[]> => {
    return sql`SELECT *
               FROM sales_bd."user"
               WHERE name=${name}`;
};