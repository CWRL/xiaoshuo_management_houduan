const db = require('../db/index')
const validate = require('../validation')
const joi = require('joi')
const bcrypt = require('bcrypt')
const userinfo_hander = (req, res) => {
    const mysql = 'SELECT * FROM user WHERE user.username=?'
    db.query(mysql, [req.user.username], (err, result) => {
        if (err) {
            return res.send({
                status: 0,
                data: err.message
            })
        }
        if (result.length === 0) {
            return res.send({
                status: 0,
                data: '不存在该用户'
            })
        }
        res.send({
            status: 1,
            data: {
                username: result[0].username,
                permissions: result[0].permissions,
                avator: result[0].avator
            }
        })
    })
}
const edit_hander = (req, res) => {
    const reguserinfo = req.body
    if (reguserinfo.password) {
        const editschema = joi.object(validate.searchemployee)
        const editschemaresult = editschema.validate({ username: reguserinfo.username, password: reguserinfo.password, email: reguserinfo.email, permissions: reguserinfo.permissions })
        if (editschemaresult.error) {
            return res.send({
                status: 0,
                data: editschemaresult.error.message
            })
        }
    }
    else {
        const editschema = joi.object(validate.searchemployee1)
        const editschemaresult = editschema.validate({ username: reguserinfo.username, email: reguserinfo.email, permissions: reguserinfo.permissions })
        if (editschemaresult.error) {
            return res.send({
                status: 0,
                data: editschemaresult.error.message
            })
        }
    }
    const mysql = 'SELECT * FROM user WHERE user.username=?'
    db.query(mysql, req.query.username, (err, result) => {
        if (err) {
            return res.send({
                status: 0,
                data: err.message
            })
        }
        if (result.length === 0) {
            return res.send({
                status: 0,
                data: '没有这个员工'
            })
        }
        if (reguserinfo.password) {
            reguserinfo.password = bcrypt.hashSync(reguserinfo.password, 10)
        }
        else{
            reguserinfo.password=result[0].password
        }
        const mysql = 'UPDATE user SET ? WHERE user.username=?'
        console.log(reguserinfo)
        db.query(mysql, [reguserinfo, req.query.username], (err, result) => {
            if (err) {
                return res.send({
                    status: 0,
                    data: err.message
                })
            }
            if (result.affectedRows !== 1) {
                return res.send({
                    status: 0,
                    data: '更新失败'
                })
            }
            const mysql='UPDATE noval,novalcapters,news SET noval.username=?,novalcapters.username=?,news.username=? WHERE noval.username=? AND novalcapters.username=? AND news.username=?'
            db.query(mysql,[reguserinfo.username,reguserinfo.username,reguserinfo.username,req.query.username,req.query.username,req.query.username])
            res.send({
                status: 1,
                data: '更新成功'
            })
        })
    })
}
const search_hander=(req,res)=>{
    const searchschema=joi.object(validate.searchschema)
    const searchschemaresult=searchschema.validate({username:req.query.username})
    if(searchschemaresult.error){
        return res.send({
            status:0,
            data:searchschemaresult.error.message
        })
    }
    const mysql='SELECT * FROM user WHERE user.username=?'
    db.query(mysql,req.query.username,(err,result)=>{
        if(err){
            return res.send({
                status:0,
                data:err.message
            })
        }
        if(result.length===0){
            return res.send({
                status:0,
                data:'没有这位员工'
            })
        }
        res.send({
            status:1,
            data:result
        })
    })
}
module.exports = {
    userinfo_hander,
    edit_hander,
    search_hander
}