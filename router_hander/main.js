const db=require('../db/index')
const allemployees_hander=(req,res)=>{
    const mysql='SELECT COUNT(user.id) AS count FROM user'
    db.query(mysql,(err,result)=>{
        if(err){
            return res.send({
                status:0,
                data:err.message
            })
        }
        res.send({
            status:1,
            data:result[0].count
        })
    })
}
const allnovals_hander=(req,res)=>{
    const mysql='SELECT COUNT(noval.id) AS count FROM noval'
    db.query(mysql,(err,result)=>{
        if(err){
            res.send({
                status:0,
                data:err.message
            })
        }
        res.send({
            status:1,
            data:result[0].count
        })
    })
}
const weekcount_hander=(req,res)=>{
    const mysql='SELECT user.permissions,COUNT(user.id) AS count FROM user GROUP BY user.permissions'
    db.query(mysql,(err,result)=>{
        if(err){
            res.send({
                status:0,
                data:err.message
            })
        }
        res.send({
            status:1,
            data:result
        })
    })
}
const fivecount_hander=(req,res)=>{
    const mysql='SELECT * FROM noval'
    db.query(mysql,(err,result)=>{
        if(err){
            return res.send({
                status:0,
                data:err.message
            })
        }
        let values={}
        result.map((value,item)=>{
            JSON.parse(value.classify).map((value,item)=>{
                if(!values[value]){
                    values[value]=1
                }
                else{
                    values[value]++
                }
            })
        })
        res.send({
            status:1,
            data:values
        })
    })
}
module.exports={
    allemployees_hander,
    allnovals_hander,
    weekcount_hander,
    fivecount_hander
}