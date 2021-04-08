const mongoose = require('mongoose');
const express = require('express');
const app = express();

mongoose.connect('mongodb+srv://omaremam:u4meandme4u@cluster0.t8rj8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    // this will create database in mongodb
    .then(() => console.log('connected to mongodb'))
    .catch(err => console.error('not connected to monogodb'));

app.use(express.json());
//app.listen(3000,()=> console.log('\n' +'listening on port 3000 ...'));
require("./api/services/auth/basic/user.basic.routes")(app);
// require("./api/services/aboutcity/aboutcity.routes")(app);
// require("./api/services/shop/basic/shop.basic.routes")(app);
// require("./api/services/services/services.routes")(app);
// require("./api/services/outings/outing.routes")(app)
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('listening on port ...'));