import React from 'react'
import { Balance } from './Balance'
import { MyTransactions } from './MyTransactions'
import { Orderbook } from './Orderbook'
import { PriceChart } from './PriceChart'
import { Trades } from './Trades'

export const Content = () => {
    
  return (
    <div className="content">
          <div className="vertical-split">
            <Balance/>
            <div className="card bg-dark text-white">
              <div className="card-header">
                Card Title 2
              </div>
              <div className="card-body">
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>
          </div>
          <Orderbook/>
          <div className="vertical-split">
            <PriceChart/>
            <MyTransactions/>
          </div>
          <Trades/>
        </div>
  )
}
