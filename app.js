const express = require('express');
const bodyParser = require('body-parser');
const accountRoutes = require('./routes/accountRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


// DB config
const db = require("./config/Sequalize");
db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: ", err.message, "\n error trace-->", err);
        return (err);
    });


app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.send("Welcome...");
});

app.use('/api', accountRoutes);


app.listen(process.env.PORT, () => {
    console.log(`App is up and running on port: ${process.env.PORT}`)
})

