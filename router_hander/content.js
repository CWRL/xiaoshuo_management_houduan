const noval_hander = require('../anoval_hander')
const path = require('path')
const fs = require('fs')
const db = require('../db')
const joi = require('joi')
const validate = require('../validation')
const time_hander = require('../time')
const addnovalcapters_hander = (req, res) => {
    const addcaptersschema = joi.object(validate.addcaptersschema)
    const addcaptersschemaresult = addcaptersschema.validate({ novalname: req.body.novalname, capters: req.body.capters, captersname: req.body.captersname, onlineaddress: req.body.onlineaddress })
    if (addcaptersschemaresult.error) {
        return res.send({
            status: 0,
            data: addcaptersschemaresult.error.message
        })
    }
    const mysql = 'UPDATE noval SET ? WHERE noval.novalname=?'
    db.query(mysql, [{ date: time_hander(new Date().getTime()) }, req.body.novalname])
    noval_hander(req.body.localaddress, (value) => {
        let m = ''
        value.forEach(element => {
            m += '<p>&nbsp; &nbsp;&nbsp;' + element + '</P>'
        });
        if (req.body.id) {
            const mysql = 'SELECT * FROM novalcapters WHERE novalcapters.id=?'
            db.query(mysql, req.body.id, (err, result) => {
                if (err) {
                    return res.send({
                        status: 0,
                        data: err.message
                    })
                }
                if (result.length === 0) {
                    return res.send({
                        status: 0,
                        data: "没有这个章节"
                    })
                }
                const data = {
                    novalname: req.body.novalname,
                    username: req.user.username,
                    capters: req.body.capters,
                    captersname: req.body.captersname,
                    audit: '待审核',
                    content: m,
                    docxpath: req.body.onlineaddress,
                    localaddress: req.body.localaddress
                }
                const mysql = 'UPDATE novalcapters SET ? WHERE novalcapters.id=?'
                db.query(mysql, [data, req.body.id], (err, result) => {
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
        else {
            const data = {
                novalname: req.body.novalname,
                username: req.user.username,
                capters: req.body.capters,
                captersname: req.body.captersname,
                audit: '待审核',
                content: m,
                docxpath: req.body.onlineaddress,
                localaddress: req.body.localaddress
            }
            const mysql = 'INSERT INTO novalcapters SET ?'
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
        }
    })
}
const addnoval_hander = (req, res) => {
    const novalschema = joi.object(validate.addnovalschema)
    const novalschemaresult = novalschema.validate({ novalname: req.body.novalname, classify: req.body.classify, status: req.body.status, abstarct: req.body.abstarct, avator: req.body.avator })
    if (novalschemaresult.error) {
        return res.send({
            status: 0,
            data: novalschemaresult.error.message
        })
    }
    const mysql = 'SELECT * FROM noval WHERE noval.novalname=?'
    db.query(mysql, req.body.novalname, (err, result) => {
        if (err) {
            return res.send({
                status: 0,
                data: err.message
            })
        }
        if (result.length === 1) {
            return res.send({
                status: 0,
                data: '已经有这本小说了'
            })
        }
        const data = {
            username: req.user.username,
            novalname: req.body.novalname,
            classify: req.body.classify,
            date: time_hander(new Date().getTime()),
            status: req.body.status,
            isunder: 0,
            reading: 0,
            abstarct: req.body.abstarct,
            isvip: req.body.isvip,
            avator: req.body.avator
        }
        if (req.body.isvip == 1) {
            data.noviplinite = req.body.noviplinite
        }
        const mysql = 'INSERT INTO noval SET ?'
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
const getnovals_hander = (req, res) => {
    const CurrentPage = req.query.CurrentPage
    const pages = req.query.pages
    if (!req.query.novalname) {
        const mysql = 'SELECT * FROM noval WHERE noval.username=?'
        db.query(mysql, req.user.username, (err, result) => {
            if (err) {
                return res.send({
                    status: 0,
                    data: err.message
                })
            }
            if (result.length === 0) {
                return res.send({
                    status: 0,
                    data: '你暂时还没发表过小说'
                })
            }
            res.send({
                status: 1,
                data: result.slice((CurrentPage - 1) * pages, CurrentPage * pages),
                total: result.length
            })
        })
    }
    else {
        const mysql = 'SELECT * FROM noval WHERE noval.novalname=?'
        db.query(mysql, req.query.novalname, (err, result) => {
            if (err) {
                return res.send({
                    status: 0,
                    data: err, message
                })
            }
            res.send({
                status: 1,
                data: result,
                total: 1
            })
        })
    }
}
const updatenoval_hander = (req, res) => {
    const novalschema = joi.object(validate.addnovalschema)
    const novalschemaresult = novalschema.validate({ novalname: req.body.novalname, classify: req.body.classify, status: req.body.status, abstarct: req.body.abstarct, avator: req.body.avator })
    if (novalschemaresult.error) {
        return res.send({
            status: 0,
            data: novalschemaresult.error.message
        })
    }
    const mysql = 'SELECT * FROM noval WHERE noval.id=?'
    db.query(mysql, req.body.id, (err, result) => {
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
        console.log(req.body)
        console.log(result)
        db.query(mysql, [req.body, req.body.id], (err, result1) => {
            if (err) {
                return res.send({
                    status: 0,
                    data: err.message
                })
            }
            if (result1.affectedRows !== 1) {
                return res.send({
                    status: 0,
                    data: '更新失败'
                })
            }
            const mysql='UPDATE novalcapters SET ? WHERE novalcapters.novalname=?'
            db.query(mysql,[{novalname:req.body.novalname},result[0].novalname])
            res.send({
                status: 1,
                data: '更新成功'
            })
        })
    })
}
const getcapters_hander = (req, res) => {
    const mysql = 'SELECT * FROM novalcapters WHERE novalcapters.novalname=?'
    db.query(mysql, req.query.novalname, (err, result) => {
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
        const data = result.map((value) => {
            return {
                id: value.id,
                novalname: value.novalname,
                username: value.username,
                capters: value.capters,
                captersname: value.captersname,
                docxpath: value.docxpath,
                localaddress: value.localaddress,
                audit: value.audit
            }
        })
        res.send({
            status: 1,
            data: data
        })
    })
}
const getsomecapters_hander = (req, res) => {
    const mysql = 'SELECT * FROM novalcapters'
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
        const data = result.map((value) => {
            return {
                id: value.id,
                novalname: value.novalname,
                username: value.username,
                capters: value.capters,
                captersname: value.captersname,
                docxpath: value.docxpath,
                localaddress: value.localaddress,
                audit: value.audit
            }
        })
        res.send({
            status: 1,
            data: data
        })
    })
}
module.exports = {
    addnovalcapters_hander,
    addnoval_hander,
    getnovals_hander,
    updatenoval_hander,
    getcapters_hander,
    getsomecapters_hander
}