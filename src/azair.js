import playwright from 'playwright';
import eurotodkk from './helpers/valutaconverter.js';
import maxprice from './helpers/maxprice.js';

export default async function azair(){
    const browser = await playwright.chromium.launch({
        headless: true,
    });

    const page = await browser.newPage();
    const time = 5000;
    const url = "https://www.azair.eu/azfin.php?tp=0&searchtype=flexi&srcAirport=Aalborg+%5BAAL%5D+%28%2BAAR%2CBLL%2CCPH%29&srcTypedText=pra&srcFreeTypedText=&srcMC=&srcap0=AAR&srcap1=BLL&srcap5=CPH&srcFreeAirport=&dstAirport=Milan+%5BMXP%5D+%28%2BXXX%29&dstTypedText=mil&dstFreeTypedText=&dstMC=MIL_ALL&adults=1&children=0&infants=0&minHourStay=0%3A45&maxHourStay=23%3A20&minHourOutbound=0%3A00&maxHourOutbound=24%3A00&minHourInbound=0%3A00&maxHourInbound=24%3A00&dstap10=XXX&dstFreeAirport=&depdate=20.4.2024&arrdate=2.3.2025&minDaysStay=3&maxDaysStay=6&nextday=0&autoprice=true&currency=EUR&wizzxclub=false&flyoneclub=false&blueairbenefits=false&megavolotea=false&schengen=false&transfer=false&samedep=true&samearr=true&dep0=true&dep1=true&dep2=true&dep3=true&dep4=true&dep5=true&dep6=true&arr0=true&arr1=true&arr2=true&arr3=true&arr4=true&arr5=true&arr6=true&maxChng=1&isOneway=return&resultSubmit=Search";

    await page.goto(url, {waitUntil: 'domcontentloaded'});

    await page.locator('button', {hasText: 'Consent'}).first().click();
    await page.waitForTimeout(time);

    const destination = page.locator('body > div > div > div > div', {class: "text", hasText: "€"});
    let destinationyes = await destination.allTextContents();

    await browser.close();

    destinationyes = destinationyes.map(a => a.trim());

    let texts = [];
    let i = 0;
    while (i < destinationyes.length){
        switch (i % 3){
        case 0:
            let temp = destinationyes[i].match(/(?<=\d{2}:\d{2}\s)[A-Za-z]+(?=\s[A-Z]{3})/)[0];
            texts.push(temp);
            break;
        case 1:
            let tempp = destinationyes[i].match(/(?<=\d{2}:\d{2}\s)[A-Za-z]+(?=\s[A-Z]{3})/)[0];
            texts.push(tempp);
            break;
        case 2:
            let nr = destinationyes[i].match(/(?<=€)\d+\.\d+/)[0];
            texts.push(eurotodkk(nr));
            break;
        }
        i++;
    }

    let ticketdetails = [];
    for (let i = 0; i < texts.length; i += 3){
        let obj = {};
        obj.price = texts[i + 2].toFixed(0);
        obj.destination = texts[i + 1];
        obj.origin = texts[i];
        obj.site = url;
        obj.date = "Invalid";
        ticketdetails.push(obj);
    }

    let realticketdetails = maxprice(ticketdetails);

    return realticketdetails;
}