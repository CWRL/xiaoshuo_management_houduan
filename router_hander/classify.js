const db = require('../db/index')
const validate = require('../validation')
const joi = require('joi')
const addclassify_hander = (req, res) => {
    const addclassifyvalidate = joi.object(validate.addclassify)
    const addclassifyvalidate_result = addclassifyvalidate.validate({ classifyname: req.body.classifyname })
    if (addclassifyvalidate_result.error) {
        return res.send({
            status: 0,
            data: addclassifyvalidate_result.error.message
        })
    }
    const mysql = 'SELECT * FROM classify WHERE classify.classifyname=?'
    db.query(mysql, req.body.classifyname, (err, result) => {
        if (err) {
            return res.send({
                status: 0,
                data: err.message
            })
        }
        if (result.length == 1) {
            return res.send({
                status: 0,
                data: '有这个分类了'
            })
        }
        const data = {
            classifyname: req.body.classifyname,
            isdelete: 0,
            Recommended: "[]",
            limitfree: "[]"
        }
        const mysql = 'INSERT INTO classify SET ?'
        db.query(mysql, data, (err, result) => {
            if (err) {
                return res.send({
                    status: 0,
                    data: err.message
                })
            }
            if (result.affectedRows !== 1) {
                return res.send({
                    status: 0,
                    data: '添加失败'
                })
            }
            res.send({
                status: 1,
                data: '添加成功'
            })
        })

    })
}
const getclassify_hander = (req, res) => {
    const mysql = 'SELECT * FROM classify'
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
const deleteclassify_hander = (req, res) => {
    const mysql = 'SELECT * FROM classify WHERE classify.id=?'
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
                data: '没有这个分类'
            })
        }
        const mysql = 'DELETE FROM classify  WHERE classify.id=?'
        db.query(mysql, [req.query.id], (err, result) => {
            if (err) {
                return res.send({
                    status: 0,
                    data: err.message
                })
            }
            if (result.affectedRows !== 1) {
                return res.send({
                    status: 0,
                    data: '删除失败'
                })
            }
            res.send({
                status: 1,
                data: '删除成功'
            })
        })
    })
}
const getRecommended_hander = (req, res) => {
    const mysql = 'SELECT Recommended FROM classify WHERE classify.classifyname=?'
    db.query(mysql, req.query.classifyname, (err, result) => {
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
        let data = JSON.parse(result[0].Recommended)
        data.push(-1)
        const mysql = 'SELECT * FROM noval WHERE noval.id IN (?)'
        db.query(mysql,[data], (err, result) => {
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
    })
}
const allclassifynovals_hander = (req, res) => {
    const mysql = 'SELECT * FROM noval WHERE noval.isunder=1'
    db.query(mysql, (err, result) => {
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
        res.send({
            status: 1,
            data: result
        })
    })
}
const updateRecommended_hander = (req, res) => {
    const mysql = 'SELECT * FROM classify WHERE classify.classifyname=?'
    db.query(mysql, req.query.classifyname, (err, result) => {
        if (err) {
            return res.send({
                status: 0,
                data: err.message
            })
        }
        if (result.length === 0) {
            return res.send({
                status: 0,
                data: '这个分类被删除了'
            })
        }
        const mysql = 'UPDATE classify SET ? WHERE classify.classifyname=?'
        db.query(mysql, [{ Recommended: req.query.Recommended }, req.query.classifyname], (err, result) => {
            if (err) {
                return res.send({
                    status: 0,
                    data: err.message
                })
            }
            if (result.affectedRows !== 1) {
                return res.send({
                    status: 0,
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
const underclassify_hander=(req,res)=>{
    const mysql='SELECT * FROM classify WHERE classify.id=?'
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
                data:'没有这个分类'
            })
        }
        const mysql='UPDATE classify SET ? WHERE classify.id=?'
        db.query(mysql,[{isdelete:req.query.isdelete},req.query.id],(err,result)=>{
            if(err){
               return res.send({
                    status:0,
                    data:err.message
                })
            }
            if(result.affectedRows!==1){
              return  res.send({
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
const updateclassifyname_hander=(req,res)=>{
    const mysql='SELECT * FROM classify WHERE classify.id=?'
    db.query(mysql,req.query.id,(err,result)=>{
        if(err){
          return  res.send({
                status:0,
                data:err.message
            })
        }
        if(result.length===0){
           return res.send({
                status:0,
                data:'没有这个类别'
            })
        }
        const mysql='UPDATE classify SET ? WHERE classify.id=?'
        db.query(mysql,[{classifyname:req.query.classifyname},req.query.id],(err,result)=>{
            if(err){
              return  res.send({
                    status:0,
                    data:err.message
                })
            }
            if(result.affectedRows!==1){
              return  res.send({
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
    addclassify_hander,
    getclassify_hander,
    deleteclassify_hander,
    getRecommended_hander,
    allclassifynovals_hander,
    updateRecommended_hander,
    underclassify_hander,
    updateclassifyname_hander
}