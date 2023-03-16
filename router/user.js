const user_hander=require('../router_hander/user')
const express=require('express')
const router=express.Router()
router.post('/reguser',user_hander.reguser_hander)
router.post('/login',user_hander.login_hander)
module.exports=router