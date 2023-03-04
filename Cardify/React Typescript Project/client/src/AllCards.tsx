import axios from "axios";
import React from "react";
import "./AllCards.css";
import Card from "./Card";

export default function AllCards() {
  const [cards, setCards] = React.useState<Array<number>>([]);
  const [search, setSearch] = React.useState<string>("");
  React.useEffect(() => {
    axios
      .get(`http://${window.location.hostname}:3001/api/cards/cards`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setCards(res.data.cards);
      });
  }, []);

  return (
    <>
      <div style={{ height: "66px" }}></div>
      {cards.length != 0 ? (
        <div style={{ display: "flex", width: "100%", justifyContent: "center", gap: "8px" }}>
          <input
            type="text"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <button
            onClick={() => {
              if (search.length == 0) {
                axios
                  .get(`http://${window.location.hostname}:3001/api/cards/cards`, {
                    withCredentials: true,
                    headers: {
                      "Content-Type": "application/json",
                    },
                  })
                  .then((res) => {
                    setCards(res.data.cards);
                  });
              } else {
                axios
                  .get(`http://${window.location.hostname}:3001/api/cards/find/${search}`, {
                    withCredentials: true,
                    headers: {
                      "Content-Type": "application/json",
                    },
                  })
                  .then((res) => {
                    setCards(res.data.cards);
                  });
              }
            }}
            style={{ borderRadius: "5px", padding: "4px" }}
          >
            Search
          </button>
        </div>
      ) : (
        <></>
      )}
      <div className="cards">
        {cards.length != 0 ? (
          cards.map((card: number) => <Card cardID={card} key={card} />)
        ) : (
          <>
            <p style={{ fontSize: "42px", fontWeight: "600" }}>No one created cards yet.</p>
          </>
        )}
      </div>
    </>
  );
}
