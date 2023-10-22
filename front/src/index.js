import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { ColorContextProvider } from './colormode/colorMode';
import authReducer from './actions';
import Routing from './Routing';

const rootReducer = combineReducers({
  auth: authReducer,
});

export const store = createStore(rootReducer);

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ColorContextProvider>
      <Provider store={store}>
        <Router>
          <Routing /> 
        </Router>
      </Provider>
    </ColorContextProvider>
  </React.StrictMode>
);
