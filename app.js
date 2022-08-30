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

let response;

io.on("connection", (socket) => {
    socket.on('callbackBelvo', (data) => {
        response = data
        socket.emit('redirect', '/links/' + response.link)
    });
    socket.on('successPageLoad', (data) => {
        socket.emit('linkInfo', response)
    });
  });

/*
const env = {
    secretId: '4cdd734e-b289-4303-b2af-31db6530c82f',
    secretPassword: 'Ld6ERSqTbyczS22WsdpKgoFopoykPiJoODM*arEgS@BG2lN*vHz58QRkqPCb4OxA',
    baseUrl: 'https://sandbox.belvo.com',
    authorization: 'Basic NGNkZDczNGUtYjI4OS00MzAzLWIyYWYtMzFkYjY1MzBjODJmOkxkNkVSU3FUYnljelMyMldzZHBLZ29Gb3BveWtQaUpvT0RNKmFyRWdTQEJHMmxOKnZIejU4UVJrcVBDYjRPeEE='
}

function fetchBelvoAPI() {
    //call owners endpoint
    console.log('ID STRING ' + response.link.toString())

    let ownersEndpoint = env.baseUrl + '/api/owners/?page=1&link=047685ce-2de2-4639-bc20-960364c31b08' + response.link
    console.log(ownersEndpoint)
    fetch(encodeURI(ownersEndpoint), {
        headers: { 'Authorization': env.authorization }
    })
    .then(res => res.json())
    .then(json => {
        console.log("Owners: " + JSON.stringify(json));
    });

    //call accounts endpoint
    let accountsEndpoint = env.baseUrl + '/api/accounts/?page=1&link=' + response.link
    console.log(accountsEndpoint)
    fetch(encodeURI(accountsEndpoint), {
        headers: { 'Authorization': env.authorization }
    })
    .then(res => res.json())
    .then(json => {
        console.log("Accounts: " + JSON.stringify(json));
    })

    //call transactions endpoint
    let transactionsEndpoint = env.baseUrl + '/api/transactions/?page=1&link=' + response.link.toString()
    console.log(transactionsEndpoint)
    fetch(encodeURI(transactionsEndpoint), {
        headers: { 'Authorization': env.authorization }
    })
    .then(res => res.json())
    .then(json => {
        console.log("Transactions: " + JSON.stringify(json));
    })

    //call incomes endpoint
    let incomesEndpoint = env.baseUrl + '/api/incomes/?page=1&account=' + response.link //aqui é o income de uma ACCOUNT ID
    console.log(incomesEndpoint)
    fetch(encodeURI(incomesEndpoint), {
        headers: { 'Authorization': env.authorization }
    })
    .then(res => res.json())
    .then(json => {
        console.log("Incomes: " + JSON.stringify(json));
    })

}
*/
const userRouter = require('./routes/users')
app.use('/users', userRouter)

const linksRouter = require('./routes/links')
app.use('/links', linksRouter)

server.listen(process.env.PORT || 3000)