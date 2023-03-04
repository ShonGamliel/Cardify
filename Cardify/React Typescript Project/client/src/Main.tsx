import React from "react";
import "./Main.css";
import axios from "axios";
import UserInterface from "./interfaces/User";

interface MainProps {
  setLoggedUser: React.Dispatch<React.SetStateAction<UserInterface | boolean>>;
}

function Main({ setLoggedUser }: MainProps) {
  const [email, setEmail] = React.useState<string>();
  const [name, setName] = React.useState<string>();
  const [password, setPassword] = React.useState<string>();
  const [loginemail, setLoginEmail] = React.useState<string>();
  const [loginpassword, setLoginPassword] = React.useState<string>();
  const [error, setError] = React.useState<string | boolean>(false);
  const businessCheckbox = React.useRef<any>();

  return (
    <div id="main-screen" className="fullscreen">
      {error ? <div className="error-box">{error}</div> : <></>}

      <div className="fullscreen-blur">
        <div className="fullscreen-center">
          <input id="main-checkbox" type="checkbox" />

          <form
            onSubmit={(event) => {
              event.preventDefault();
              axios({
                method: "post",
                url: `http://${window.location.hostname}:3001/api/auth/register`,
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
                data: {
                  email: email,
                  name: name,
                  password: password,
                  business: businessCheckbox.current.checked,
                },
              }).then((res) => {
                if (res.data.error) {
                  setError(res.data.msg);
                  setTimeout(() => setError(false), 6000);
                } else {
                  setLoggedUser(res.data);
                }
              });
            }}
            id="register-form"
            className="main-form"
          >
            <div id="main-logo">Cardify</div>
            <input type="text" placeholder="Email" name="email" onChange={(e) => setEmail(e.target.value)} />
            <input type="text" placeholder="Name" name="name" onChange={(e) => setName(e.target.value)} />
            <input type="password" placeholder="Password" name="password" onChange={(e) => setPassword(e.target.value)} />
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <input ref={businessCheckbox} type="checkbox" name="business" id="business" style={{ width: 15 }} />
              <label htmlFor="business" style={{ cursor: "pointer", color: "white" }}>
                I want to register as a business account
              </label>
            </div>
            <button type="submit">Register</button>
            <label htmlFor="main-checkbox">Already have an account?</label>
          </form>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              axios({
                method: "post",
                url: `http://${window.location.hostname}:3001/api/auth/login`,
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
                data: {
                  email: loginemail,
                  password: loginpassword,
                },
              }).then((res) => {
                if (res.data.error) {
                  setError(res.data.msg);
                  setTimeout(() => setError(false), 6000);
                } else {
                  setLoggedUser(res.data);
                }
              });
            }}
            id="login-form"
            className="main-form"
          >
            <div id="main-logo">Cardify</div>
            <input type="text" placeholder="Email" name="email" onChange={(e) => setLoginEmail(e.target.value)} />
            <input type="password" placeholder="Password" name="password" onChange={(e) => setLoginPassword(e.target.value)} />
            <button type="submit">Login</button>
            <label htmlFor="main-checkbox">Don't have an account?</label>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Main;
