import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Main from "./Main";
import Navbar from "./Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./About";
import axios from "axios";
// import Home from "./Home";
import AllCards from "./AllCards";
import MyCards from "./MyCards";
import NewCard from "./NewCard";
import CardPage from "./CardPage";
import UserInterface from "./interfaces/User";

export const User = React.createContext<UserInterface | boolean>(false);
function App() {
  const [loggedUser, setLoggedUser] = React.useState<UserInterface | boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  React.useEffect(() => {
    axios
      .get(`http://${window.location.hostname}:3001/api/auth/user`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.length != 0) {
          setLoggedUser(res.data);
        }
      });
    setLoading(false);
  }, []);

  if (!loading) {
    return (
      <User.Provider value={loggedUser}>
        <BrowserRouter>
          <Navbar setLoggedUser={setLoggedUser} />
          <Routes>
            <Route index element={loggedUser ? <AllCards /> : <Main setLoggedUser={setLoggedUser} />} />
            <Route path="about" element={<About />} />
            <Route path="allcards" element={<AllCards />} />
            <Route path="mycards" element={loggedUser ? <MyCards loggedUser={loggedUser} /> : <Main setLoggedUser={setLoggedUser} />} />
            <Route path="newcard" element={loggedUser ? <NewCard /> : <Main setLoggedUser={setLoggedUser} />} />
            <Route path="card/:id" element={<CardPage />} />
            <Route path="*" element={loggedUser ? <AllCards /> : <Main setLoggedUser={setLoggedUser} />} />
          </Routes>
        </BrowserRouter>
      </User.Provider>
    );
  } else {
    return <></>;
  }
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
