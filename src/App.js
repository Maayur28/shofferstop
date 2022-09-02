import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import { StoreProvider } from "./Store/data";
import "antd/dist/antd.min.css";
import Menu from "./Components/Menu/Menu";
import { Divider } from "../node_modules/antd/lib/index";
import HomePage from "./Components/HomePage/HomePage";
import { Route, Routes } from "react-router-dom";
import Account from "./Components/Account/Account";
import NotFound from "./Components/NotFound";
import PLP from "./Components/Product/PLP/PLP";
import PDP from "./Components/Product/PDP/PDP";
import Cart from "./Components/Cart/Cart";

function App() {
  return (
    <StoreProvider>
      <div className="App">
        <Navbar />
        <Divider style={{ margin: "0px 0px 5px 0px" }} />
        <Menu />
        <Divider style={{ margin: "0px 0px 10px 0px" }} />
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/account" element={<Account />}></Route>
          <Route exact path="/category/:categoryId" element={<PLP />} />
          <Route exact path="/search/:searchId" element={<PLP />} />
          <Route exact path="/:productId" element={<PDP />} />
          <Route exact path="/cart" element={<Cart />} />
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </div>
    </StoreProvider>
  );
}

export default App;
