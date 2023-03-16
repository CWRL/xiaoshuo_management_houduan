const db=require('../db')
const employees=require('../validation')
const joi=require('joi')
const employees_hander=(req,res)=>{
    const employeesschema=joi.object(employees.employees)
    const employeesschemaresult=employeesschema.validate({CurrentPage:req.query.CurrentPage,pages:req.query.pages})
    if(employeesschemaresult.error){
        return res.send(employeesschemaresult.error.message)
    }
    const CurrentPage=req.query.CurrentPage
    const pages=req.query.pages
    const mysql='SELECT * FROM user'
    db.query(mysql,(err,result)=>{
        if(err){
            return res.end({
                status:0,
                data:err.message
            })
        }
        if(result.length===0){
            return res.send({
                status:0,
                data:'暂时没有员工'
            })
        }
        res.send({
            status:1,
            data:result.slice((CurrentPage-1)*pages,CurrentPage*pages),
            total:result.length
        })
    })
}
const deleteemployee_hander=(req,res)=>{
    const mysql='DELETE FROM  user WHERE user.username=?'
    db.query(mysql,req.query.username,(err,result)=>{
        if(err){
            return res.send({
                status:0,
                data:err.message
            })
        }
        if(result.affectedRows!==1){
            return res.send({
                status:0,
                data:'删除失败'
            })
        }
        res.send({
            status:1,
            data:'删除成功'
        })
    })
}
module.exports={
    employees_hander,
    deleteemployee_hander
}