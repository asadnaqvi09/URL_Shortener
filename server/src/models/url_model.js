import pool from '../config/db.js'

export const fetchAllUrls = async ()=> {
  const result = await pool.query(
    `SELECT * FROM urls ORDER BY created_at DESC`
  )
  return result.rows
}
export const getURLbyShortURL = async (short_url) => {
  const result = await pool.query(
    'SELECT * FROM urls WHERE short_url=$1',
    [short_url]
  )
  return result.rows[0]
}

export const createUrlModel = async ({ original_url, short_url, qr_code = null }) => {
  const result = await pool.query(
    'INSERT INTO urls (original_url, short_url, qr_code) VALUES ($1,$2,$3) RETURNING *',
    [original_url, short_url, qr_code]
  )
  return result.rows[0]
}

export const deteleURLModel = async (short_url)=> {
  const result = await pool.query(
    `DELETE FROM urls WHERE short_url = $1 RETURNING * `,
    [short_url]
  )
  return result.rows[0]
}