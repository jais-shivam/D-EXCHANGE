import { createSlice } from '@reduxjs/toolkit';

export const exchangeSlice= createSlice({
    name: 'exchange',
    initialState:{
       contract:{},
       cancelledOrderLoaded:[],
       filledOrdersLoaded:[],
       allOrders:[],
       openOrder:[],
       orderCancelling:false,
       orderCancelled:null,
       orderFilling:false,
       orderFilled:null
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
        setOrderCancelling:(state,action)=>{
            state.orderCancelling=action.payload;
        },
        setOrderCancelled:(state,action)=>{
            // state.orderCancelling=false;
            state.cancelledOrderLoaded=[...state.cancelledOrderLoaded,action.payload];
        },
        setOrderFilling:(state,action)=>{
            state.orderFilling=action.payload;
        },
        setOrderFilled:(state,action)=>{
            console.log('action.payload',action.payload.id);
            let data;
            const index=state.filledOrdersLoaded.findIndex(order=>order.id===action.payload.id);
            if(index===-1){
                state.filledOrdersLoaded=[...state.filledOrdersLoaded,action.payload]
            }else{
                // state.filledOrdersLoaded=state.filledOrdersLoaded
            }
            // state.filledOrdersLoaded=[...state.filledOrdersLoaded, data];
        },
    }
});

export const {
    setExchangeContract,
    setCancelledOrdersLoaded, 
    setFilledOrdersLoaded, 
    setAllOrdersLoaded,
    setOpenOrder,
    setOrderCancelling,
    setOrderCancelled,
    setOrderFilling,
    setOrderFilled
}= exchangeSlice.actions;
export default exchangeSlice.reducer;

export const selectExchangeContract=(state)=> state.exchange.contract;
export const selectCancelledOrdersLoaded=(state)=> state.exchange.cancelledOrderLoaded;
export const selectFilledOrdersLoaded=(state)=> state.exchange.filledOrdersLoaded;
export const selectAllOrdersLoaded=(state)=> state.exchange.allOrders;
export const selectOpenOrder=(state)=> state.exchange.openOrder;
export const selectOrderCancelling=(state)=> state.exchange.orderCancelling;
export const selectOrderCancelled=(state)=> state.exchange.orderCancelled;
export const selectOrderFilling=(state)=> state.exchange.orderFilling;
export const selectOrderFilled=(state)=> state.exchange.orderFilled;
