import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import { StoreProvider } from "./Store/data";
import "antd/dist/antd.css";
import Menu from "./Components/Menu/Menu";
import { Divider } from "../node_modules/antd/lib/index";
import HomePage from "./Components/HomePage/HomePage";
import { Route, Routes } from "react-router-dom";
import Account from "./Components/Account/Account";
import NotFound from "./Components/NotFound";

function App() {
  return (
    <StoreProvider>
      <div className="App">
        <Navbar />
        <Divider style={{ margin: "0" }} />
        <Menu />
        <Divider style={{ margin: "0" }} />
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/account" element={<Account />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </div>
    </StoreProvider>
  );
}

export default App;
