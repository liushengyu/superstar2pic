const puppeteer=require("puppeteer")
const fs=require("fs")
const request=require("request")
var currentCount=0;
var limitCount=5
var piclist=[];
async function getPics(url){
    const browser=await puppeteer.launch({
        headless:false,
        args:['--no-sandbox','--disaable-setuid-sanbox','--disable-dev-shm-usage',]
    })
    const page = await browser.newPage()
    await page.goto(url,{timeout:120000,waitUntil:"domcontentloaded"})
    await page.waitForSelector("#bookinfo")
    const bookinfo=await page.$eval("#bookinfo",el=>el.innerHTML)
    console.log("bookinfo",bookinfo)
    await page.waitFor(".readerPager")
    await page.evaluate(()=>{
        return new Promise((resovle,reject)=>{
            let distance=1069
            let totalDistance=0
            let container=document.querySelector('.reader')
            container.scrollTo(0,0)
            let timer=setInterval(()=>{
                container.scrollBy(0,distance)
                totalDistance+=distance
                console.log("distance",distance,totalDistance,container.scrollHeight)
                if(totalDistance>=container.scrollHeight)
                {
                    console.log("timer",timer)
                    clearInterval(timer)
                    resovle()
                }
            },1000)
        })
    })


    piclist=await page.$$eval('.readerImg',el=>el.map(item=>item.src))

    console.log("piclist",piclist,piclist.length)
    await page.waitFor(5000)
    downloadPics(bookinfo.replace(/,/g,' '))

}
function generateName(filename)
{
    if(filename.startsWith('bok'))
    {
        filename=filename.replace('bok','封面')
    }
    else if(filename.startsWith("leg"))
    {
        filename=filename.replace('leg','出版页')
    }
    else if(filename.startsWith("fow"))
    {
        filename=filename.replace('fow','前言')
    }
    else if(filename.startsWith("!"))
    {
        filename=filename.replace('!','目录')
    }
    return filename
}
async function downloadPics(dir)
{
    for(let i =0;i<limitCount;i++)
    {
        excutePicList(dir)
    }
}

function excutePicList(dir)
{
    if(currentCount<limitCount)
    {
        currentCount++
        let picsrc=piclist.pop()
        requestPic(picsrc,dir)
    }
}


function requestPic(src,dir){
    let splitwords=src.split('/')
    let namewithparam=splitwords[splitwords.length-1]
    let name=namewithparam.split('?')[0]
    name=generateName(name)
    try
    {
     fs.accessSync(dir,fs.constants.F_OK)
}catch(err){
    console.log("书本目录不存在")
             fs.mkdirSync(dir,{recursive:true})
}
    let ws=fs.createWriteStream(dir+"/"+name+".png")
    let rs=request(src)
    rs.pipe(ws)
    rs.on("end",()=>{
        console.log(name+" 下载成功")
        console.log("剩余任务 ",piclist.length)
        currentCount--
        if(piclist.length<=0)
        {
            console.log("所有图片下载完成")
            return 
        }
        excutePicList(dir)
    })
    rs.on("error",(err)=>{
        currentCount--
        if(piclist.length<=0)
        {
            console.log("所有图片下载完成")
            return 
        }
        excutePicList(dir)
        console.log(name+" 下载出错啦",err)
    })
    rs.on("finish",()=>{
        console.log("文件写入成功，可以享用你的图片啦")
        ws.end()
        
    })

}
function main()
{
    let url=process.argv.splice(2)
    if(url[0])
    {
        console.log("传入参数：",url[0])
        getPics(url[0])
    }
}
function unitTest(){
    requestPic("http://img.sslibrary.com/n/b5d4033a124b5234a7693a52716b5b12MC247337714400/img1/681D93A5EB6BB6239DDCFAF2D8BD646893B48F4C8E9216585330F30483DBCA3E9841D8ADA77A899FF46FFA452BFBFC2361B403AC451E41E9432C59E929A5C5B612108275834BFB3A3B831BABA00F96F543D1FA018B8EB1308B037EF2F058ADE797F90E43C3E1BA56C96C6F84A4D80A9A3F1B/nf1/qw/11084014/3525BB5D1D9B462FAABBACDE6D42453A/000072?zoom=0",'test')
}
main()