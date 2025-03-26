import sql from '../db/postgres.js';

export const getAllUsers = async () => {
    return sql`SELECT *
               FROM sales_bd."user"`;
};

export const insertUser = async (name, password, email) => {
    return sql`
        INSERT INTO sales_bd."user" (name, password_user, email_user)
        VALUES (${name},${password},${email}) RETURNING *;
    `;
};
