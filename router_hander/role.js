const db=require('../db/index')
const validate=require('../validation')
const joi=require('joi')
const addrole_hander=(req,res)=>{
    const roleschema=joi.object(validate.roleschema)
    const roleschemaresult=roleschema.validate({rolename:req.body.rolename,roledescribe:req.body.roledescribe})
    if(roleschemaresult.error){
        return res.send({
            status:0,
            data:roleschemaresult.error.message
        })
    }
    const mysql='SELECT * FROM role WHERE role.rolename=?'
    db.query(mysql,req.body.rolename,(err,result)=>{
        if(err){
            return res.send({
                status:0,
                data:err.message
            })
        }
        if(result.length===1){
            return res.send({
                status:0,
                data:'已存在该角色'
            })
        }
        const mysql='INSERT INTO role SET ?'
        db.query(mysql,req.body,(err,result)=>{
            if(err){
                return res.send({
                    status:0,
                    data:err.message
                })
            }
            if(result.affectedRows!==1){
                return res.send({
                    status:0,
                    data:'增添失败'
                })
            }
            res.send({
                status:1,
                data:'增添成功'
            })
        })
    })
}
const rolevalue_hander=(req,res)=>{
    const rolevalueschema=joi.object(validate.rolevalue)
    const rolevalueschemaresult=rolevalueschema.validate({CurrentPage:req.query.CurrentPage,pages:req.query.pages})
    if(rolevalueschemaresult.error){
        return res.send({
            status:0,
            data:rolevalueschemaresult.error.message
        })
    }
    const CurrentPage=req.query.CurrentPage
    const pages=req.query.pages
    const mysql='SELECT * FROM role'
    db.query(mysql,(err,result)=>{
        if(err){
            return res.send({
                status:0,
                data:err.message
            })
        }
        if(result.length===0){
            return res.send({
                status:0,
                data:'暂时没有数据'
            })
        }
        res.send({
            status:1,
            data:result.slice((CurrentPage-1)*pages,CurrentPage*pages),
            total:result.length
        })
    })
}
const changestatus_hander=(req,res)=>{
    const mysql='SELECT * FROM role WHERE role.rolename=?'
    db.query(mysql,req.query.rolename,(err,result)=>{
        if(err){
            return res.end({
                status:0,
                data:err.message
            })
        }
        if(result.length===0){
            return res.send({
                status:0,
                data:'不存在该角色'
            })
        }
        const mysql='UPDATE role SET ? WHERE role.rolename=?'
        db.query(mysql,[{status:req.query.status},req.query.rolename],(err,result)=>{
            if(err){
               return res.send({
                    status:0,
                    data:err.message
               })
            }
            if(result.affectedRows!==1){
                return res.send({
                    status:0,
                    data:'更新失败'
                })
            }
            res.send({
                status:1,
                data:'更新成功'
            })
        })
    })
}
const getallroles_hander=(req,res)=>{
    const mysql='SELECT * FROM role WHERE role.status=0'
    db.query(mysql,(err,result)=>{
        if(err){
            return res.send({
                status:0,
                data:err.message
            })
        }
        if(result.length===1){
            return res.send({
                status:0,
                data:'暂时没有数据'
            })
        }
        res.send({
            status:1,
            data:result
        })
    })
}
const updaterule_hander=(req,res)=>{
    const roleschema=joi.object(validate.roleschema)
    const roleschemaresult=roleschema.validate({rolename:req.body.rolename,roledescribe:req.body.roledescribe})
    if(roleschemaresult.error){
        return res.send({
            status:0,
            data:roleschemaresult.error.message
        })
    }
    const mysql='SELECT * FROM role WHERE role.id=?'
    db.query(mysql,req.query.id,(err,result)=>{
        if(err){
            return res.send({
                status:0,
                data:err.message
            })
        }
        if(result.length===0){
            return res.send({
                status:0,
                data:'没有这个角色'
            })
        }
        const mysql='UPDATE role SET ? WHERE role.id=?'
        db.query(mysql,[req.body,req.query.id],(err,result1)=>{
            if(err){
                return res.send({
                    status:0,
                    data:err.message
                })
            }
            if(result1.affectedRows!==1){
                return res.send({
                    status:0,
                    data:'更新失败'
                })
            }
            const mysql='UPDATE user SET user.permissions=? WHERE user.permissions=?'
            db.query(mysql,[req.body.rolename,result[0].rolename])
            res.send({
                status:1,
                data:'更新成功'
            })
        })
    })
}
const delete_hander=(req,res)=>{
    const mysql='DELETE FROM role WHERE role.id=?'
    db.query(mysql,req.query.id,(err,result)=>{
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
    addrole_hander,
    rolevalue_hander,
    changestatus_hander,
    getallroles_hander,
    updaterule_hander,
    delete_hander
}