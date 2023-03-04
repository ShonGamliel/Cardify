import React from "react";
import { useParams } from "react-router-dom";
import Card from "./Card";

export default function CardPage() {
  let { id } = useParams();
  let cardid: number = parseInt(id!);
  return (
    <>
      <div style={{ height: "66px" }}></div>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Card cardID={cardid} />
      </div>
    </>
  );
}
