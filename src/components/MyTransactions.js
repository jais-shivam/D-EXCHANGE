import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import { useSelector } from "react-redux";
import { ETHER_ADDRESS, GREEN, RED } from "../helpers";
import {
  selectFilledOrdersLoaded,
  selectOpenOrder,
} from "../store/exchangeSlice";
import { selectAccount } from "../store/web3Slice";
import { decorateOrder } from "./Decorator";
import { Spinner } from "./Spinner";

export const MyTransactions = () => {
  const filledOrders = useSelector(selectFilledOrdersLoaded);
  const myAccount = useSelector(selectAccount)[0];
  console.log("filledOrders", filledOrders);
  const openOrders = useSelector(selectOpenOrder).buyOrders;
  let myOpenOrders = openOrders
    .slice()
    .sort((a, b) => a.timestamp - b.timestamp);
  console.log(myOpenOrders);

  //   console.log('user',typeof(filledOrders[0].user));
  console.log("myAccount", typeof myAccount);
  let myFilledOrders = filledOrders.filter(
    (o) => o.user === myAccount || o.userFill === myAccount
  );

  console.log(myFilledOrders);
  // Sort by date ascending
  myFilledOrders = myFilledOrders.sort((a, b) => a.timestamp - b.timestamp);
  console.log("2", myFilledOrders);
  //decorate orders - add display attributes
  myFilledOrders = decorateMyFilledOrders(myFilledOrders, myAccount);
  console.log(myFilledOrders);

  return (
    <div className="card bg-dark text-white">
      <div className="card-header">My Transactions</div>
      <div className="card-body">
        <Tabs defaultActiveKey="trades" className="bg-dark text-white">
          <Tab eventKey="trades" title="Trades" className="bg-dark">
            <table className="table table-dark table-sm small">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>DAPP</th>
                  <th>DAPP/ETH</th>
                </tr>
              </thead>
              {myFilledOrders ? (
                showMyFilledOrders(myFilledOrders)
              ) : (
                <Spinner type="table" />
              )}
            </table>
          </Tab>
          <Tab eventKey="orders" title="Orders">
            <table className="table table-dark table-sm small">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>DAPP/ETH</th>
                  <th>Cancel</th>
                </tr>
              </thead>
              {myOpenOrders ? (
                showMyOpenOrders(myOpenOrders)
              ) : (
                <Spinner type="table" />
              )}
            </table>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

const showMyFilledOrders = (myFilledOrders) => {
  return (
    <tbody>
      {myFilledOrders.map((order) => {
        return (
          <tr key={order.id}>
            <td className="text-muted">{order.formattedTimeStamp}</td>
            <td className={`text-${order.orderTypeClass}`}>
              {order.orderSign}
              {order.tokenAmount}
            </td>
            <td className={`text-${order.orderTypeClass}`}>
              {order.tokenPrice}
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

const decorateMyFilledOrders = (orders, account) => {
  return orders.map((order) => {
    order = decorateOrder(order);
    order = decorateMyFilledOrder(order, account);
    return order;
  });
};

const decorateMyFilledOrder = (order, account) => {
  const myOrder = order.user === account;
  let orderType;
  myOrder
    ? (orderType = order.tokenGive === ETHER_ADDRESS ? "buy" : "sell")
    : (orderType = order.tokenGive === ETHER_ADDRESS ? "sell" : "buy");

  return {
    ...order,
    orderType,
    orderTypeClass: orderType === "buy" ? GREEN : RED,
    orderSign: orderType === "buy" ? "+" : "-",
  };
};

const showMyOpenOrders = (myOpenOrders) => {
  return (
    <tbody>
      {myOpenOrders.map((order) => {
        return (
          <tr key={order.id}>
            <td className={`text-${order.orderTypeClass}`}>
              {order.tokenAmount}
            </td>
            <td className={`text-${order.orderTypeClass}`}>
              {order.tokenPrice}
            </td>
            <td className="text-muted">x</td>
          </tr>
        );
      })}
    </tbody>
  );
};
