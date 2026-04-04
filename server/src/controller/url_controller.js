import { getURLbyShortURL, createUrlModel, deteleURLModel, fetchAllUrls } from '../models/url_model.js'
import { logClick } from '../models/click_model.js'
import { generateShortCode } from '../utils/generateShortUrl.js'
import * as UAParser from 'ua-parser-js'
import redis from '../config/redis.js'
import QrCode from 'qrcode'
import pool from '../config/db.js'

export const getAllURLController = async (req,res)=> {
  try {
    const fetchUrls = await fetchAllUrls();
    return res.status(200).json({
      success: true,
      message: 'All Urls Fetched Successfully',
      data: fetchUrls
    })
  } catch (error) {
    console.error('Error in getAllURLController : ', error)
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching all URLs'
    })
  }
}
export const createURLController = async (req,res)=>{
  try{
    const { original_url } = req.body
    let short_url = generateShortCode()
    const urlFound = await getURLbyShortURL(short_url)
    if(urlFound){
      return res.status(409).json({ success:false,message:'OOPS! Short URL collision, try again' })
    }
    const newUrl = await createUrlModel({ original_url,short_url })
    return res.status(201).json({ success:true,message:'Your Short URL created successfully',data:newUrl })
  }catch(error){
    console.error('Error in creating short URL:',error)
    return res.status(500).json({ success:false,message:'Something went wrong while creating your short URL' })
  }
}

export const getURLController = async (req,res)=>{
  try{
    const { short_url } = req.params
    const url = await getURLbyShortURL(short_url)
    if(!url){
      return res.status(404).json({ success:false,message:'Short URL Not Found!' })
    }
    return res.status(200).json({ success:true,message:'Short URL Retrieved Successfully',data:url })
  }catch(error){
    console.error('Error in retrieving short URL:',error)
    return res.status(500).json({ success:false,message:'Something went wrong while retrieving the short URL' })
  }
}

export const redirectController = async (req,res)=>{
  try{
    const { short_url } = req.params
    let cached=await redis.get(`url:${short_url}`)
    let urlData
    if(cached){
      urlData=JSON.parse(cached)
    }else{
      urlData=await getURLbyShortURL(short_url)
      if(!urlData) return res.status(404).json({ success:false,message:'Short URL not found' })
      await redis.set(`url:${short_url}`,JSON.stringify(urlData),'EX',3600)
    }
    const ua=new UAParser.UAParser(req.headers['user-agent']).getResult()
    await logClick({
      url_id:urlData.id,
      ip_address:req.ip,
      device:ua.device.type||'desktop',
      user_agent:req.headers['user-agent']
    })
    return res.redirect(urlData.original_url)
  }catch(error){
    console.error(error)
    return res.status(500).json({ success:false,message:'Internal server error' })
  }
}

export const getQRCodeController = async (req,res)=> {
  try {
    const {short_url} = req.params
    const url = await getURLbyShortURL(short_url)
    if(!url){
      return res.status(404).json({
        success: false,
        message: 'Short URL Not Found!'
      })
    }
    const qr = await QrCode.toDataURL(`${process.env.BASE_URL}/${short_url}`)
    await pool.query('UPDATE urls SET qr_code = $1 WHERE id = $2', [qr, url.id])
    return res.status(200).json({
      success: true,
      qr_code: qr
    })
  } catch (error) {
    console.error('Error in getQRCodeController : ', error)
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while generating QR code'
    })
  }
}

export const deleteURLController = async (req,res)=> {
  try {
    const { short_url } = req.params
    const result = await deteleURLModel(short_url)
    if(!result) {
      return res.status(404).json({
        success: false,
        message: 'Short URL Not Found !'
      })
    }
    await redis.del(`url:${short_url}`)
    return res.status(200).json({
      success: true,
      message: 'Short URL deleted successfully'
    })
  } catch (error) {
    console.error('Error in deleteURLController : ', error)
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while deleting the short URL'
    })
  }
}