import { Client } from 'pg';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username } = req.body;
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
    const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    await client.end();
    const user = result.rows[0];
    if (user && user.status === 'approved') {
      res.status(200).json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials or not approved' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
} 