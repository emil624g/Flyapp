export default function duplicator(a){
    let ticketdetails = a;
    for (let i = 0; i < ticketdetails.length; i++){
        for (let j = 0; j < ticketdetails.length; j++){
            if (ticketdetails[i].destination == ticketdetails[j].destination && i != j){
                if (ticketdetails[i].price - ticketdetails[j].price >= 0){
                    ticketdetails.splice(i, 1);
                    i--;
                    j--;
                    }
                }
            }
        }
        return ticketdetails;
}