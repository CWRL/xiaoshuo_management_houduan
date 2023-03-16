const express = require('express')
const user = require('./router/user')
const app = express()
const bodyParse = require('body-parser')
const JWT = require('express-jwt')
const config = require('./config')
const category = require('./router/category')
const db = require('./db/index')
const userexit = require('./router/exit')
const userinfo = require('./router/userinfo')
const employees = require('./router/employees')
const cors = require('cors')
const upload = require('./router/upload')
const path = require('path')
const role = require('./router/role')
const content = require('./router/content')
const book = require('./router/book')
const http = require('http').Server(app)
const news=require('./router/news')
const permissions=require('./router/permissions')
const socketserve=require('./socket')
const classify=require('./router/classify')
const main=require('./router/main')
socketserve(http)
app.use(cors())
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: true }));
app.use('/getupload', express.static(path.join(__dirname, 'upload')))
app.use('/getnoval', express.static(path.join(__dirname, 'noval')))
app.use(JWT({ secret: config.secretkey }).unless({ path: [/^\/api\//] }))
app.use(/^(?!\/api)/, (req, res, next) => {
    const mysql = 'SELECT * FROM redis WHERE redis.token=? AND redis.status=0'
    db.query(mysql, [req.headers.authorization.split(' ')[1]], (err, result) => {
        if (err) {
            return res.send({
                status: 0,
                data: err.message
            })
        }
        if (result.length === 0) {
            return res.status(401).send({ message: '请登录' })
        }
        next()
    })
})
app.use('/exit', userexit)
app.use('/api', user)
app.use('/getitem', category)
app.use('/user', userinfo)
app.use('/employees', employees)
app.use('/role', role)
app.use('/content', content)
app.use('/book', book)
app.use('/news',news)
app.use('/classify',classify)
app.use('/permissions',permissions)
app.use('/main',main)
app.use(upload)
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        if (err.code == 'credentials_required') {
            return res.status(401).send({ message: '请登录' })
        }
        if (err.code == 'invalid_token') {
            const mysql = 'DELETE FROM redis WHERE redis.token=?'
            db.query(mysql, [req.headers.authorization.split(' ')[1]])
            return res.status(401).send({ message: '身份过期,请重新登录' })
        }
    }
    return res.status(500).send({ message: err.message })
})
http.listen(5566, () => {
    console.log('serve has run at http://127.0.0.1:5566')
})
