import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppLayout from "./AppLayout";
import "./App.css";
import { Provider } from "react-redux";
import store from "./store/configureStore";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppLayout />
      </Router>
    </Provider>
  );
};

export default App;
