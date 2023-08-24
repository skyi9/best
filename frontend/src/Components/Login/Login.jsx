import "./login.css";
import { useDispatch } from "react-redux";
import { loginUser } from "../../Redux/Actions/User";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const login = (e) => {
    e.preventDefault();
    dispatch(loginUser(email, password));
    console.log(email, password);
  };

  return (
    <div>
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={login}>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              type="emal"
              placeholder="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              placeholder="password"
              value={password}
              autoComplete="false"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="login-button" type="submit">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
