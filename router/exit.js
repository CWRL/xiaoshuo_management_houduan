const express=require('express')
const userexit=require('../router_hander/exit')
const router=express.Router()
router.get('/userexit',userexit.exit_hander)
module.exports=router