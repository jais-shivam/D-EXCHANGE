import React from 'react'
import { Balance } from './Balance'
import { MyTransactions } from './MyTransactions'
import { NewOrder } from './NewOrder'
import { Orderbook } from './Orderbook'
import { PriceChart } from './PriceChart'
import { Trades } from './Trades'

export const Content = () => {
    
  return (
    <div className="content">
          <div className="vertical-split">
            <Balance/>
            <NewOrder/>
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
