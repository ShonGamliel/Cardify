import "./NewCard.css";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { User } from "./index";
import UserInterface from "./interfaces/User";

export default function NewCard(): any {
  const loggedUser = React.useContext<UserInterface | boolean>(User);
  const navigate = useNavigate();

  const [name, setName] = React.useState<string>();
  const [description, setDescription] = React.useState<string>();
  const [address, setAddress] = React.useState<string>();
  const [phone, setPhone] = React.useState<string>();
  const [whatsapp, setWhatsapp] = React.useState<string>();
  const [website, setWebsite] = React.useState<string>();
  const [email, setEmail] = React.useState<string>();
  const [images, setImages] = React.useState<any>();
  const [error, setError] = React.useState<string | boolean>(false);

  let errorTimer: ReturnType<typeof setTimeout>;

  const newError = (msg: string) => {
    setError(msg);
    if (error) clearTimeout(errorTimer);
    errorTimer = setTimeout(() => {
      setError(false);
    }, 6000);
  };

  const isEmail = (email: string) => {
    if (!/^[a-zA-Z0-9.+_~@-]+$/.test(email)) return false;
    if (email.search("@") == 0 || email.search("@") == email.length - 1) return false;
    if (email.slice(email.search("@")).search(/\./) == -1 || email.slice(email.search("@")).search(/\./) == 1 || email.slice(email.search("@")).search(/\./) == email.slice(email.search("@")).length - 1) return false;
    return true;
  };

  const isWebsite = (site: string) => {
    if (site.slice(0, 4) != "www.") return false;
    if (site.slice(-7).indexOf(".") == -1) return false;
    if (site.indexOf("..") != -1) return false;
    if (site.indexOf("//") != -1) return false;
    if (site.indexOf("\\") != -1) return false;
    return true;
  };

  const isPhone = (number: string) => {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(number);
  };

  if (typeof loggedUser != "boolean" && loggedUser.businessAccount == false && loggedUser.cards.length != 0) {
    return (
      <div className="cards">
        <p style={{ fontSize: "38px", fontWeight: "600", marginTop: "40px", textAlign: "center" }}>Non-business accounts can create only one card</p>
      </div>
    );
  } else {
    return (
      <>
        {error ? (
          <div className="error-box" style={{ backgroundColor: "rgba(255, 141, 141, 1)", fontWeight: "700" }}>
            {error}
          </div>
        ) : (
          <></>
        )}
        <div id="newcard-fullscreen">
          <form
            id="newcard-form"
            encType="multipart/form-data"
            onSubmit={(e) => {
              e.preventDefault();

              if (!name) return newError("business's name missing");
              if (name.length > 30) return newError("business's name too long [max 30 characters]");
              if (!description) return newError("business's description missing");
              if (description.length > 120) return newError("business's description too long [max 120 characters]");
              if (!address) return newError("business's address missing");
              if (address.length > 50) return newError("business's description too long [max 50 characters]");
              if (!phone) return newError("business's phone missing");
              if (!isPhone(phone)) return newError("phone invalid, only number and optional + sign");
              if (phone.length > 50) return newError("business's phone too long [max 50 characters]");
              if (!whatsapp) return newError("business's whatsapp missing");
              if (!isPhone(whatsapp)) return newError("whatsapp invalid, only number and optional + sign");
              if (whatsapp.length > 50) return newError("business's whatsapp too long [max 50 characters]");
              if (!website) return newError("business's phone missing");
              if (!isWebsite(website)) return newError("website invalid");
              if (website.length > 120) return newError("business's website too long [max 120 characters]");
              if (!email) return newError("business's email missing");
              if (!isEmail(email)) return newError("business's email not valid");
              if (email.length > 50) return newError("business's email too long [max 50 characters]");
              if (!images) return newError("card must have at least one business's image");

              // console.log(images);
              axios({
                method: "post",
                url: `http://${window.location.hostname}:3001/api/cards/addcard`,
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
                data: {
                  name: name,
                  description: description,
                  address: address,
                  phone: phone,
                  whatsapp: whatsapp,
                  website: website,
                  email: email,
                  images: Array.from(images),
                },
              }).then((res) => {
                if (res.data.error) {
                  newError(res.data.msg);
                } else {
                  setTimeout(() => navigate("/allcards"), 100);
                }
              });
            }}
          >
            <div id="newcard-form-title">Your New Card</div>
            <div className="divider"></div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <img className="newcard-icon" src="./images/business_icon.png" alt="" style={{ minHeight: "24px" }} />
              <input className="newcard-input" type="text" name="name" placeholder="Business Name" onChange={(e) => setName(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <img className="newcard-icon" src="./images/description_icon.png" alt="" />
              <input className="newcard-input" type="text" name="description" placeholder="Business Desription" onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <img className="newcard-icon" src="./images/location_icon.png" alt="" />
              <input className="newcard-input" type="text" name="address" placeholder="Address" onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <img className="newcard-icon" src="./images/phone_icon.png" alt="" />
              <input className="newcard-input" type="text" name="phone" placeholder="Phone" onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <img className="newcard-icon" src="./images/whatsapp_icon.png" alt="" />
              <input className="newcard-input" type="text" name="whatsapp" placeholder="WhatsApp" onChange={(e) => setWhatsapp(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <img className="newcard-icon" src="./images/web_icon.png" alt="" />
              <input className="newcard-input" type="text" name="website" placeholder="WebSite" onChange={(e) => setWebsite(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <img className="newcard-icon" src="./images/email_icon.png" alt="" />
              <input className="newcard-input" type="text" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <img className="newcard-icon" src="./images/image_icon.png" alt="" />
              <input className="newcard-input" type="file" name="images" placeholder="Images" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} />
            </div>
            <div className="divider"></div>
            <button type="submit">Create</button>
          </form>
        </div>
      </>
    );
  }
}
