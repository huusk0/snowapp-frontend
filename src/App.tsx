import "./App.css";
import { HomePage_v0 } from "./pages/homePagev0";
import { Routes, Route, Link } from "react-router-dom";
const App = () => {
  return (
    <>
      <h1>SnowApp</h1>
      <Link to="/">
        <button>Home</button>
      </Link>
      <Link to="/version0">
        <button>Version 0</button>
      </Link>
      <Routes>
        <Route path="/" element={<div>Hello home page</div>} />
        <Route path="/version0" element={<HomePage_v0 />} />
      </Routes>
    </>
  );
};

export default App;
