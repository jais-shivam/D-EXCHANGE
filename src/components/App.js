import React from 'react';
import './App.css';
import {useSelector } from 'react-redux';
import { selectTokenContract } from '../store/tokenSlice';
import { selectExchangeContract } from '../store/exchangeSlice';
import { Navbar } from './Navbar';
import { Content } from './Content';
import { SmartContractInteraction } from './SmartContractInteraction';



const App = () => {
  
  const tokenContract=useSelector(selectTokenContract);
  const exchangeContract= useSelector(selectExchangeContract)
  
  
  return (
    <div>
      <SmartContractInteraction/>
        <Navbar/>
        {tokenContract && exchangeContract? <Content/> :''}
    </div>
  )
}

export default App
