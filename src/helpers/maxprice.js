export default function maxprice(ticketdetails){
    let realticketdetails = [];
    for (let i = 0; i < ticketdetails.length; i++){
        if (ticketdetails[i].price < 300){
            realticketdetails.push(ticketdetails[i]);
        } else {
            break;
        }
    }
    return realticketdetails;
}