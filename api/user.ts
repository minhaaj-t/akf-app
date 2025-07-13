import { Client } from 'pg';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).end();

  const { id, username } = req.query;
  if (!id && !username) return res.status(400).json({ success: false, message: 'Missing id or username' });

  const client = new Client({
    host: process.env.SUPABASE_HOST,
    user: process.env.SUPABASE_USER,
    password: process.env.SUPABASE_PASSWORD,
    database: process.env.SUPABASE_DATABASE,
    port: parseInt(process.env.SUPABASE_PORT || '5432'),
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    let result;
    if (id) {
      result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
    } else {
      result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    }
    await client.end();
    const user = result.rows[0];
    if (user) {
      res.status(200).json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
} 