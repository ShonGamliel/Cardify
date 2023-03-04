import React from "react";
import "./Card.css";
import axios from "axios";

import { User } from "./index";
import CardInterface from "./interfaces/Card";
import UserInterface from "./interfaces/User";

interface CardProps {
  cardID: number;
}

function Card({ cardID }: CardProps) {
  const [card, setCard] = React.useState<CardInterface>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const loggedUser = React.useContext<UserInterface | boolean>(User);
  const [editInput, setEditInput] = React.useState<number>(0);
  const [cardDeleted, setCardDeleted] = React.useState(false);
  const [deleteDialog, setDeleteDialog] = React.useState(false);

  const removeCard = () => {
    setCardDeleted(true);
    axios({
      method: "post",
      url: `http://${window.location.hostname}:3001/api/cards/card/${cardID}/remove`,
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    }).then((res: any) => {
      console.log(res.data);
    });
  };

  const handleEdit = (e: any, prop_num: number) => {
    setEditInput(0);
    let value = e.target.innerText;

    let data = {};
    if (prop_num == 1) data = { name: value };
    else if (prop_num == 2) data = { description: value };
    else if (prop_num == 3) data = { phone: value };
    else if (prop_num == 4) data = { whatsapp: value };
    else if (prop_num == 5) data = { address: value };
    else if (prop_num == 6) data = { email: value };
    else if (prop_num == 7) data = { website: value };
    axios({
      method: "post",
      url: `http://${window.location.hostname}:3001/api/cards/card/${cardID}/${prop_num}`,
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
      data: data,
    }).then((res: any) => {
      console.log(res.data);
      if (res.data.error) {
        if (prop_num == 1) e.target.innerText = card!.name;
        else if (prop_num == 2) e.target.innerText = card!.description;
        else if (prop_num == 3) e.target.innerText = card!.phone;
        else if (prop_num == 4) e.target.innerText = card!.whatsapp;
        else if (prop_num == 5) e.target.innerText = card!.address;
        else if (prop_num == 6) e.target.innerText = card!.email;
        else if (prop_num == 7) e.target.innerText = card!.website;
      }
    });
  };

  React.useEffect(() => {
    axios
      .get(`http://${window.location.hostname}:3001/api/cards/card/${cardID}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setCard(res.data);
        setLoading(false);
      });
  }, []);
  if (card && !loading && !cardDeleted) {
    return (
      <>
        {deleteDialog ? (
          <div className="remove-dialog" style={{ top: 0, zIndex: 9999, position: "fixed", backgroundColor: "rgba(0,0,0,0.6)", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div className="remove-confirmation" style={{ gap: "16px", backgroundColor: "white", padding: "16px", borderRadius: "10px", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
              Are you sure you want to delete this card?
              <div style={{ display: "flex", gap: "16px" }}>
                <button style={{ borderRadius: "6px", padding: "4px 8px 4px 8px", cursor: "pointer", backgroundColor: "grey" }} onClick={() => setDeleteDialog(false)}>
                  Cancle
                </button>
                <button style={{ borderRadius: "6px", padding: "4px 8px 4px 8px", cursor: "pointer", backgroundColor: "red" }} onClick={() => removeCard()}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="card">
          {typeof loggedUser != "boolean" && card.userid == loggedUser.userid ? (
            <div style={{ display: "flex", gap: 18, alignSelf: "flex-end" }}>
              <img src="./images/trash_icon.png" alt="" style={{ width: 18, height: 18, cursor: "pointer" }} onClick={() => setDeleteDialog(true)} />
            </div>
          ) : (
            <></>
          )}
          <a href={`http://localhost:3000/card/${cardID}`} style={{ display: "flex", justifyContent: "center" }}>
            <img className="card-image" alt="" src={`http://${window.location.hostname}:3001/static/cards/${card.images[0]}`}></img>
          </a>
          <div className="divider"></div>
          <div className="card-title">
            <div className="card-name icon-relative">
              {typeof loggedUser != "boolean" && card.userid == loggedUser.userid ? <img onClick={() => setEditInput(1)} className="edit-icon" src="./images/edit_icon.png" alt="" style={{ width: 14, height: 14, cursor: "pointer" }} /> : <></>}
              <div suppressContentEditableWarning={true} contentEditable={editInput == 1 ? "true" : "false"} spellCheck="false" onBlur={(e) => handleEdit(e, 1)}>
                {card.name}
              </div>
            </div>

            <div className="card-description icon-relative">
              {typeof loggedUser != "boolean" && card.userid == loggedUser.userid ? <img onClick={() => setEditInput(2)} className="edit-icon" src="./images/edit_icon.png" alt="" style={{ width: 14, height: 14, cursor: "pointer" }} /> : <></>}
              <div suppressContentEditableWarning={true} contentEditable={editInput == 2 ? "true" : "false"} spellCheck="false" onBlur={(e) => handleEdit(e, 2)}>
                {card.description}
              </div>
            </div>
          </div>
          <div className="divider"></div>
          <div className="card-contact">
            <div className="card-contact-way">
              <img className="card-contact-way-icon" src="./Images/phone_icon.png" alt="" />
              <div className="card-contact-way-text icon-relative">
                {typeof loggedUser != "boolean" && card.userid == loggedUser.userid ? <img onClick={() => setEditInput(3)} className="edit-icon" src="./images/edit_icon.png" alt="" style={{ width: 14, height: 14, cursor: "pointer" }} /> : <></>}
                <div suppressContentEditableWarning={true} contentEditable={editInput == 3 ? "true" : "false"} spellCheck="false" onBlur={(e) => handleEdit(e, 3)}>
                  {card.phone}
                </div>
              </div>
            </div>
            <div className="card-contact-way">
              <img className="card-contact-way-icon" src="./Images/whatsapp_icon.png" alt="" />
              <div className="card-contact-way-text icon-relative">
                {typeof loggedUser != "boolean" && card.userid == loggedUser.userid ? <img onClick={() => setEditInput(4)} className="edit-icon" src="./images/edit_icon.png" alt="" style={{ width: 14, height: 14, cursor: "pointer" }} /> : <></>}
                <div suppressContentEditableWarning={true} contentEditable={editInput == 4 ? "true" : "false"} spellCheck="false" onBlur={(e) => handleEdit(e, 4)}>
                  {card.whatsapp}
                </div>
              </div>
            </div>
            <div className="card-contact-way">
              <img className="card-contact-way-icon" src="./Images/location_icon.png" alt="" />
              <div className="card-contact-way-text icon-relative">
                {typeof loggedUser != "boolean" && card.userid == loggedUser.userid ? <img onClick={() => setEditInput(5)} className="edit-icon" src="./images/edit_icon.png" alt="" style={{ width: 14, height: 14, cursor: "pointer" }} /> : <></>}
                <div suppressContentEditableWarning={true} contentEditable={editInput == 5 ? "true" : "false"} spellCheck="false" onBlur={(e) => handleEdit(e, 5)}>
                  {card.address}
                </div>
              </div>
            </div>
            <div className="card-contact-way">
              <img className="card-contact-way-icon" src="./Images/email_icon.png" alt="" />
              <div className="card-contact-way-text icon-relative">
                {typeof loggedUser != "boolean" && card.userid == loggedUser.userid ? <img onClick={() => setEditInput(6)} className="edit-icon" src="./images/edit_icon.png" alt="" style={{ width: 14, height: 14, cursor: "pointer" }} /> : <></>}
                <div suppressContentEditableWarning={true} contentEditable={editInput == 6 ? "true" : "false"} spellCheck="false" onBlur={(e) => handleEdit(e, 6)}>
                  {card.email}
                </div>
              </div>
            </div>
          </div>
          <div className="divider"></div>
          <div className="icon-relative">
            {typeof loggedUser != "boolean" && card.userid == loggedUser.userid ? <img onClick={() => setEditInput(7)} className="edit-icon" src="./images/edit_icon.png" alt="" style={{ width: 14, height: 14, cursor: "pointer" }} /> : <></>}
            <a target="_blank" href={"//" + card.website} suppressContentEditableWarning={true} contentEditable={editInput == 7 ? "true" : "false"} spellCheck="false" onBlur={(e) => handleEdit(e, 7)}>
              {card.website}
            </a>
          </div>
        </div>
      </>
    );
  } else {
    return <></>;
  }
}

export default Card;
