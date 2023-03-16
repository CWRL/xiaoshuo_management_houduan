const db = require('../db/index')
const updateisready_hander = (req, res) => {
    const mysql = 'SELECT * FROM news WHERE news.id=?'
    db.query(mysql, req.query.id, (err, result) => {
        if (err) {
            return res.send({
                status: 0,
                data: err.message
            })
        }
        if (result.length == 0) {
            return res.send({
                status: 1,
                data: []
            })
        }
        const mysql = 'UPDATE news SET ? WHERE news.id=?'
        db.query(mysql, [{ isready: 1 }, req.query.id], (err, result) => {
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
const deletenews_hander = (req, res) => {
    const mysql = 'SELECT * FROM news WHERE news.id=?'
    db.query(mysql, req.query.id, (err, result) => {
        if (err) {
            return res.send({
                status: 0,
                data: err.message
            })
        }
        if (result.length == 0) {
            return res.send({
                status: 0,
                data: '没有数据'
            })
        }
        const mysql = 'UPDATE news SET ? WHERE news.id=?'
        db.query(mysql, [{ isdelete: 1 }, req.query.id], (err, result) => {
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
const updatecollection_hander = (req, res) => {
    const mysql = 'SELECT * FROM news WHERE news.id=?'
    db.query(mysql, req.query.id, (err, results) => {
        if (err) {
            return res.send({
                status: 0,
                data: err.message
            })
        }
        if (results.length === 0) {
            return res.send({
                status: 0,
                data: '暂时没有这条消息'
            })
        }
        const mysql = 'UPDATE news SET ? WHERE news.id=?'
        db.query(mysql, [{ iscollection: results[0].iscollection === 1 ? 0 : 1 }, req.query.id], (err, result) => {
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
const renew_hander=(req,res)=>{
    const mysql='SELECT * FROM news WHERE news.id=?'
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
                data:'没有这条信息'
            })
        }
        const mysql='UPDATE news SET ? WHERE news.id=?'
        db.query(mysql,[{isdelete:0},req.query.id],(err,result)=>{
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
module.exports = {
    updateisready_hander,
    deletenews_hander,
    updatecollection_hander,
    renew_hander
}