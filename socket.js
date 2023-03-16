const db = require('./db/index')
const timehander = require('./time')
const curuseinfo = []
const socketserve = (http) => {
    const io = require('socket.io')(http, {
        allowEIO3: true,
        cors: {
            origin: "http://127.0.0.1:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
    })
    io.on('connection', (Socket) => {
        console.log('有个用户登录', Socket.id)
        Socket.on('login', (username) => {
            let m = curuseinfo.some((value) => {
                return value.userid == Socket.id
            })
            if (!m) {
                curuseinfo.push({
                    username: username,
                    userid: Socket.id
                })
            }
            const mysql = 'SELECT * FROM news WHERE news.username=? AND news.isdelete=0'
            db.query(mysql, username, (err, result) => {
                if (err) {
                    return Socket.to(Socket.id).emit('getnews', err.message)
                }
                if (result.length == 0) {
                    return Socket.emit('getnews', [])
                }
                Socket.emit('getnews', result)
            })
        })
        Socket.on('setnews', (newsinfo) => {
            const mysql = 'INSERT INTO news SET ?'
            let pushuser
            curuseinfo.forEach((value) => {
                if (value.userid == Socket.id) {
                    pushuser = value.username
                }
            })
            const data = {
                username: newsinfo.username,
                content: newsinfo.content,
                capters: newsinfo.capters,
                captersname: newsinfo.captersname,
                audit: newsinfo.audit,
                date: timehander(new Date().getTime()),
                pushuser: pushuser,
                isready: 0,
                isdelete: 0,
                novalname: newsinfo.novalname,
                iscollection: 0
            }
            db.query(mysql, data, (err, result) => {
                if (err) {
                    return Socket.emit('setnewError', err.message)
                }
                if (result.affectedRows !== 1) {
                    return Socket.emit('setnewError', '发送失败')
                }
                curuseinfo.forEach((value) => {
                    if (value.username == newsinfo.username) {
                        io.to(value.userid).emit('hasnews')
                    }
                })
            })
        })
        Socket.on('getnullnew', (type, pushuser) => {
            let username
            curuseinfo.forEach((value) => {
                if (value.userid == Socket.id) {
                    username = value.username
                }
            })
            if (type == '个人邮件') {
                if (!pushuser) {
                    const mysql = 'SELECT * FROM news WHERE news.username=? AND news.isdelete=0'
                    db.query(mysql, username, (err, result) => {
                        if (err) {
                            return Socket.to(Socket.id).emit('getnews', err.message)
                        }
                        if (result.length == 0) {
                            return Socket.emit('getnews', [])
                        }
                        Socket.emit('getnews', result)
                    })
                }
                else{
                    const mysql = 'SELECT * FROM news WHERE news.username=? AND news.isdelete=0 AND news.pushuser=?' 
                    db.query(mysql,[username,pushuser], (err, result) => {
                        if (err) {
                            return Socket.to(Socket.id).emit('getnews', err.message)
                        }
                        if (result.length == 0) {
                            return Socket.emit('getnews', [])
                        }
                        Socket.emit('getnews', result)
                    })
                }
            }
            if (type == '未读') {
                if(!pushuser){
                    const mysql = 'SELECT * FROM news WHERE news.username=? AND news.isready=0 AND news.isdelete=0'
                    db.query(mysql, username, (err, result) => {
                        if (err) {
                            return Socket.to(Socket.id).emit('getnews', err.message)
                        }
                        if (result.length == 0) {
                            return Socket.emit('getnews', [])
                        }
                        Socket.emit('getnews', result)
                    })
                }
                else{
                    const mysql = 'SELECT * FROM news WHERE news.username=? AND news.isready=0 AND news.isdelete=0 AND news.pushuser=?'
                    db.query(mysql,[username,pushuser], (err, result) => {
                        if (err) {
                            return Socket.to(Socket.id).emit('getnews', err.message)
                        }
                        if (result.length == 0) {
                            return Socket.emit('getnews', [])
                        }
                        Socket.emit('getnews', result)
                    })
                }
            }
            if (type == '回收站') {
                if(!pushuser){
                    const mysql = 'SELECT * FROM news WHERE news.username=? AND news.isdelete=1'
                    db.query(mysql, username, (err, result) => {
                        if (err) {
                            return Socket.to(Socket.id).emit('getnews', err.message)
                        }
                        if (result.length == 0) {
                            return Socket.emit('getnews', [])
                        }
                        Socket.emit('getnews', result)
                    })
                }
                else{
                    const mysql = 'SELECT * FROM news WHERE news.username=? AND news.isdelete=1 AND news.pushuser=?'
                    db.query(mysql, [username,pushuser], (err, result) => {
                        if (err) {
                            return Socket.to(Socket.id).emit('getnews', err.message)
                        }
                        if (result.length == 0) {
                            return Socket.emit('getnews', [])
                        }
                        Socket.emit('getnews', result)
                    })
                }
            }
        })
        Socket.on('disconnect', () => {
            curuseinfo.forEach((value, index) => {
                if (value.userid == Socket.id) {
                    curuseinfo.splice(index, 1)
                }
            })
            console.log('有个用户离开了')
        })
    })
}
module.exports = socketserve