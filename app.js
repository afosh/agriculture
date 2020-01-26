const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = require('./controllers/router');
const cookieParser = require('cookie-parser');



app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());


router(app);
const port = 3000 || process.env.PORT;


app.listen(port, () => console.log(`server is up on ${port}`));