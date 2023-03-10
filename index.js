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

    // T???i c??c ???nh n??y v??? th?? m???c hi???n t???i
    await Promise.all(imgLinks.map(imgUrl => download.image({
        url: imgUrl,
        dest: __dirname + '/img'
    })));

   
    await browser.close();
    console.log('Stop........................');
})();
/**
 * puppeteer.launch: M??? tr??nh duy???t Chrome l??n ????? b???t ?????u l??m tr??. H??m n??y tr??? v??? object ki???u Browser.
browser.newPage: M??? m???t tab m???i trong Chrome ????? l??m tr??. H??m n??y tr??? v??? object ki???u Page.
browser.close: T???t tr??nh duy???t (????? ph???i t???t b???ng tay)
page.goto: ??i t???i m???t trang n??o ????. C?? params waitUntil kh?? quan tr???ng. Params n??y quy???t ?????nh ch??ng ta ch??? t???i khi page v???a m???i load xong, hay sau khi page ???? load to??n b??? JavaScript v?? h??nh ???nh.
page.screenshot: Ch???p ???nh tab hi???n t???i, l??u th??nh file ???nh.
page.evaluate: ????y l?? API quan tr???ng nh???t, cho ph??p ta ch???y script trong browser v?? l???y k???t qu??? tr??? v???. Ch??ng ta s??? d??ng API n??y ????? c??o m????ng 14 nh??.

 */
// async function test(){
//     console.log('Loading........................');
//     // const browser = await  puppeteer.launch({ headless: false });
//     const browser = await  puppeteer.launch();
//     const page = await browser.newPage();
//     // page.setViewport({ width: 1280, height: 720 });
//     await page.goto('http://kenh14.vn', { waitUntil: 'networkidle2' });
//     // await page.screenshot({path: 'kenh14.png'});


//     // Ch???y ??o???n JavaScript trong h??m n??y, ????a k???t qu??? v??o bi???n article

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

//     // In ra k???t qu??? v?? ????ng tr??nh duy???t
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

//     // T???i c??c ???nh n??y v??? th?? m???c hi???n t???i
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

//     // T???i c??c ???nh n??y v??? th?? m???c hi???n t???i
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