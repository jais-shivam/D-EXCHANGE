import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ETHER_ADDRESS } from "../helpers";
import {
  selectBuyOrder,
  selectExchangeContract,
  selectSellOrder,
  setBuyOrderAmountChanged,
  setBuyOrderMaking,
  setBuyOrderPriceChanged,
  setSellOrderAmountChanged,
  setSellOrderMaking,
  setSellOrderPriceChanged,
} from "../store/exchangeSlice";
import { selectTokenContract } from "../store/tokenSlice";
import { selectAccount, selectWeb3 } from "../store/web3Slice";
import { Spinner } from "./Spinner";

export const NewOrder = () => {
  const dispatch = useDispatch();
  const web3 = useSelector(selectWeb3);
  const exchange = useSelector(selectExchangeContract);
  const token = useSelector(selectTokenContract);
  const account = useSelector(selectAccount)[0];
  const buyOrder = useSelector(selectBuyOrder);
  const sellOrder = useSelector(selectSellOrder);
  return (
    <div className="card bg-dark text-white">
      <div className="card-header">New Order</div>
      <div className="card-body">
        {!buyOrder.making && !sellOrder.making ? (
          showForm(
            dispatch,
            exchange,
            token,
            web3,
            buyOrder,
            sellOrder,
            account
          )
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};

const showForm = (
  dispatch,
  exchange,
  token,
  web3,
  buyOrder,
  sellOrder,
  account
) => {
  return (
    <>
      <Tabs defaultActiveKey="buy" className="bg-dark text-white small">
        <Tab eventKey="buy" title="Buy" className="bg-dark small">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              makeBuyOrder(dispatch, exchange, token, web3, buyOrder, account);
            }}
          >
            <div className="form-group small">
              <label>Buy Amount (DAPP)</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm bg-dark text-white"
                  placeholder="Buy Amount"
                  onChange={(e) =>
                    dispatch(setBuyOrderAmountChanged(e.target.value))
                  }
                  required
                />
              </div>
            </div>
            <div className="form-group small">
              <label>Buy Price</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm bg-dark text-white"
                  placeholder="Buy Price"
                  onChange={(e) =>
                    dispatch(setBuyOrderPriceChanged(e.target.value))
                  }
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-sm btn-block">
              Buy Order
            </button>
            { buyOrder.amount && buyOrder.price ? <small>Total: {buyOrder.amount * buyOrder.price} ETH</small> : null }
          </form>
        </Tab>

        <Tab eventKey="sell" title="Sell" className="bg-dark small">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              makeSellOrder(
                dispatch,
                exchange,
                token,
                web3,
                sellOrder,
                account
              );
            }}
          >
            <div className="form-group small">
              <label>Buy Sell (DAPP)</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm bg-dark text-white"
                  placeholder="Sell amount"
                  onChange={(e) =>
                    dispatch(setSellOrderAmountChanged(e.target.value))
                  }
                  required
                />
              </div>
            </div>
            <div className="form-group small">
              <label>Sell Price</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm bg-dark text-white"
                  placeholder="Sell Price"
                  onChange={(e) =>
                    dispatch(setSellOrderPriceChanged(e.target.value))
                  }
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-sm btn-block">
              Sell Order
            </button>
                {sellOrder.amount && sellOrder.price ? (
                <small>Total: {sellOrder.amount * sellOrder.price} ETH</small>
                ) : null}
          </form>
        </Tab>
      </Tabs>
    </>
  );
};

export const makeBuyOrder = (
  dispatch,
  exchange,
  token,
  web3,
  order,
  account
) => {
  const tokenGet = token.options.address;
  const amountGet = web3.utils.toWei(order.amount, "ether");
  const tokenGive = ETHER_ADDRESS;
  const amountGive = web3.utils.toWei(
    (order.amount * order.price).toString(),
    "ether"
  );

  exchange.methods
    .makeOrder(tokenGet, amountGet, tokenGive, amountGive)
    .send({ from: account })
    .on("transactionHash", (hash) => {
      dispatch(setBuyOrderMaking(true));
    })
    .on("error", (error) => {
      console.error(error);
      window.alert(`There was an error!`);
    });
};

export const makeSellOrder = (
  dispatch,
  exchange,
  token,
  web3,
  order,
  account
) => {
  const tokenGet = ETHER_ADDRESS;
  const amountGet = web3.utils.toWei(
    (order.amount * order.price).toString(),
    "ether"
  );
  const tokenGive = token.options.address;
  const amountGive = web3.utils.toWei(order.amount, "ether");

  exchange.methods
    .makeOrder(tokenGet, amountGet, tokenGive, amountGive)
    .send({ from: account })
    .on("transactionHash", (hash) => {
      dispatch(setSellOrderMaking(true));
    })
    .on("error", (error) => {
      console.error(error);
      window.alert(`There was an error!`);
    });
};
