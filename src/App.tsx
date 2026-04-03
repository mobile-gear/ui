import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import AppRoutes from "./routes/index";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div data-test="app-container" className="min-h-screen bg-gray-100">
        <Navbar />
        <AppRoutes />
      </div>
    </Provider>
  );
};

export default App;
