import redisLog from "../config/redis.js"
import { getURLbyShortURL } from '../models/url_model.js'
import { logClick } from '../models/click_model.js';
import * as UAParser from 'ua-parser-js';

export const handleRedirect = async (req, res) => {
  try {
    const { short_url } = req.params;
    // 1. Cache Logic (Keep this, it's great)
    let cached = await redisLog.get(`url:${short_url}`);
    let urlData = cached ? JSON.parse(cached) : await getURLbyShortURL(short_url);
    if (!urlData) {
      // Return a Page, not JSON
      return res.status(404).render('404', { message: 'Link not found' });
    }
    if (!cached) {
      await redisLog.set(`url:${short_url}`, JSON.stringify(urlData), 'EX', 3600);
    }
    // 2. Analytics (Background task - No 'await')
    const ua = new UAParser.UAParser(req.headers['user-agent']).getResult();
    logClick({
      url_id: urlData.id,
      ip_address: req.ip,
      device: ua.device.type || 'desktop',
      user_agent: req.headers['user-agent']
    }).catch(err => console.error("Analytics Log Error:", err));
    // 3. Fast Redirect
    return res.redirect(urlData.original_url);
  } catch (error) {
    console.error("Redirect System Error:", error);
    return res.status(500).render('500'); 
  }
};