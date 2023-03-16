const fs=require('fs')
const path=require('path')
const upload_hander=(req,res)=>{
    fs.renameSync(req.file.path,req.file.destination+'\\'+req.file.filename+'.'+req.file.originalname.split('.')[1])
    res.send({
        status:0,
        data:'http://127.0.0.1:5566/getupload/'+req.file.filename+'.'+req.file.originalname.split('.')[1]
    })
}
const download_hander=(req,res)=>{
    req.query.url ? res.download(path.join(__dirname,'..','upload',`${req.query.url}`)) : res.send({
        success: false
    })
}
const uploaddocx_hander=(req,res)=>{
    fs.renameSync(req.file.path, req.file.path + '.' + req.file.originalname.split('.')[1])
    res.send({
        status:0,
        data:{
            localaddress:req.file.path + '.' + req.file.originalname.split('.')[1],
            onlineaddress:'http://127.0.0.1:5566/getnoval/'+req.file.filename+'.'+req.file.originalname.split('.')[1]
        }
    })
}
const downloaddocx_hander=(req,res)=>{
    console.log('#####')
    req.query.localaddress?res.download(req.query.localaddress):res.send({
        success:false
    })
}
module.exports={
    upload_hander,
    download_hander,
    uploaddocx_hander,
    downloaddocx_hander
}