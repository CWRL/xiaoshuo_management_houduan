const express=require('express')
const router=express.Router()
const main_hander=require('../router_hander/main')
router.get('/allemployees',main_hander.allemployees_hander)
router.get('/allnovals',main_hander.allnovals_hander)
router.get('/weekcount',main_hander.weekcount_hander)
router.get('/fivebookscount',main_hander.fivecount_hander)
module.exports=router