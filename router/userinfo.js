const express=require('express')
const router=express.Router()
const userinfo_hander=require('../router_hander/userinfo')
router.get('/userinfo',userinfo_hander.userinfo_hander)
router.post('/edit',userinfo_hander.edit_hander)
router.get('/search',userinfo_hander.search_hander)
module.exports=router