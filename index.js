const puppeteer=require("puppeteer")
const fs=require("fs")
const request=require("request")
var taskCount=0;
var piclist=[];
async function getPics(url){
    const browser=await puppeteer.launch({
        headless:false,
        args:['--no-sandbox','--disaable-setuid-sanbox','--disable-dev-shm-usage',]
    })
    const page = await browser.newPage()
    await page.goto(url,{timeout:120000,waitUntil:"domcontentloaded"})

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
    else if(filename.startsWith("leg"))
    {
        filename=filename.replace('fow','前言')
    }
    else if(filename.startsWith("!"))
    {
        filename=filename.replace('!','目录')
    }
    console.log("filename ",filename)
    return filename
}
async function downloadPics(dir)
{
    piclist.forEach(pic=>{
        
        requestPic(pic,dir)
    })
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
        taskCount++
        console.log("taskcount ",taskCount)
        if(taskCount>=piclist.length)
        {
            console.log("所有图片下载完成")
        }
    })
    rs.on("error",(err)=>{
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

main()