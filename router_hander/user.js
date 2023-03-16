const joi = require('joi')
const bcrypt = require('bcrypt')
const userValidation = require('../validation')
const db = require('../db/index')
const jsonwebtoken = require('jsonwebtoken')
const config = require('../config')
const time=require('../time')
const reguser_hander = (req, res) => {
    const reguserinfo = req.body
    const reguserschema = joi.object(userValidation.reguser)
    const reguser = reguserschema.validate({ username: reguserinfo.username, password: reguserinfo.password, email: reguserinfo.email, permissions: reguserinfo.permissions })
    if (reguser.error) {
        return res.send({
            status: 0,
            data: reguser.error.message
        })
    }
    const mysql = 'SELECT * FROM user WHERE  user.username=? OR user.email=?'
    db.query(mysql, [reguserinfo.username, reguserinfo.email], (err, result) => {
        if (err) {
            return res.send({
                status: 0,
                data: err.message
            })
        }
        if (result.length === 2) {
            return res.send({
                status: 0,
                data: '用户名，邮箱已经存在了'
            })
        }
        if (result.length === 1 && result[0].username === reguserinfo.username && result[0].email === reguserinfo.email) {
            return res.send({
                status: 0,
                data: '用户名，邮箱已经存在了'
            })
        }
        if (result.length === 1 && result[0].username === reguserinfo.username) {
            return res.send({
                status: 0,
                data: '用户名已经存在了'
            })
        }
        if (result.length === 1 && result[0].email === reguserinfo.email) {
            return res.send({
                status: 0,
                data: '邮箱已经存在了'
            })
        }
        const mysql = 'INSERT INTO user SET ?'
        const password = bcrypt.hashSync(reguserinfo.password, 10)
        reguserinfo.password = password
        reguserinfo.entryTime=time(new Date().getTime())
        db.query(mysql, reguserinfo, (err, result) => {
            if (err) {
                return res.send({
                    status: 0,
                    data: err.message
                })
            }
            if (result.affectedRows !== 1) {
                return res.send({
                    status: 0,
                    data: '注册失败'
                })
            }
            res.send({
                status: 1,
                data: '注册成功'
            })
        })
    })
}
const login_hander = (req, res) => {
    const userinfo = req.body
    const loginuser = joi.object(userValidation.loginuser)
    const loginuser_schema = loginuser.validate({ username: userinfo.username, password: userinfo.password })
    if (loginuser_schema.error) {
        return res.send({
            status: 0,
            data: loginuser_schema.error.message
        })
    }
    const mysql = 'SELECT password,permissions FROM user WHERE user.username=?'
    db.query(mysql, userinfo.username, (err, result) => {
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
        const password = bcrypt.compareSync(userinfo.password, result[0].password)
        const userinfosign = { username: userinfo.username, permissions: result[0].permissions }
        const overtime = new Date().setHours(new Date().getHours() + 10).toString()
        const token = jsonwebtoken.sign(userinfosign, config.secretkey, { expiresIn: '10h' })
        if (password) {
            const mysql = 'SELECT * FROM redis WHERE redis.username=? AND redis.status=0 AND redis.startTime>?'
            const curTime=new Date().getTime().toString()
            db.query(mysql,[userinfo.username,curTime], (err, result) => {
                if (err) {
                    return res.send({
                        status: 0,
                        data: err.message
                    })
                }
                if (result.length === 1) {
                    return res.send({
                        status: 0,
                        data: '请不要重复登录'
                    })
                }
                const mysql = 'INSERT INTO redis SET ?'
                const tokeninfo = {
                    token: token,
                    status: 0,
                    startTime: overtime,
                    username: userinfo.username
                }
                db.query(mysql, tokeninfo)
                return res.send({
                    status: 1,
                    data: {
                        message: '登录成功',
                        token: 'Bearer ' + token,
                    }
                })
            })
        }
        else {
            return res.send({
                status: 0,
                data: '密码不正确'
            })
        }
    })
}
module.exports = {
    reguser_hander,
    login_hander,
}