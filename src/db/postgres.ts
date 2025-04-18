import '../config/env';
import postgres from 'postgres';

const sql = postgres(process.env.SUPABASE_URL!, {
    ssl:  {
        rejectUnauthorized: false
    },
});

export default sql;