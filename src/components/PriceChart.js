import React from "react";
import { Spinner } from "./Spinner";
import Chart from "react-apexcharts";
import { chartOptions, dummyData } from "./PriceChart.config";
import { useSelector } from "react-redux";
import { selectFilledOrdersLoaded } from "../store/exchangeSlice";
import { decorateOrder } from "./Decorator";
import moment from "moment";
import { groupBy, maxBy, minBy, get } from "lodash";

export const PriceChart = () => {
  let filledOrders = useSelector(selectFilledOrdersLoaded);
  filledOrders = filledOrders.slice().sort((a, b) => a.timestamp - b.timestamp);
  filledOrders = filledOrders.map((order) => decorateOrder(order));
  // console.log(filledOrders);
  // Get last 2 order for final price & price change
  let [secondLastOrder, lastOrder] = filledOrders.slice(
    filledOrders.length - 2,
    filledOrders.length
  );
  // get last order price
  const lastPrice = get(lastOrder, "tokenPrice", 0);
  // console.log('lastPrice',lastPrice);
  // get second last order price
  const secondLastPrice = get(secondLastOrder, "tokenPrice", 0);

  const dataForChart = {
    lastPrice,
    lastPriceChange: lastPrice >= secondLastPrice ? "+" : "-",
    series: [
      {
        data: buildGraphData(filledOrders),
      },
    ],
  };

  return (
    <div className="card bg-dark text-white">
      <div className="card-header">Price Chart</div>
      <div className="card-body">
        {dataForChart ? showPriceChart(dataForChart) : <Spinner type="table" />}
        {/* {this.props.priceChartLoaded ? showPriceChart(this.props.priceChart) : <Spinner/>} */}
      </div>
    </div>
  );
};

const buildGraphData = (orders) => {
  // Group the orders by hour for the graph
  orders = groupBy(orders, (o) =>
    moment.unix(o.timestamp).startOf("hour").format()
  );
  // Get each hour where data exists
  const hours = Object.keys(orders);
  // Build the graph series
  const graphData = hours.map((hour) => {
    // Fetch all the orders from current hour
    const group = orders[hour];
    // Calculate price values - open, high, low, close
    const open = group[0]; // first order
    const high = maxBy(group, "tokenPrice"); // high price
    const low = minBy(group, "tokenPrice"); // low price
    const close = group[group.length - 1]; // last order

    return {
      x: new Date(hour),
      y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice],
    };
  });

  return graphData;
};
const priceSymbol = (lastPriceChange) => {
  let output;
  if (lastPriceChange === "+") {
    output = <span className="text-success">&#9650;</span>; // Green up tiangle
  } else {
    output = <span className="text-danger">&#9660;</span>; // Red down triangle
  }
  return output;
};

const showPriceChart = (priceChart) => {
  return (
    <div className="price-chart">
      <div className="price">
        <h4>DAPP/ETH &nbsp; {priceSymbol(priceChart.lastPriceChange)} &nbsp; {priceChart.lastPrice}</h4>
      </div>
      <Chart
        options={chartOptions}
        series={priceChart.series}
        type="candlestick"
        width="100%"
        height="100%"
      />
    </div>
  );
};
