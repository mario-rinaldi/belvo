const express = require("express");
const router = express.Router();
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const fetch = require('node-fetch');

router.get('/', (req, res) => {
    res.render('success')
})

router
    .route("/:linkId")
    .get((req, res) => {
        res.render('success')
        //res.send(`Get User With Id ${req.params.linkId}`)
    })

const env = {
    secretId: '4cdd734e-b289-4303-b2af-31db6530c82f',
    secretPassword: 'Ld6ERSqTbyczS22WsdpKgoFopoykPiJoODM*arEgS@BG2lN*vHz58QRkqPCb4OxA',
    baseUrl: 'https://sandbox.belvo.com',
    authorization: 'Basic NGNkZDczNGUtYjI4OS00MzAzLWIyYWYtMzFkYjY1MzBjODJmOkxkNkVSU3FUYnljelMyMldzZHBLZ29Gb3BveWtQaUpvT0RNKmFyRWdTQEJHMmxOKnZIejU4UVJrcVBDYjRPeEE='
}

router.param("linkId", (req, res, next, linkId) => {

        //call owners endpoint
        let ownersEndpoint = env.baseUrl + '/api/owners/?page=1&link=' + req.params.linkId
        console.log(ownersEndpoint)
        fetch(ownersEndpoint, {
            headers: { 'Authorization': env.authorization }
        })
        .then(res => res.json())
        .then(json => {
            console.log("Owners: " + JSON.stringify(json));
        });

    next()
})



/*
function fetchBelvoAPI() {
    //call owners endpoint
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

module.exports = router
