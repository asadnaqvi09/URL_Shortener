import pool from '../config/db.js';

export const logClick = async ({url_id,ip_address,device,user_agent})=> {
    const result = await pool.query(
        `INSERT INTO clicks (url_id,ip_address,device,user_agent) VALUES ($1,$2,$3,$4) RETURNING *`
        , [url_id,ip_address,device,user_agent]
    )
    return result.rows[0];
}