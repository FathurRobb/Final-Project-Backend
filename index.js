const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const db = require('./models');
const Role = db.roles;
const Service = db.services;

const PORT = 8000;

app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(cors());
app.use(express.json());
app.use(express.static("assets"));

db.sequelize.sync().then(() => {
    console.log("synchronize the database");
    // initialRole(); 
    // initialService();
}).catch((error) => {
    console.error(error);
});

require('./routes/category.route')(app);
require('./routes/post.route')(app);
require('./routes/archive.route')(app);
require('./routes/user.route')(app);
require('./routes/comment.route')(app);
require('./routes/question.route')(app);
require('./routes/answer.route')(app);
require('./routes/service.route')(app);
require('./routes/facility.route')(app);

app.listen(PORT, () => {
    console.log("Server is running at port " + PORT);
});

function initialRole() {
    Role.create(
        {
            id: 1,
            role_name: 'Admin'
        },
    );
    Role.create(
        {
            id: 2,
            role_name: 'Editor'
        },
    );
    Role.create(
        {
            id: 3,
            role_name: 'Doctor'
        },
    );
    Role.create(
        {
            id: 4,
            role_name: 'Visitor'
        },
    );   
}

function initialService() {
    Service.create(
        {
            id: 1,
            name: 'Acupunture'
        },
    );
    Service.create(
        {
            id: 2,
            name: 'Ambulance'
        },
    );
    Service.create(
        {
            id: 3,
            name: 'BPJS (Medical Insurance)'
        },
    );
    Service.create(
        {
            id: 4,
            name: 'CT Scan'
        },
    );
    Service.create(
        {
            id: 5,
            name: 'Endoscopy'
        },
    );
}