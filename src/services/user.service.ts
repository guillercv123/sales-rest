import {User} from "../types/user.interface";
import connection from "../db/mysql";

export const getAllUsers = async (): Promise<User[]> => {
    const [rows] = await (await connection).execute('SELECT * FROM user');
    return rows as User[];
};

export const insertUser = async (
    name: string,
    password: string,
    email: string
): Promise<User[]> => {
    const [rows] = await (await connection).execute(
        'INSERT INTO user (name, password_user, email_user) VALUES (?, ?, ?);',
        [name, password, email]
    );
    return rows as User[];
};

export const updatePasswordUserByEmail = async (
    email: string,
    password: string
): Promise<User[]> => {
    const [rows] = await (await connection).execute(
        'UPDATE user SET password_user = ? WHERE email_user = ?;',
        [password, email]
    );
    return rows as User[];
};

export const getUserByEmail = async (email: string): Promise<User[]> => {
    const [rows] = await (await connection).execute(
        'SELECT * FROM user WHERE email_user = ?',
        [email]
    );
    return rows as User[];
};

export const getUserByName = async (name: string): Promise<User[]> => {
    const [rows] = await (await connection).execute(
        'SELECT * FROM user WHERE name = ?',
        [name]
    );
    return rows as User[];
};