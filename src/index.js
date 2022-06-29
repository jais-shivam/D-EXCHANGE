import React from "react";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.css";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import store from './store/store';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
// After
// import { createRoot } from 'react-dom/client';
const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <Provider store={store}>
    <App tab="home" />
   </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
