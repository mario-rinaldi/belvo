const express = require('express');
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const fetch = require('node-fetch');
var belvo = require('belvo').default;
var exphbs = require('express-handlebars');

let response;
let userData;

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

io.on("connection", (socket) => {
    socket.on('callbackBelvo', (data) => {
        response = data
        socket.emit('redirect', '/links/' + response.link)
    })
    socket.on('successPageLoad', (data) => {
        socket.emit('linkInfo', response, userData)
    })
  });


app.get('/links/:linkId', (req, res) => {
    res.render('success')
    io.on("connection", (socket) => {
        socket.emit('userData', userData)
    });
})

const env = {
    secretId: '4cdd734e-b289-4303-b2af-31db6530c82f',
    secretPassword: 'Ld6ERSqTbyczS22WsdpKgoFopoykPiJoODM*arEgS@BG2lN*vHz58QRkqPCb4OxA',
    baseUrl: 'https://sandbox.belvo.com',
    authorization: 'Basic NGNkZDczNGUtYjI4OS00MzAzLWIyYWYtMzFkYjY1MzBjODJmOkxkNkVSU3FUYnljelMyMldzZHBLZ29Gb3BveWtQaUpvT0RNKmFyRWdTQEJHMmxOKnZIejU4UVJrcVBDYjRPeEE='
}

app.param("linkId", (req, res, next, linkId) => {

    Promise.all([
        fetch(encodeURI(env.baseUrl + '/api/owners/?page=1&link=' + req.params.linkId), {
            headers: { 'Authorization': env.authorization }
        }),
        fetch(encodeURI(env.baseUrl + '/api/accounts/?page=1&link=' + req.params.linkId), {
            headers: { 'Authorization': env.authorization }
        }),
        fetch(encodeURI(env.baseUrl + '/api/transactions/?page=1&link=' + req.params.linkId), {
            headers: { 'Authorization': env.authorization }
        })
    ]).then((responses) => {
        Promise.all(responses.map(res => res.text()))
        .then(texts => {
            userData = texts
            console.log(userData)  
            next()  
        })
    })
})

server.listen(process.env.PORT || 3000)