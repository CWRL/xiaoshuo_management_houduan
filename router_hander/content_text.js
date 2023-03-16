const noval_hander = require('../anoval_hander')
const path = require('path')
const fs = require('fs')
const addnoval_hander = (req, res) => {
    fs.renameSync(req.file.path, req.file.path+'.'+ req.file.originalname.split('.')[1])
    noval_hander(req.file.path+'.'+ req.file.originalname.split('.')[1], (value) => {
        let m=''
        value.forEach(element => {
            m += '<p>&nbsp; &nbsp;&nbsp;' + element + '</P>'
        });
        const result = `<!DOCTYPE html>
         <html lang="en">
         <head>
             <meta charset="UTF-8">
             <meta http-equiv="X-UA-Compatible" content="IE=edge">
             <meta name="viewport" content="width=device-width, initial-scale=1.0">
             <title>Document</title>
             <link rel="stylesheet" href="./index.css">
         </head>
         <body>
             <div id="box">
                 <div id="header">
                     <span class="flag">CWRL小说</span>
                     <ul id="remove">
                         <li><a href="#">首页</a></li>
                         <li><a href="#">分类</a></li>
                         <li><a href="#">排行</a></li>
                         <li><input type="text" id="shuru" placeholder="请输入书名">
                             <button>搜索</button>
                         </li>
                     </ul>
                 </div>
                 <div id="centers">
                     <div class="content">
                         <h1>第一章丹堂</h1>
                         <ul id="bookinfo">
                             <li>作者：${req.query.username}</li><span class="shuxian"> | </span>
                             <li>书名：${req.query.novalname}</li><span class="shuxian"> | </span>
                             <li>分类：${req.query.chapters}</li><span class="shuxian"> | </span>
                             <li>状态：${req.query.status}</li>
                         </ul>
                         <hr class="fenge">`+ m + `<ul class="bottonbtn">
                         <li><a href="#">目录</a></li>
                         <li><a href="#">上一章</a></li>
                         <li><a href="#">下一章</a></li>
                     </ul>
                 </div>
             </div>
         </div>
     </body>
     </html>`
        fs.writeFile(req.file.path + '.' + 'html', result, () => {
            res.send({
                status:0,
                data:`http://127.0.0.1:5566/getnoval/`+req.file.filename+'.html'
            })
        })
    })
}
module.exports = {
    addnoval_hander
}