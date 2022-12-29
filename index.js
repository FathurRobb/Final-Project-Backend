const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const db = require('./models');

const PORT = 8000;

app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(cors());
app.use(express.json());
app.use(express.static("assets"));

db.sequelize.sync().then(() => {
    console.log("synchronize the database");
}).catch((error) => {
    console.error(error);
});

require('./routes/category.route')(app);
require('./routes/post.route')(app);

app.listen(PORT, () => {
    console.log("Sserver is running at port " + PORT);
});