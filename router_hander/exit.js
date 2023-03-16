const db=require('../db/index')
const exit_hander=(req,res)=>{
    const mysql='DELETE FROM redis WHERE redis.token=?'
    db.query(mysql,[req.headers.authorization.split(' ')[1]],(err,result)=>{
        if(err){
            return res.send({
                status:0,
                data:err.message
            })
        }
        if(result.affectedRows!==1){
            return res.send({
                status:0,
                data:'退出错误'
            })
        }
        res.send({
            status:1,
            data:'退出成功'
        })
    })
}
module.exports={
    exit_hander
}