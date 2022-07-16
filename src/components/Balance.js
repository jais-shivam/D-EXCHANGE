import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectExchangeContract } from "../store/exchangeSlice";
import {
  selectTokenBalance,
  selectTokenContract,
  setTokenBalance,
} from "../store/tokenSlice";
import {
  selectAccount,
  selectEtherBalance,
  selectWeb3,
  setEtherBalance,
} from "../store/web3Slice";
import { ether, ETHER_ADDRESS, formatBalance } from "../helpers";
import {
  setExchangeEtherBalance,
  setExchangeTokenBalance,
  setBalancesLoaded,
  selectBalancesLoading,
  selectBalancesLoaded,
  selectExchangeEtherBalance,
  selectExchangeTokenBalance,
  setEtherDepositAmountChanged,
  selectEtherDepositAmountChanged,
  setBalancesLoading,
  setEtherWithdrawAmountChanged,
  selectEtherWithdrawAmountChanged,
  setTokenDepositAmountChanged,
  selectTokenDepositAmountChanged,
  setTokenWithdrawAmountChanged,
  selectTokenWithdrawAmountChanged,
} from "../store/balanceSlice";
import { Spinner } from "./Spinner";
import { Tabs, Tab } from "react-bootstrap";

export const Balance = () => {
  const dispatch = useDispatch();
  const web3 = useSelector(selectWeb3);
  const exchange = useSelector(selectExchangeContract);
  const token = useSelector(selectTokenContract);
  const account = useSelector(selectAccount)[0];
  useEffect(() => {
    loadBlockchainData(dispatch, web3, exchange, token, account);
  }, [web3, exchange, token, account]);

  const loadBlockchainData = async (
    dispatch,
    web3,
    exchange,
    token,
    account
  ) => {
    await loadBalances(dispatch, web3, exchange, token, account);
  };
  const etherBalance = useSelector(selectEtherBalance);
  const tokenBalance = useSelector(selectTokenBalance);
  const exchangeEtherBalance = useSelector(selectExchangeEtherBalance);
  const exchangeTokenBalance = useSelector(selectExchangeTokenBalance);
  const etherDepositAmount = useSelector(selectEtherDepositAmountChanged);
  const balancesLoading = useSelector(selectBalancesLoading);
  const etherWithdrawAmount = useSelector(selectEtherWithdrawAmountChanged);
  const tokenContract = useSelector(selectTokenContract);
  const tokenDepositAmount = useSelector(selectTokenDepositAmountChanged);
  const tokenWithdrawAmount = useSelector(selectTokenWithdrawAmountChanged);
 
  return (
    <div className="card bg-dark text-white">
      <div className="card-header">Balance</div>
      <div className="card-body">
        {!balancesLoading ? (
          showForm(
            dispatch,
            etherBalance,
            tokenBalance,
            exchangeEtherBalance,
            exchangeTokenBalance,
            web3,
            exchange,
            etherDepositAmount,
            account,
            etherWithdrawAmount,
            tokenContract,
            tokenDepositAmount,
            tokenWithdrawAmount
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
  etherBalance,
  tokenBalance,
  exchangeEtherBalance,
  exchangeTokenBalance,
  web3,
  exchange,
  etherDepositAmount,
  account,
  etherWithdrawAmount,
  tokenContract,
  tokenDepositAmount,
  tokenWithdrawAmount
) => {
  return (
    <Tabs defaultActiveKey="deposit" className="bg-dark text-white small">
      <Tab eventKey="deposit" title="Deposit" className="bg-dark small">
        <table className="table table-dark table-sm small">
          <thead>
            <tr>
              <th>Token</th>
              <th>Wallet</th>
              <th>Exchange</th>
            </tr>
          </thead>
          {rendorTokenAndAmount("ETH", etherBalance, exchangeEtherBalance)}
        </table>
        <form
          className="row"
          onSubmit={(event) => {
            event.preventDefault();
            depositEther(dispatch, exchange, web3, etherDepositAmount, account);
          }}
        >
          <div className="col-12 col-sm pr-sm-2">
            <input
              type="text"
              placeholder="ETH Amount"
              onChange={(e) =>
                dispatch(setEtherDepositAmountChanged(e.target.value))
              }
              className="form-control form-control-sm bg-dark text-white"
              required
            />
          </div>
          <div className="col-12 col-sm-auto pl-sm-0">
            <button type="submit" className="btn btn-primary btn-block btn-sm">
              Deposit
            </button>
          </div>
        </form>
        {/* -----------Token------------- */}
        <table className="table table-dark table-sm small">
          {rendorTokenAndAmount("DAPP", tokenBalance, exchangeTokenBalance)}
        </table>
        <form
          className="row"
          onSubmit={(event) => {
            event.preventDefault();
            depositToken(
              dispatch,
              exchange,
              web3,
              tokenContract,
              tokenDepositAmount,
              account
            );
          }}
        >
          <div className="col-12 col-sm pr-sm-2">
            <input
              type="text"
              placeholder="DAPP Amount"
              onChange={(e) =>
                dispatch(setTokenDepositAmountChanged(e.target.value))
              }
              className="form-control form-control-sm bg-dark text-white"
              required
            />
          </div>
          <div className="col-12 col-sm-auto pl-sm-0">
            <button type="submit" className="btn btn-primary btn-block btn-sm">
              Deposit
            </button>
          </div>
        </form>
      </Tab>
      {/* ---------------------------------- */}
      <Tab eventKey="withdraw" title="Withdraw" className="bg-dark small">
        <table className="table table-dark table-sm small">
          <thead>
            <tr>
              <th>Token</th>
              <th>Wallet</th>
              <th>Exchange</th>
            </tr>
          </thead>
          {rendorTokenAndAmount("ETH", etherBalance, exchangeEtherBalance)}
        </table>
        <form
          className="row"
          onSubmit={(event) => {
            event.preventDefault();
            withdrawEther(
              dispatch,
              exchange,
              web3,
              etherWithdrawAmount,
              account
            );
          }}
        >
          <div className="col-12 col-sm pr-sm-2">
            <input
              type="text"
              placeholder="ETH Amount"
              onChange={(e) =>
                dispatch(setEtherWithdrawAmountChanged(e.target.value))
              }
              className="form-control form-control-sm bg-dark text-white"
              required
            />
          </div>
          <div className="col-12 col-sm-auto pl-sm-0">
            <button type="submit" className="btn btn-primary btn-block btn-sm">
              Withdraw
            </button>
          </div>
        </form>

        <table className="table table-dark table-sm small">
            {rendorTokenAndAmount("DAPP", tokenBalance, exchangeTokenBalance)}
        </table>

        <form
          className="row"
          onSubmit={(event) => {
            event.preventDefault();
            withdrawToken(
              dispatch,
              exchange,
              tokenContract,
              web3,
              tokenWithdrawAmount,
              account
            );
          }}
        >
          <div className="col-12 col-sm pr-sm-2">
            <input
              type="text"
              placeholder="DAPP Amount"
              onChange={(e) =>
                dispatch(setTokenWithdrawAmountChanged(e.target.value))
              }
              className="form-control form-control-sm bg-dark text-white"
              required
            />
          </div>
          <div className="col-12 col-sm-auto pl-sm-0">
            <button type="submit" className="btn btn-primary btn-block btn-sm">
              Withdraw
            </button>
          </div>
        </form>
      </Tab>
    </Tabs>
  );
};

const rendorTokenAndAmount = (
  symbol,
  walletTokenBalance,
  exchangeTokenBalance
) => {
  return (
    <tbody>
      <tr>
        <td>{symbol}</td>
        <td>{walletTokenBalance}</td>
        <td>{exchangeTokenBalance}</td>
      </tr>
    </tbody>
  );
};

const depositEther = (dispatch, exchange, web3, amount, account) => {
  exchange.methods
    .depositEther()
    .send({ from: account, value: web3.utils.toWei(amount, "ether") })
    .on("transactionHash", (hash) => {
      dispatch(setBalancesLoading(true));
    })
    .on("error", (error) => {
      console.error(error);
      window.alert("There was an error #");
    });
};

const withdrawEther = (dispatch, exchange, web3, amount, account) => {
  exchange.methods
    .withdrawEther(web3.utils.toWei(amount, "ether"))
    .send({ from: account })
    .on("transactionHash", (hash) => {
      dispatch(setBalancesLoading(true));
    })
    .on("error", (error) => {
      console.error(error);
      window.alert("There was an error #");
    });
};

const depositToken = (dispatch, exchange, web3, token, amount, account) => {
  amount = web3.utils.toWei(amount, "ether");
  token.methods
    .approve(exchange.options.address, amount)
    .send({ from: account })
    .on("transactionHash", (hash) => {
        console.log('hash1',hash);
      exchange.methods
        .depositToken(token.options.address, amount)
        .send({ from: account })
        .on("transactionHash", (hash) => {
          dispatch(setBalancesLoading(true));
        })
        .on("error", (error) => {
          console.error(error);
          window.alert("There was an error #");
        });
    });
};

const withdrawToken = (dispatch, exchange, token, web3, amount, account) => {
    console.log('wei',amount);
    console.log('ether', web3.utils.toWei(amount, "ether"));
    exchange.methods
      .withdrawToken(token.options.address, web3.utils.toWei(amount, "ether"))
      .send({ from: account })
      .on("transactionHash", (hash) => {
        dispatch(setBalancesLoading(true));
      })
      .on("error", (error) => {
        console.error(error);
        window.alert("There was an error #");
      });
  };

const loadBalances = async (dispatch, web3, exchange, token, account) => {
  if (typeof account !== "undefined") {
    // Ether balance in wallet
    const etherBalance = await web3.eth.getBalance(account);
    dispatch(setEtherBalance(formatBalance(etherBalance)));

    // Token balance in wallet
    const tokenBalance = await token.methods.balanceOf(account).call();
    dispatch(setTokenBalance(formatBalance(tokenBalance)));

    // Ether balance in exchange
    const exchangeEtherBalance = await exchange.methods
      .balanceOf(ETHER_ADDRESS, account)
      .call();
    dispatch(setExchangeEtherBalance(formatBalance(exchangeEtherBalance)));

    // Token balance in exchange
    const exchangeTokenBalance = await exchange.methods
      .balanceOf(token.options.address, account)
      .call();
    dispatch(setExchangeTokenBalance(formatBalance(exchangeTokenBalance)));

    // Trigger all balances loaded
    dispatch(setBalancesLoaded(true));
  }
};
