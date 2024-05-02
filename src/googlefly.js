import playwright from 'playwright';
import maxprice from './helpers/maxprice.js';

export default async function googlefly(){
    const browser = await playwright.chromium.launch({
        headless: true,
    });

    const page = await browser.newPage();
    const url = "https://www.google.com/travel/explore?tfs=CBwQAxoXagcIARIDQkxMcgwIBBIIL20vMDJqNzEaF2oMCAQSCC9tLzAyajcxcgcIARIDQkxMQAFIAWDoB3ACggELCP___________wGYAQGyAQIYAQ&tfu=GgA";

    await page.goto(url, {waitUntil: 'domcontentloaded'});

    await page.locator('span', {class: "VfPpkd-vQzf8d", hasText: "Accept all"}).first().click();

    // chatten
    const containerSelector = 'ol';
    await page.waitForSelector(containerSelector);
    const liElements = await page.$$('li');
    const content = [];
    for (const liElement of liElements) {
        const text = await liElement.textContent();
        content.push(text);
    }

    await browser.close();

    // vælger de rigtige flyafgange
    let real = [];
    for (let i = 0; i < content.length; i++){
        let temp = content[i].match(/^\w+\b.*DKK\b\s*(\d+(\.\d+)?)$/gm);
        if (temp != null){
            real.push(temp);
        }
    }

    // fjerner array i array
    let realreal = [];
    for (let i = 0; i < real.length; i++){
        realreal.push(real[i][0]);
    }

    // flytter lortet i de rigtige bokse
    let ticketdetails = [];
    for (let i = 0; i < realreal.length; i++){
        let pricee = realreal[i].match(/(?<=DKK\s)\d+/)[0];
        let destinationn = realreal[i].match(/^(?:(?!(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b)[A-Za-z])+/)[0];
        let datee = realreal[i].match(/(?:[A-Z][a-z]+(?: [A-Z][a-z]+)*)\s+\d{1,2}[^\w]*(\d{1,2})(.+?)Nonstop/gm);
        if (datee == null){
            datee += ["Invalid"];
        } else {
            datee[0] = datee[0].replace('Nonstop', '');
        }
        ticketdetails.push({price: pricee, destination: destinationn, origin: "Billund", site: url, date: datee[0]});
    }

    ticketdetails.sort((a,b) => a.price - b.price);
    let realticketdetails = maxprice(ticketdetails);
    
    return realticketdetails;

}