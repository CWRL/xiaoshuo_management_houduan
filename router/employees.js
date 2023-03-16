const express=require('express')
const employees_hander=require('../router_hander/employees')
const router=express.Router()
router.get('/employees',employees_hander.employees_hander)
router.get('/delete',employees_hander.deleteemployee_hander)
module.exports=router