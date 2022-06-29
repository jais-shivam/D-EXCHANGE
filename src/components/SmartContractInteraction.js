import React, { useEffect } from "react";
import Web3 from "web3";
import Token from "../abis/Token.json";
import Exchange from "../abis/Exchange.json";
import { useDispatch, useSelector } from "react-redux";
import { setWeb3Loaded, setAccount } from "../store/web3Slice";
import { setTokenLoaded } from "../store/tokenSlice";
import {
  selectExchangeContract,
  setExchangeContract,
  setCancelledOrdersLoaded,
  setFilledOrdersLoaded,
  setAllOrdersLoaded,
} from "../store/exchangeSlice";
import { ETHER_ADDRESS, ether, tokens, GREEN, RED } from "../helpers";
import moment from "moment";

export const SmartContractInteraction = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    loadBlockchainData();
  }, []);
  const loadBlockchainData = async () => {
    // const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545')
    // console.log("web3",web3);
    // const net=await web3.eth.net.getNetworkType();
    // console.log(net);
    // const acc=await web3.eth.getAccounts()
    // console.log(acc);
    // console.log("token",Token);
    // const abi = Token.abi;
    // console.log(abi);
    // const nets=Token.networks
    // console.log(nets);
    const web3 = new Web3(window.ethereum);
    dispatch(setWeb3Loaded(web3));
    const networkId = await web3.eth.net.getId();
    // console.log(networkId);
    const account = await web3.eth.getAccounts();
    dispatch(setAccount(account));

    //token
    const loadToken = async () => {
      try {
        const token = new web3.eth.Contract(
          Token.abi,
          Token.networks[networkId].address
        );
        // console.log(token);
        dispatch(setTokenLoaded(token));
        const totalSupply = await token.methods.totalSupply().call();
        // console.log("totalSupply", totalSupply);
        return token;
      } catch (err) {
        window.alert(
          "Token Contract not deployed to the current network. Please select another network with Metamask.",
          err
        );
        return null;
      }
    };

    //Exchange
    const loadExchange = async () => {
      try {
        const exchange = new web3.eth.Contract(
          Exchange.abi,
          Exchange.networks[networkId].address
        );
        // console.log("exchange", exchange);
        dispatch(setExchangeContract(exchange));
        return exchange;
      } catch (err) {
        window.alert(
          "Exchange Contract not deployed to the current network. Please select another network with Metamask.",
          err
        );
        return null;
      }
    };
    loadExchange();
    loadToken();
  };
  const loadAllOrder = async (exchange) => {
    // Cancel
    // Fetch cancelled orders with the "Cancel" event stream
    const cancelStream = await exchange.getPastEvents("Cancel", {
      fromBlock: 0,
      toBlock: "latest",
    });
    // format cancelled orders
    const cancelledOrder = cancelStream.map((event) => event.returnValues);
    // Add cancelled orders to the redux store
    dispatch(setCancelledOrdersLoaded(cancelledOrder));
    // console.log(cancelledOrder);

    // Trade
    // Fetch filled orders with the "Trade" event stream
    const tradeStream = await exchange.getPastEvents("Trade", {
      fromBlock: 0,
      toBlock: "latest",
    });
    // console.log('tradeStream',tradeStream);
    // format filled orders
    let sortedFilledOrders;
    let filledOrders = tradeStream.map((event) => event.returnValues);
    sortedFilledOrders = filledOrders.sort((a, b) => a.timestamp - b.timestamp); //assending sort
    sortedFilledOrders = decorateFilledOrders(sortedFilledOrders); //decorate the orders
    sortedFilledOrders = sortedFilledOrders.sort((a, b) => b.timestamp - a.timestamp); //desending sort
    // Add filled orders to the redux store
    dispatch(setFilledOrdersLoaded(sortedFilledOrders));

    // Order
    // Fetch filled orders with the "Order" event stream
    const orderStream = await exchange.getPastEvents("Order", {
      fromBlock: 0,
      toBlock: "latest",
    });
    // format ll orders
    const orders = orderStream.map((event) => event.returnValues);
    // Add all orders to the redux store
    dispatch(setAllOrdersLoaded(orders));
    // console.log(orders);
  };

  const decorateFilledOrders = (orders) => {
    let previousOrder = orders[0];
    return orders.map((order) => {
      order = decorateOrder(order);
      order = decorateFilledOrder(order, previousOrder);
      previousOrder = order; // Update the previous order once it's decorated
      return order;
    });
  };

  const decorateOrder = (order) => {
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

  const decorateFilledOrder = (order, previousOrder) => {
    return {
      ...order,
      tokenPriceClass: tokenPriceClass(
        order.tokenPrice,
        order.id,
        previousOrder
      ),
    };
  };

  const tokenPriceClass = (tokenPrice, orderId, previousOrder) => {
    // Show green price if only one order exists
    if (previousOrder.id === orderId) {
      return GREEN;
    }

    // Show green price if order price higher than previous order
    // Show red price if order price lower than previous order
    if (previousOrder.tokenPrice <= tokenPrice) {
      return GREEN; // success
    } else {
      return RED; // danger
    }
  };
  const exchangeContract = useSelector(selectExchangeContract);
  loadAllOrder(exchangeContract);
  return <></>;
};
