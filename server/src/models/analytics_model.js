import pool from "../config/db.js"

export const getAnalyticsByShortURL=async(short_url)=>{
  const result=await pool.query(`
    SELECT
      u.short_url,
      COUNT(c.id) AS total_clicks,
      COUNT(DISTINCT c.ip_address) AS unique_clicks,
      MAX(c.clicked_at) AS last_clicked
    FROM urls u
    LEFT JOIN clicks c ON u.id=c.url_id
    WHERE u.short_url=$1
    GROUP BY u.id
  `,[short_url])

  return result.rows[0]||null
}

export const getClicksByDevice=async(short_url)=>{
  const result=await pool.query(`
    SELECT c.device,COUNT(*) AS count
    FROM clicks c
    JOIN urls u ON u.id=c.url_id
    WHERE u.short_url=$1
    GROUP BY c.device
  `,[short_url])
  return result.rows
}

export const getRecentClicks=async(short_url)=>{
  const result=await pool.query(`
    SELECT c.ip_address,c.device,c.clicked_at
    FROM clicks c
    JOIN urls u ON u.id=c.url_id
    WHERE u.short_url=$1
    ORDER BY c.clicked_at DESC
    LIMIT 5
  `,[short_url])
  return result.rows
}

// Suggested tweak for getDailyClicks
export const getDailyClicks = async (short_url) => {
  const result = await pool.query(`
    SELECT 
      TO_CHAR(c.clicked_at, 'YYYY-MM-DD') AS date, 
      COUNT(*) AS clicks
    FROM clicks c
    JOIN urls u ON u.id = c.url_id
    WHERE u.short_url = $1
    GROUP BY date
    ORDER BY date ASC
    LIMIT 7; -- Typically you only want the last 7 days for a chart
  `, [short_url]);
  return result.rows;
}