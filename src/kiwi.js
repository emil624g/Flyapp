import playwright from 'playwright';
import maxprice from './helpers/maxprice.js';

export default async function kiwi(){
    const userAgent =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36";

    const browser = await playwright.chromium.launch({
        headless: true,
    });

    const context = await browser.newContext({
        userAgent,
    });

    const page = await context.newPage();
    const url = "https://www.kiwi.com/en/search/tiles/aalborg-denmark,billund-denmark,copenhagen-denmark/anywhere?sortAggregateBy=price";

    await page.goto(url, {waitUntil: 'domcontentloaded'});

    await page.waitForSelector('#cookies_accept', {timeout: 5000});
    await page.click('#cookies_accept');

    const citiesLocator = '[data-test=PictureCard] > div';
    await page.waitForSelector(citiesLocator);
    const cities = page.locator(citiesLocator);
    let texts = await cities.allTextContents();

    await browser.close();

    for (let i = texts.length - 1; i >= 0; i--){
        if (texts[i] === "" || texts[i] === "loading"){
            texts.splice(i, 1);
        }
    }

    let ticketdetails = [];
    for (let i = 0; i < texts.length; i++){
        let temp = texts[i].match(/(?<=\s)[A-Za-zöüłńøșó\s]+(?=,[\sA-Za-zöüłńøșó]+Tickets)/)[0];
        let number = texts[i].match(/\d+/)[0];
        let origintemp = texts[i].match(/(\w+)/)[0];
        ticketdetails.push({price: number, destination: temp, origin: origintemp, site: url, date: "Invalid"});
    }

    ticketdetails.sort((a, b) => (a.price - b.price));
    let realticketdetails = maxprice(ticketdetails);

    return realticketdetails;
}