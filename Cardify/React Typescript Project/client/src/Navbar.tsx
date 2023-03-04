import React from "react";
import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { User } from "./index";
import axios from "axios";
import UserInterface from "./interfaces/User";

interface NavbarProps {
  setLoggedUser: React.Dispatch<React.SetStateAction<UserInterface | boolean>>;
}

function Navbar({ setLoggedUser }: NavbarProps) {
  const loggedUser = React.useContext(User);
  const path = useLocation();

  return (
    <>
      <nav id="navbar">
        <div id="nav-logo">Cardify</div>
        <div id="nav-links-icons">
          <Link to="/about" style={{ filter: path.pathname == "/about" ? "invert(100%)" : "invert(70%)" }}>
            <img className="nav-link-icon" src="./images/about_icon.png" alt="" />
          </Link>
          <Link to="/allcards" style={{ filter: path.pathname == "/allcards" ? "invert(100%)" : "invert(70%)" }}>
            <img className="nav-link-icon" src="./images/allcards_icon.png" alt="" />
          </Link>
          {loggedUser ? (
            <>
              <Link to="/newcard" style={{ filter: path.pathname == "/newcard" ? "invert(100%)" : "invert(70%)" }}>
                <img className="nav-link-icon" src="./images/add_icon.png" alt="" />
              </Link>
              <Link to="/mycards" style={{ filter: path.pathname == "/mycards" ? "invert(100%)" : "invert(70%)" }}>
                <img className="nav-link-icon" src="./images/mycards_icon.png" alt="" />
              </Link>
            </>
          ) : (
            <></>
          )}
        </div>
        <div id="nav-links">
          <Link to="/about" style={{ color: path.pathname == "/about" ? "white" : "grey" }}>
            About Us
          </Link>
          <Link to="/allcards" style={{ color: path.pathname == "/allcards" ? "white" : "grey" }}>
            All Cards
          </Link>
          {loggedUser ? (
            <>
              <Link to="/newcard" style={{ color: path.pathname == "/newcard" ? "white" : "grey" }}>
                New Card
              </Link>
              <Link to="/mycards" style={{ color: path.pathname == "/mycards" ? "white" : "grey" }}>
                My Cards
              </Link>
            </>
          ) : (
            <></>
          )}
        </div>
        <div id="nav-account">
          {!loggedUser ? (
            <Link to="/">Login</Link>
          ) : (
            <Link
              to="/"
              onClick={() => {
                axios({
                  method: "post",
                  url: `http://${window.location.hostname}:3001/api/auth/logout`,
                  withCredentials: true,
                  headers: { "Content-Type": "application/json" },
                }).then((res) => {
                  setLoggedUser(false);
                });
              }}
            >
              Logout
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
