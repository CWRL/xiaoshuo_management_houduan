const express=require('express')
const router=express.Router()
const permissions_hander=require('../router_hander/permissions')
router.post('/addpermissions',permissions_hander.addpermissions_hander)
module.exports=router