const express = require('express');
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const fetch = require('node-fetch');
var belvo = require('belvo').default;

var exphbs = require('express-handlebars');

app.use('/static', express.static('public'));

app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

var client = new belvo(
    '4cdd734e-b289-4303-b2af-31db6530c82f',
    'Ld6ERSqTbyczS22WsdpKgoFopoykPiJoODM*arEgS@BG2lN*vHz58QRkqPCb4OxA',
    'sandbox'
);

const options = {
    widget: {
        branding: {
            //company_icon: "https://belvo-mario.s3.amazonaws.com/Fictional_Logo.svg",
            //company_logo: "https://belvo-mario.s3.amazonaws.com/Fictional_Logo.svg",
            company_name: "SE CHALLENGE",
            company_benefit_header: "Belvo SE Case Challenge",
            company_benefit_content: "Cool isn't it?",
            opportunity_loss: "Oh, Sorry to see you go :("
        }
    }
}

app.get("/token", (req, res) => {
    return client.connect().then(() => {
        return client.widgetToken.create(options).then((belvoResponse) => {
            res.json(belvoResponse);
        })
    })
});

let response = null;

io.on("connection", (socket) => {
    socket.on('callbackBelvo', (data) => {
        response = JSON.parse(data)
        socket.emit('redirect', '/links/' + response.link)
    });
    socket.on('successPageLoad', (data) => {
        socket.emit('linkInfo', response)
    });
  });

const userRouter = require('./routes/users')
app.use('/users', userRouter)

const linksRouter = require('./routes/links')
app.use('/links', linksRouter)

server.listen(process.env.PORT || 3000)