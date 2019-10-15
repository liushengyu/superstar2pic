const puppeteer=require("puppeteer")

async function downloadPic(){
    const url="http://img.sslibrary.com/n/slib/book/slib/11300653/056945db0502459181547f5d52e0988a/127306a47c3b0bd13c26fd492085424a.shtml?dxbaoku=true&deptid=97&fav=http%3A%2F%2Fwww.sslibrary.com%2Freader%2Fpdg%2Fdxpdgreader%3Fd%3D3c4fbaf578b9087d86e54365ea8acca7%26enc%3Dab15baf9ee4912913c33490de80cdc6c%26ssid%3D11300653%26did%3D97%26username%3Ddx2baoku_222.178.202.164_97&fenlei=0705011102&spage=1&t=5&username=dx2baoku_222.178.202.164_97&view=-1"
    const browser=await puppeteer.launch({
        headless:true,
        args:['--no-sandbox','--disaable-setuid-sanbox','--disable-dev-shm-usage']
    })
    const page = await browser.newPage()
    await page.goto(url,{timeout:120000,waitUntil:"domcontentloaded"})
    await page.screenshot({path:'test.png'})
}

function main()
{
    downloadPic()
}

main()