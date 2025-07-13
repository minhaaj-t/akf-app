import { Client } from 'pg';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).end();

  const { date, timeSlot } = req.query;
  if (!date || !timeSlot) return res.status(400).json({ success: false, message: 'Missing date or timeSlot' });

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
    const result = await client.query('SELECT * FROM menus WHERE date = $1 AND (time_slot = $2 OR time_slot = $3) ORDER BY created_at DESC', [date, timeSlot, 'both']);
    await client.end();
    res.status(200).json({ success: true, menus: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
} 