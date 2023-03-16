const express=require('express')
const book_hander=require('../router_hander/book')
const router=express.Router()
router.get('/allbooks',book_hander.allbooks_hander)
router.get('/changestatus',book_hander.changestatus_hander)
router.get('/changeaudit',book_hander.changeaudit_hander)
module.exports=router