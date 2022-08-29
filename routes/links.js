const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('success')
})

router
    .route("/:linkId")
    .get((req, res) => {
        res.render('success')
        //res.send(`Get User With Id ${req.params.linkId}`)
    })
    .put((req, res) => {
        res.send(`Update User With Id ${req.params.linkId}`)
    })
    .delete((req, res) => {
        res.send(`Delete User With Id ${req.params.linkId}`)
    })

const users = [{name: "Mario"}, {name: "Sara"}]

router.param("id", (req, res, next, id) => {
    req.user = users[id]
    next()
})



module.exports = router
