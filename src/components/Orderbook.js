import { get, groupBy, reject } from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ETHER_ADDRESS, GREEN, RED } from "../helpers";
import {
  selectAllOrdersLoaded,
  selectCancelledOrdersLoaded,
  selectFilledOrdersLoaded,
  selectOrderFilling,
} from "../store/exchangeSlice";
import { decorateOrder } from "./Decorator";
import { Spinner } from "./Spinner";
import { setOpenOrder } from "../store/exchangeSlice";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { setOrderFilling, selectExchangeContract } from "../store/exchangeSlice";
import { selectAccount } from "../store/web3Slice";

export const Orderbook = () => {
  const all = useSelector(selectAllOrdersLoaded);
  const filled = useSelector(selectFilledOrdersLoaded);
  const cancelled = useSelector(selectCancelledOrdersLoaded);
  const dispatch = useDispatch();
  // console.log('all',all);
  let openOrders = reject(all, (order) => {
    const orderFilled = filled.some((o) => o.id === order.id);
    const orderCancelled = cancelled.some((o) => o.id === order.id);
    return orderFilled || orderCancelled;
  });
  // console.log('0',openOrders);
  const decorateOrderBookOrders = (orders) => {
    return orders.map((order) => {
      order = decorateOrder(order);
      order = decorateOrderBookOrder(order);
      return order;
    });
  };

  const decorateOrderBookOrder = (order) => {
    const orderType = order.tokenGive === ETHER_ADDRESS ? "buy" : "sell";
    return {
      ...order,
      orderType,
      orderTypeClass: orderType === "buy" ? GREEN : RED,
      orderFillAction: orderType === "buy" ? "sell" : "buy",
    };
  };
  openOrders = decorateOrderBookOrders(openOrders);
  // console.log("1", openOrders);
  openOrders = groupBy(openOrders, "orderType");
  // console.log("2", openOrders);
  // fetch buy orders
  const buyOrder = get(openOrders, "buy", []);
  // fetch sell order
  const sellOrder = get(openOrders, "sell", []);

  // sort buy orders by token price
  openOrders = {
    ...openOrders,
    buyOrders: buyOrder.sort((a, b) => b.tokenPrice - a.tokenPrice),
    sellOrders: sellOrder.sort((a, b) => b.tokenPrice - a.tokenPrice),
  };
  dispatch(setOpenOrder(openOrders));
  // console.log(openOrders);
  const orderFilling= useSelector(selectOrderFilling);
  const myAccount = useSelector(selectAccount)[0];
  const exchange = useSelector(selectExchangeContract);
  return (
    <div className="vertical">
      <div className="card bg-dark text-white">
        <div className="card-header">Order book</div>
        <div className="card-body order-book">
          <table className="table table-dark table-sm small">
            {openOrders && !orderFilling ? showOrderBook(dispatch, exchange, openOrders, myAccount) : <Spinner type="table" />}
          </table>
        </div>
      </div>
    </div>
  );
};

const renderOrder = (dispatch, exchange, order, account) => {
  return (
    <OverlayTrigger
      key={order.id}
      placement="auto"
      overlay={
        <Tooltip id={order.id}>
          Click here to <strong>{order.orderFillAction}</strong>.
        </Tooltip>
      }
    >
      <tr
        key={order.id}
        className="order-book-order"
        onClick={(e) => fillOrder(dispatch, exchange, order, account)}
      >
        <td>{order.tokenAmount}</td>
        <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
        <td>{order.etherAmount}</td>
      </tr>
    </OverlayTrigger>
  );
};

const showOrderBook = (dispatch, exchange, orders, account) => {
  return (
    <tbody>
      {orders.sellOrders.map((order) => renderOrder(dispatch, exchange, order, account))}
      <tr>
        <th>Time</th>
        <th>DAPP</th>
        <th>DAPP/ETH</th>
      </tr>
      {orders.buyOrders.map((order) => renderOrder(dispatch, exchange, order, account))}
    </tbody>
  );
};

export const fillOrder = (dispatch, exchange, order, account) => {
  exchange.methods
    .fillOrder(order.id)
    .send({ from: account })
    .on("transactionHash", (hash) => {
      console.log('fillOrder');
      dispatch(setOrderFilling(true));
      //  subscribeToEvents(dispatch,exchange);
    })
    .on("error", (error) => {
      console.log(error);
      window.alert("There was an error!");
    });
};