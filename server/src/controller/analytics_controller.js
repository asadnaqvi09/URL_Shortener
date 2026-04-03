import { getAnalyticsByShortURL,getClicksByDevice,getRecentClicks,getDailyClicks } from '../models/analytics_model.js'

export const getAnalyticsController=async(req,res)=>{
  try{
    const {short_url}=req.params

    const analytics=await getAnalyticsByShortURL(short_url)
    if(!analytics) return res.status(404).json({success:false,message:'Short URL not found'})

    const devices=await getClicksByDevice(short_url)
    const recentClicks=await getRecentClicks(short_url)
    const dailyClicks=await getDailyClicks(short_url)

    return res.status(200).json({
      success:true,
      data:{
        ...analytics,
        total_clicks:Number(analytics.total_clicks),
        unique_clicks:Number(analytics.unique_clicks),
        devices,
        dailyClicks,
        recentClicks
      }
    })
  }catch(error){
    console.error(error)
    return res.status(500).json({success:false,message:'Internal Server Error'})
  }
}