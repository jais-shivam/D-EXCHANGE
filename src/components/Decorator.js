import { ETHER_ADDRESS, ether, tokens, GREEN, RED } from "../helpers";
import moment from "moment";

export const decorateOrder = (order) => {
    let etherAmount, tokenAmount;
    if (order.tokenGive === ETHER_ADDRESS) {
      etherAmount = order.amountGive;
      tokenAmount = order.amountGet;
    } else {
      etherAmount = order.amountGet;
      tokenAmount = order.amountGive;
    }
    let tokenPrice = etherAmount / tokenAmount;
    const precision = 100000; //Calculate token price to 5 decimal places
    tokenPrice = Math.round(tokenPrice * precision) / precision;
    return {
      ...order,
      etherAmount: ether(etherAmount),
      tokenAmount: tokens(tokenAmount),
      tokenPrice,
      formattedTimeStamp: moment.unix(order.timestamp).format("h:mm:ss a M/D"),
    };
  };