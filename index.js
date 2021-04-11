const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors')


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, X-Auth-Token, Content-Type, Accept"
    );
    // res.header("Access-Control-Expose-Headers", "Access-Token", "X-Auth-Token")
    next();
  });
  app.use(
    cors({
      exposedHeaders: "X-Auth-Token"
    })
  );

mongoose.connect('mongodb+srv://omaremam:testpass@cluster0.t8rj8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to mongodb'))
    .catch(err => console.error('not connected to monogodb'));

app.use(express.json());
require("./api/services/auth/basic/user.basic.routes")(app);
require("./api/services/todo/basic/todo.basic.routes")(app);
const port = 5000;
app.listen(port, () => console.log('listening on port ...'));