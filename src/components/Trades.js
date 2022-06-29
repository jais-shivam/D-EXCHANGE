import React from "react";
import { useSelector } from "react-redux";
import { selectFilledOrdersLoaded } from "../store/exchangeSlice";
import { Spinner } from "./Spinner";


const showFilledOrders = (filledOrders) => {
  return (
    <tbody>
      {filledOrders.map((order) => {
        return (
          <tr className={`order-${order.id}`} key={order.id}>
            <td className="text-muted">{order.formattedTimeStamp}</td>
            <td >{order.tokenAmount}</td>
            <td className={`text-${order.tokenPriceClass}`}>{order.tokenPrice}</td>
          </tr>
        );
      })}
    </tbody>
  );
};

export const Trades = () => {
  const filledOrders = useSelector(selectFilledOrdersLoaded);
  return (
    <div className="vertical">
      <div className="card bg-dark text-white">
        <div className="card-header">Trades</div>
        <div className="card-body">
          <table className="table table-dark table-sm small">
            <thead>
              <tr>
                <th>Time</th>
                <th>DAPP</th>
                <th>DAPP/ETH</th>
              </tr>
            </thead>
            { filledOrders? showFilledOrders(filledOrders) : <Spinner type="table" />}
          </table>
        </div>
      </div>
    </div>
  );
};
