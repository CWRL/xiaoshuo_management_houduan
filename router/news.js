const express=require('express')
const news_hander=require('../router_hander/news')
const router=express.Router()
router.get('/updateisready',news_hander.updateisready_hander)
router.get('/deletenews',news_hander.deletenews_hander)
router.get('/updatecollection',news_hander.updatecollection_hander)
router.get('/renew',news_hander.renew_hander)
module.exports=router