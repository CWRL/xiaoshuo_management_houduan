const joi=require('joi')
const username=joi.string().min(1).max(10).required().error(new Error('用户名不正确'))
const password=joi.string().pattern(/^[\S]{8,12}$/).required().error(new Error('密码不正确'))
const email=joi.string().pattern(/^[1-9][0-9]{9,10}@qq.com$/).required().error(new Error('邮箱不正确'))
const permissions=joi.string().required().error(new Error('身份不正确'))
const CurrentPage=joi.number().required().error(new Error('当前页不能为空'))
const pages=joi.number().required().error(new Error('每页展示条数不能为空'))
const rolename=joi.string().required().min(1).max(8).error(new Error('角色名不正确'))
const roledescribe=joi.string().required().error(new Error('角色描述不正确'))
const novalname=joi.string().min(2).max(10).required().error(new Error('小说名正确'))
const classify=joi.string().required().error(new Error('文章分类不正确'))
const status=joi.string().required().error(new Error('状态不正确'))
const abstarct=joi.string().required().error(new Error('描述不正确'))
const avator=joi.string().pattern(/^[http:\/\/127.0.0.1:5566\/upload]/).required().error(new Error('图片格式不正确'))
const capters=joi.string().required().error(new Error('章节不能为空'))
const captersname=joi.string().min(1).max(15).required().error(new Error('章节名格式不正确'))
const onlineaddress=joi.string().pattern(/^[http:\/\/127.0.0.1:5566\/getnoval]/).required().error(new Error('在线地址格式不正确'))
const classifyname=joi.string().min(2).max(15).required().error(new Error('分类名不正确'))
const Recommended=joi.string().pattern(/^\[/).required().error(new Error('推荐书名格式不正确'))
const limitfree=joi.string().pattern(/^\[/).required().error(new Error('限免书籍格式不正确'))
module.exports.reguser={
    username,
    password,
    email,
    permissions
}
module.exports.loginuser={
    username,
    password
}
module.exports.employees={
    CurrentPage,
    pages
}
module.exports.searchemployee={
    username,
    password:joi.string().pattern(/^[\S]{8,12}$/).error(new Error('密码格式不对')),
    email,
    permissions,
}
module.exports.searchemployee1={
    username,
    email,
    permissions,
}
module.exports.searchschema={
    username:joi.string().min(1).max(10).required().error(new Error('用户名输入不正确'))
}
module.exports.roleschema={
    rolename,
    roledescribe
}
module.exports.rolevalue={
    CurrentPage,
    pages
}
module.exports.addnovalschema={
    novalname,
    classify,
    status,
    abstarct,
    avator
}
module.exports.addcaptersschema={
    novalname,
    capters,
    captersname,
    onlineaddress
}
module.exports.addclassify={
    classifyname,
}