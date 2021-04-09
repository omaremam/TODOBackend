const mongoose = require('mongoose');
const express = require('express');
const app = express();

mongoose.connect('mongodb+srv://omaremam:testpass@cluster0.t8rj8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to mongodb'))
    .catch(err => console.error('not connected to monogodb'));

app.use(express.json());
require("./api/services/auth/basic/user.basic.routes")(app);
require("./api/services/todo/basic/todo.basic.routes")(app);
const port = 3000;
app.listen(port, () => console.log('listening on port ...'));