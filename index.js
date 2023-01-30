const puppeteer = require('puppeteer');
const download = require('image-downloader');
const client = require('@elastic/elasticsearch');
console.log('Running........................');
// var mysql = require('mysql');
// var con = mysql.createConnection({
//     host: "103.130.216.98",
//     user: "yeunauan_story",
//     password: "anhadmin",
//     database: "yeunauan_appstory"
//   });

//   con.connect(function(err) {
//     if (err) throw err;
//     con.query("SELECT * FROM author", function (err, result, fields) {
//         if (err) throw err;
//         console.log(result);
//       });
//     console.log("Connected!");
//   });
  


(async()=> {
    console.log('Loading........................');
    
    const browser = await  puppeteer.launch();
    // const browser = await puppeteer.launch({
    //     headless: false
    // });
    const page = await browser.newPage();
    // await page.setViewport({
    //     width: 1200,
    //     height: 1400
    // });
    
    await page.goto('https://dtruyen.com/truyen-dich/', { waitUntil: 'networkidle2' });
    await autoScroll(page);
    
    const articles = await page.evaluate(() => {
        let titleLinks = document.querySelectorAll('div.list-stories > ul > li.story-list > a');
        titleLinks = [...titleLinks];
        let articles = titleLinks.map(link =>  ({
            // test: link.innerText,
            title: link.getAttribute('title'),
            url: link.getAttribute('href')
        }));
        return articles;
        // let imgElements = document.querySelectorAll('div.list-stories > ul > li.story-list > a > img');
        // imgElements = [...imgElements];
        // let imgLinks = imgElements.map(i => ({
        //     img: i.getAttribute('src'),
        // }));
        // return imgLinks;
    });
    console.log(articles);

    const imgLinks = await page.evaluate(() => {
        let imgElements = document.querySelectorAll('div.list-stories > ul > li.story-list > a > img');
        imgElements = [...imgElements];
        let imgLinks = imgElements.map(i => 
            i.getAttribute('src'));
        return imgLinks;
    });
    console.log(imgLinks);

    // Tải các ảnh này về thư mục hiện tại
    await Promise.all(imgLinks.map(imgUrl => download.image({
        url: imgUrl,
        dest: __dirname + '/img'
    })));

   
    await browser.close();
    console.log('Stop........................');
})();
/**
 * puppeteer.launch: Mở trình duyệt Chrome lên để bắt đầu làm trò. Hàm này trả về object kiểu Browser.
browser.newPage: Mở một tab mới trong Chrome để làm trò. Hàm này trả về object kiểu Page.
browser.close: Tắt trình duyệt (Đỡ phải tắt bằng tay)
page.goto: Đi tới một trang nào đó. Có params waitUntil khá quan trọng. Params này quyết định chúng ta chờ tới khi page vừa mới load xong, hay sau khi page đã load toàn bộ JavaScript và hình ảnh.
page.screenshot: Chụp ảnh tab hiện tại, lưu thành file ảnh.
page.evaluate: Đây là API quan trọng nhất, cho phép ta chạy script trong browser và lấy kết quả trả về. Chúng ta sẽ dùng API này để cào mương 14 nhé.

 */
// async function test(){
//     console.log('Loading........................');
//     // const browser = await  puppeteer.launch({ headless: false });
//     const browser = await  puppeteer.launch();
//     const page = await browser.newPage();
//     // page.setViewport({ width: 1280, height: 720 });
//     await page.goto('http://kenh14.vn', { waitUntil: 'networkidle2' });
//     // await page.screenshot({path: 'kenh14.png'});


//     // Chạy đoạn JavaScript trong hàm này, đưa kết quả vào biến article

//     const articles = await page.evaluate(() => {
//         let titleLinks = document.querySelectorAll('h3.knswli-title > a');
//         titleLinks = [...titleLinks];
//         let articles = titleLinks.map(link =>  ({
//             test: link.innerText,
//             title: link.getAttribute('title'),
//             url: link.getAttribute('href')
//         }));
//         return articles;
//     });

//     // In ra kết quả và đóng trình duyệt
//     console.log(articles);
//     await browser.close();
//     console.log('Stop........................');

// }
// test();

// const download = require('image-downloader');

// (async() => {
//     const browser = await puppeteer.launch();
//     console.log('Browser openned');
//     const page = await browser.newPage();
//     const url = 'https://kenh14.vn/minh-hang-do-thi-ha-va-3721-lan-dung-do-vay-voc-doi-chan-1m11-co-at-via-duoc-nhan-sac-co-ba-tra-20230129153604107.chn';
//     await page.goto(url);
//     console.log('Page loaded');

//     const imgLinks = await page.evaluate(() => {
//         let imgElements = document.querySelectorAll('.sp-img-zoom > img, .sp-img-lightbox > img, .detail-img-lightbox > img');
//         imgElements = [...imgElements];
//         let imgLinks = imgElements.map(i => i.getAttribute('src'));
//         return imgLinks;
//     });
//     console.log(imgLinks);

//     // Tải các ảnh này về thư mục hiện tại
//     await Promise.all(imgLinks.map(imgUrl => download.image({
//         url: imgUrl,
//         dest: __dirname
//     })));

//     await browser.close();
// })();


// (async() => {
//     const browser = await puppeteer.launch();
//     console.log('Browser openned');
//     const page = await browser.newPage();
//     const url = 'https://dtruyen.com/truyen-dich/';
//     await page.goto(url);
//     console.log('Page loaded');

//     const imgLinks = await page.evaluate(() => {
//         let imgElements = document.querySelectorAll('div.list-stories > ul > li.story-list > a > img');
//         imgElements = [...imgElements];
//         let imgLinks = imgElements.map(i => i.getAttribute('src'));
//         return imgLinks;
//     });
//     console.log(imgLinks);

//     // Tải các ảnh này về thư mục hiện tại
//     await Promise.all(imgLinks.map(imgUrl => download.image({
//         url: imgUrl,
//         dest: __dirname
//     })));

//     await browser.close();
// })();

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 50;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}