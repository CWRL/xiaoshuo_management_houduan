const time=(time)=>{
    let year=new Date(time).getFullYear().toString()
    let month=(new Date(time).getMonth()+1).toString()
    let date=new Date(time).getDate().toString()
    let hours=new Date(time).getHours().toString()
    let minit=new Date(time).getMinutes().toString()
    if(+month<10){
        month='0'+month
    }
    if(+date<10){
        date='0'+date
    }
    if(+hours<10){
        hours='0'+hours
    }
    if(+minit<10){
        minit='0'+minit
    }
    return `${year}---${month}---${date}     ${hours}:${minit}`
}
module.exports=time