const db = require('../db/index')
const allbooks_hander = (req, res) => {
    if (req.query.novalname) {
        const mysql='SELECT * FROM noval WHERE noval.novalname=?'
        db.query(mysql,req.query.novalname,(err,result)=>{
            if(err){
                return res.send({
                    status:0,
                    data:err.message
                })
            }
            if(result.length===0){
                return res.send({
                    status:1,
                    data:[]
                })
            }
            res.send({
                status:1,
                data:result
            })
        })
    }
    else {
        const mysql = 'SELECT * FROM noval'
        db.query(mysql, (err, result) => {
            if (err) {
                return res.send({
                    status: 0,
                    data: err.message
                })
            }
            if (result.length === 0) {
                return res.send({
                    status: 1,
                    data: []
                })
            }
            res.send({
                status: 1,
                data: result
            })
        })
    }
}
const changestatus_hander = (req, res) => {
    const mysql = 'SELECT * FROM noval WHERE noval.id=?'
    db.query(mysql, req.query.id, (err, result) => {
        if (err) {
            return res.send({
                status: 0,
                data: err.message
            })
        }
        if (result.length === 0) {
            return res.send({
                status: 0,
                data: '没有这本小说'
            })
        }
        const mysql = 'UPDATE noval SET ? WHERE noval.id=?'
        db.query(mysql, [{ isunder: req.query.isunder }, req.query.id], (err, result) => {
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
            res.send({
                status: 1,
                data: '更新成功'
            })
        })
    })
}
const changeaudit_hander = (req, res) => {
    const mysql = 'SELECT * FROM novalcapters WHERE novalcapters.id=?'
    db.query(mysql, req.query.id, (err, result) => {
        if (err) {
            return res.send({
                status: 0,
                data: err.message
            })
        }
        if (result.length === 0) {
            return res.send({
                status: 0,
                data: '没有这一章节'
            })
        }
        const mysql = 'UPDATE novalcapters SET ? WHERE novalcapters.id=?'
        db.query(mysql, [{ audit: req.query.audit }, req.query.id], (err, result) => {
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
            res.send({
                status: 1,
                data: '更新成功'
            })
        })
    })
}
module.exports = {
    allbooks_hander,
    changestatus_hander,
    changeaudit_hander
}