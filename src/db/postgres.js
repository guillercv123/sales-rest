import '../config/env.js';
import postgres from 'postgres';

const sql = postgres(process.env.SUPABASE_URL);
export default sql;