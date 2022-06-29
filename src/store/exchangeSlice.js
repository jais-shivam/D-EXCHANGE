import { createSlice } from '@reduxjs/toolkit';

export const exchangeSlice= createSlice({
    name: 'exchange',
    initialState:{
       contract:{},
       cancelledOrderLoaded:[],
       filledOrdersLoaded:[],
       allOrders:[],
       openOrder:[]
    },
    reducers:{
        setExchangeContract: (state,action)=>{
            state.contract=action.payload;
        },
        setCancelledOrdersLoaded: (state,action)=>{
            state.cancelledOrderLoaded=action.payload;
        },
        setFilledOrdersLoaded: (state,action)=>{
            state.filledOrdersLoaded=action.payload;
        },
        setAllOrdersLoaded: (state,action)=>{
            state.allOrders=action.payload;
        },
        setOpenOrder: (state,action)=>{
            state.openOrder=action.payload;
        },
    }
});

export const {
    setExchangeContract,
    setCancelledOrdersLoaded, 
    setFilledOrdersLoaded, 
    setAllOrdersLoaded,
    setOpenOrder
}= exchangeSlice.actions;
export default exchangeSlice.reducer;

export const selectExchangeContract=(state)=> state.exchange.contract;
export const selectCancelledOrdersLoaded=(state)=> state.exchange.cancelledOrderLoaded;
export const selectFilledOrdersLoaded=(state)=> state.exchange.filledOrdersLoaded;
export const selectAllOrdersLoaded=(state)=> state.exchange.allOrders;
export const selectOpenOrder=(state)=> state.exchange.openOrder;