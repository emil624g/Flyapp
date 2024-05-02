import kiwi from "./src/kiwi.js";
import momondo from "./src/momondo.js";
import eskytravel from "./src/eskytravel.js";
import googlefly from "./src/googlefly.js";
import azair from "./src/azair.js";
import duplicator from "./src/helpers/duplicator.js";
import express from "express";
import { renderFile } from 'ejs';
import path from 'path';

const PORT = 3000;
const app = express();
const nr_apps = 5;

let realticketdetails;

app.use(express.json());

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, '/views'));
app.engine('html', renderFile);
app.set("view engine", "html");
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (request, response) => {
    response.render('index');
});

app.post("/", async(request, response) => {
    
    let arr = [];
    let count = 0;

    const promises = [];

    promises.push(kiwi().then(a => arr.push(a)).catch(error => console.error(error)).finally(() => count++));
    promises.push(momondo().then(b => arr.push(b)).catch(error => console.error(error)).finally(() => count++));
    promises.push(eskytravel().then(c => arr.push(c)).catch(error => console.error(error)).finally(() => count++));
    promises.push(googlefly().then(d => arr.push(d)).catch(error => console.error(error)).finally(() => count++));
    promises.push(azair().then(e => arr.push(e)).catch(error => console.error(error)).finally(() => count++));

    await Promise.all(promises);

    function finalize() {
        if (count == nr_apps) {
            let ticketdetails = arr.flat();
            ticketdetails.sort((a, b) => a.price - b.price);
            duplicator(ticketdetails);
            realticketdetails = ticketdetails;
            for (let i = realticketdetails.length - 1; i >= 0; i--){
                if (realticketdetails[i].destination == realticketdetails[i].origin){
                    realticketdetails.splice(i, 1);
                };
            };
            response.send(realticketdetails);
        };
    };

    finalize();
    
});

app.listen(PORT, function(err){
    if (err) console.log("Error in server setup");
    console.log("Server listening on http://localhost:" + PORT+"\n");
});