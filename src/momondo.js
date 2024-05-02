import playwright from 'playwright';
import maxprice from './helpers/maxprice.js';

export default async function momondo(){
    const userAgent =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36";

    const browser = await playwright.chromium.launch({
        headless: true,
    });

    const context = await browser.newContext({
        userAgent,
    });

    const page = await context.newPage();
    const time = 5000;
    const url = "https://www.momondo.dk/explore/BLL-anywhere";

    await page.goto(url, {waitUntil: 'domcontentloaded'});

    await page.locator('button', {hasText: 'Acceptér alle', time}).click();
    await page.waitForTimeout(time);

    await page.waitForTimeout(time);

    const cities = page.locator('div', { class: "_ihz _irp _iqB _ilc _iai", hasText: "kr" });
    let texts = await cities.allTextContents();

    texts = texts.join("").match(/[\wöüłńø]+\s?\([A-Z]+\)[\d\s\.]+[\wöüłńø]+\s?kr/gm);

    texts = Array.from(new Set(texts));

    await browser.close();

    let ticketdetails = [];
    for (let i = 0; i < texts.length; i++){
        let number = texts[i].match(/\d+(?:\.\d+)?/)[0].replace(".", "");
        let temp = texts[i].match(/^[^\(]+(?=\s\()/)[0];
        if (number !== 0){
            ticketdetails.push({price: number, destination: temp, origin: "Billund", site: url, date: "Invalid"});
        }
    }

    ticketdetails.sort((a, b) => (a.price - b.price));
    let realticketdetails = maxprice(ticketdetails);

    return realticketdetails;
}