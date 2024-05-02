import playwright from 'playwright';
import maxprice from './helpers/maxprice.js';

export default async function eskytravel(){
    const browser = await playwright.chromium.launch({
        headless: true,
    });

    const page = await browser.newPage();
    const time = 5000;
    const url = "https://www.eskytravel.dk/tilbud/co/dk/0/0/danmark?sort=Price&order=Ascending#deal-number-101542";

    await page.goto(url, {waitUntil: 'domcontentloaded'});

    await page.locator('button', {hasText: 'Enig'}).click();
    await page.waitForTimeout(time);

    const destination = page.locator('ul > li > a > div > div > div', {class: "arrival-city"});
    let destinationyes = await destination.allTextContents();

    await browser.close();

    let texts = [];
    let i = 0;
    while (i < destinationyes.length){
      switch (i % 3){
        case 0:
          break;
        case 1:
          texts.push(destinationyes[i]);
          break;
        case 2:
          let nr = destinationyes[i].match(/\d+/)[0];
          texts.push(nr);
          break;
      }
      i++;
    }

    let ticketdetails = [];
    for (let i = 0; i < texts.length; i += 2){
      let obj = {};
      obj.price = texts[i+1];
      obj.destination = texts[i];
      obj.origin = "Invalid";
      obj.site = url;
      obj.date = "Invalid";
      ticketdetails.push(obj);
    }

    let realticketdetails = maxprice(ticketdetails);

    return realticketdetails;
}