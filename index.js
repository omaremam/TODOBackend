const mongoose = require('mongoose');
const express = require('express');
const app = express();

mongoose.connect('mongodb+srv://sharmelshiikh:sharm2020@ss-cluser.93027.mongodb.net/test?authSource=admin&replicaSet=atlas-jn82x6-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true')
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
console.log("Asdasdas")
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('listening on port ...'));