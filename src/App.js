import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import { StoreProvider } from "./Store/data";
import "antd/dist/antd.css";
import Menu from "./Components/Menu/Menu";
import { Divider } from "../node_modules/antd/lib/index";
import HomePage from "./Components/HomePage/HomePage";

function App() {
  return (
    <StoreProvider>
      <div className="App">
        <Navbar />
        <Divider style={{ margin: "0" }} />
        <Menu />
        <Divider style={{ margin: "0" }} />
        <HomePage />
      </div>
    </StoreProvider>
  );
}

export default App;
