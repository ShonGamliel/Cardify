const { Router } = require("express");
const Card = require("../database/schemas/card");
const User = require("../database/schemas/user");

const router = Router();

router.get("/find/:name", async (req, res) => {
    let cards = await Card.find({ name: { $regex: req.params.name, $options: "i" } });
    let cardsArray = [];
    for (let card of cards) {
        cardsArray.push(card.cardid);
    }
    res.json({ cards: cardsArray });
});

router.get("/card/:id", async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) return res.sendStatus(404);
    let cardFromDB = await Card.findOne({ cardid: id });
    if (!cardFromDB) return res.sendStatus(404);

    res.send(cardFromDB);
});

router.get("/cards", async (req, res) => {
    let cardsCount = await Card.countDocuments();
    let cardsArray = [];
    for (let i = 1; i < cardsCount + 1; i++) {
        let card = await Card.findOne({ cardid: i });
        if (!card) continue;
        cardsArray.push(i);
    }
    res.json({ cards: cardsArray });
});

function isEmail(email) {
    if (!/^[a-zA-Z0-9.+_~@-]+$/.test(email)) return false;
    if (email.search("@") == 0 || email.search("@") == email.length - 1) return false;
    if (email.slice(email.search("@")).search(/\./) == -1 || email.slice(email.search("@")).search(/\./) == 1 || email.slice(email.search("@")).search(/\./) == email.slice(email.search("@")).length - 1) return false;
    return true;
}

function isWebsite(site) {
    if (site.slice(0, 4) != "www.") return false;
    if (site.slice(-7).indexOf(".") == -1) return false;
    if (site.indexOf("..") != -1) return false;
    if (site.indexOf("//") != -1) return false;
    if (site.indexOf("\\") != -1) return false;
    return true;
}

function isPhone(number) {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(number);
}

router.post("/card/:id/remove", async (req, res) => {
    const { id } = req.params;
    if (!req.user) return res.sendStatus(401);
    if (isNaN(id)) return res.sendStatus(404);
    let cardFromDB = await Card.findOne({ cardid: id });
    if (!cardFromDB) return res.sendStatus(404);
    if (cardFromDB.userid != req.user.userid) return res.sendStatus(401);
    await Card.findOneAndRemove({ cardid: id });
    let oldUserCards = req.user.cards;
    oldUserCards = oldUserCards.filter((cardid) => cardid != parseInt(req.params.id));
    await User.updateOne({ userid: req.user.userid }, { $set: { cards: oldUserCards } });
    res.sendStatus(200);
});

router.post("/card/:id/:param", async (req, res) => {
    const { id, param } = req.params;
    const { name, description, address, phone, whatsapp, website, email } = req.body;
    if (!req.user) return res.sendStatus(401);
    if (isNaN(id)) return res.sendStatus(404);
    if (!param) return res.send("choose your parameter to edit");
    let cardFromDB = await Card.findOne({ cardid: id });
    if (!cardFromDB) return res.sendStatus(404);
    if (cardFromDB.userid != req.user.userid) return res.sendStatus(401);

    if (param == 1 && name.length < 1) return res.json({ error: true });
    if (param == 1 && name.length > 30) return res.json({ error: true });
    if (param == 2 && description.length < 1) return res.json({ error: true });
    if (param == 2 && description.length > 120) return res.json({ error: true });
    if (param == 5 && address.length < 1) return res.json({ error: true });
    if (param == 5 && address.length > 50) return res.json({ error: true });
    if (param == 3 && !isPhone(phone)) return res.json({ error: true });
    if (param == 3 && phone.length > 50) return res.json({ error: true });
    if (param == 4 && !isPhone(whatsapp)) return res.json({ error: true });
    if (param == 4 && whatsapp.length > 50) return res.json({ error: true });
    if (param == 7 && !isWebsite(website)) return res.json({ error: true });
    if (param == 7 && website.length > 120) return res.json({ error: true });
    if (param == 6 && !isEmail(email)) return res.json({ error: true });
    if (param == 6 && email.length > 50) return res.json({ error: true });

    console.log(name.length);

    if (param == 1) await Card.updateOne({ cardid: id }, { $set: { name: name } });
    else if (param == 2) await Card.updateOne({ cardid: id }, { $set: { description: description } });
    else if (param == 3) await Card.updateOne({ cardid: id }, { $set: { phone: phone } });
    else if (param == 4) await Card.updateOne({ cardid: id }, { $set: { whatsapp: whatsapp } });
    else if (param == 5) await Card.updateOne({ cardid: id }, { $set: { address: address } });
    else if (param == 6) await Card.updateOne({ cardid: id }, { $set: { email: email } });
    else if (param == 7) await Card.updateOne({ cardid: id }, { $set: { website: website } });

    res.sendStatus(200);
});

router.post("/addcard", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const { name, description, address, phone, whatsapp, website, email } = req.body;
    if (!name) return res.json({ msg: "business's name missing", field: "name", error: true });
    if (name.length > 30) return res.json({ msg: "business's name too long [max 30 characters]", field: "name", error: true });
    if (!description) return res.json({ msg: "business's description missing", field: "description", error: true });
    if (description.length > 120) return res.json({ msg: "business's description too long [max 120 characters]", field: "description", error: true });

    if (!address) return res.json({ msg: "business's address missing", field: "address", error: true });
    if (address.length > 50) return res.json({ msg: "business's description too long [max 50 characters]", field: "address", error: true });

    if (!phone) return res.json({ msg: "business's phone missing", field: "phone", error: true });
    if (!isPhone(phone)) return res.json({ msg: "phone invalid, only number and optional + sign", field: "phone", error: true });
    if (phone.length > 50) return res.json({ msg: "business's phone too long [max 50 characters]", field: "phone", error: true });

    if (!whatsapp) return res.json({ msg: "business's whatsapp missing", field: "whatsapp", error: true });
    if (!isPhone(whatsapp)) return res.json({ msg: "whatsapp invalid, only number and optional + sign", field: "phone", error: true });
    if (whatsapp.length > 50) return res.json({ msg: "business's whatsapp too long [max 50 characters]", field: "whatsapp", error: true });

    if (!website) return res.json({ msg: "business's website missing", field: "website", error: true });
    if (!isWebsite(website)) return res.json({ msg: "website invalid", field: "website", error: true });
    if (website.length > 120) return res.json({ msg: "business's website too long [max 120 characters]", field: "website", error: true });

    if (!email) return res.json({ msg: "business's email missing", field: "email", error: true });
    if (!isEmail(email)) return res.json({ msg: "business's email not valid", field: "email", error: true });
    if (email.length > 50) return res.json({ msg: "business's email too long [max 50 characters]", field: "email", error: true });

    if (!req.files) return res.json({ msg: "card must have at least one business's image", field: "images", error: true });

    let cardsCount = await Card.countDocuments();

    let imagesArray = [];
    if (!req.files["images[]"].length) {
        imagesArray.push(req.files["images[]"]);
    } else {
        imagesArray = req.files["images[]"];
    }

    let file_names = [];
    let fileNumber = 0;
    for (let fileObject of imagesArray) {
        let filename = `card_${cardsCount}_${fileNumber}.png`;
        file_names.push(filename);
        fileObject.mv("./images/cards/" + filename, (err) => {
            if (err) {
                console.log(err);
                return res.send(err);
            } else {
                console.log("images uploaded");
            }
        });
        fileNumber++;
    }

    await Card.create({
        cardid: cardsCount + 1,
        userid: req.user.userid,
        name: name,
        description: description,
        address: address,
        phone: phone,
        whatsapp: whatsapp,
        website: website,
        email: email,
        images: file_names,
    });

    await User.updateOne({ userid: req.user.userid }, { $push: { cards: cardsCount + 1 } });

    console.log("card created");
    res.sendStatus(201);
});

module.exports = router;
