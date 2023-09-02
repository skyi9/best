import Header from "./Components/Header/Header";
import Login from "./Components/Login/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "./Redux/Actions/User";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
  }, []);

  const { isAuthenticated } = useSelector((state) => state.user);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Header /> : <Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
