const multer=require('multer')
const path=require('path')
const express=require('express')
const upload_hander=require('../router_hander/upload')
const router=express.Router()
router.post('/upload',multer({dest:path.join(__dirname,'..','upload')}).single('avator'),upload_hander.upload_hander)
router.post('/uploaddocx',multer({dest:path.join(__dirname,'..','noval')}).single('noval'),upload_hander.uploaddocx_hander)
router.get('/download',upload_hander.download_hander)
router.get('/downloaddocx',upload_hander.downloaddocx_hander)
module.exports=router