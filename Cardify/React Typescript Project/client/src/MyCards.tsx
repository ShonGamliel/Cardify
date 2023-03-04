import Card from "./Card";
import UserInterface from "./interfaces/User";

interface MyCardsProps {
  loggedUser: UserInterface | boolean;
}

export default function MyCards({ loggedUser }: MyCardsProps) {
  return (
    <>
      <div style={{ height: "66px" }}></div>
      <div className="cards">
        {typeof loggedUser != "boolean" && loggedUser.cards.length != 0 ? (
          loggedUser.cards.map((card: number) => <Card cardID={card} key={card} />)
        ) : (
          <>
            <p style={{ fontSize: "42px", fontWeight: "600" }}>You didn't create cards yet.</p>
          </>
        )}
      </div>
    </>
  );
}
