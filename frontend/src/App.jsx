import Header from "./Components/Header/Header";
import Login from "./Components/Login/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

function App() {
  const { isAuthenticated } = useSelector((state) => state.user);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Header /> : <Login />} />
          {/* <Route path="/" element={<Login />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
