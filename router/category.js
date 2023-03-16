const express=require('express')
const router=express.Router()
const category_hander=require('../router_hander/category')
router.get('/category',category_hander.category_hander)
module.exports=router