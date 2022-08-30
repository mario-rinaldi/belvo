const express = require("express");
const router = express.Router();
const app = express();
const server = require('http').Server(app)
const fetch = require('node-fetch');
const userData = new Object();

router.get('/', (req, res) => {
    res.render('success')
})

router
    .route("/:linkId")
    .get((req, res) => {
        res.render('success')
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
        fetch(ownersEndpoint, {
            headers: { 'Authorization': env.authorization }
        })
        .then(res => res.json())
        .then(json => {
            //console.log("Owners: " + JSON.stringify(json));
            userData.owners = json;
        });

        //call accounts endpoint
        let accountsEndpoint = env.baseUrl + '/api/accounts/?page=1&link=' + req.params.linkId
        fetch(encodeURI(accountsEndpoint), {
            headers: { 'Authorization': env.authorization }
        })
        .then(res => res.json())
        .then(json => {
            //console.log("Accounts: " + JSON.stringify(json));
            userData.accounts = json;
        })

        //call transactions endpoint
        let transactionsEndpoint = env.baseUrl + '/api/transactions/?page=1&link=' + req.params.linkId
        fetch(encodeURI(transactionsEndpoint), {
            headers: { 'Authorization': env.authorization }
        })
        .then(res => res.json())
        .then(json => {
            //console.log("Transactions: " + JSON.stringify(json));
            userData.transactions = json;
        })

        app.get("/userData", (req, res) => {
            return res.json(JSON.stringify(userData))
        });

    next()

})


module.exports = router