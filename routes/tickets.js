const express = require('express')
const {
    Ticket
} = require('../models/ticket')
const {
    User,
    userValidate
} = require('../models/user')
// const validation = require('../middleware/validation/validation')
// const bcrypt = require('bcrypt')
// const userValidation = validation.userValidation
// const openTicket = validation.openTicket

const router = express.Router()

//create ticket and user api
router.post('/create', async (req, res) => {
    try {
        const {
            error
        } = userValidate(req.body.passenger);
        if (error) {
            return res.status(400).send("Invalid Input");
        }
        let exists = await Ticket.findOne({
            is_booked: true,
            seat_number: req.body.seat_number
        });
        if (exists) {
            return res.status(400).send("The seat you are looking for is already booked");
        }
        const ticket = new Ticket({
            seat_number: req.body.seat_number
        });
        const user = new User(req.body.passenger);
        const userData = await user.save();
        if (userData) {
            ticket.passenger = user._id;
            const ticketData = await ticket.save();
            if (ticketData) {
                res.status(200).send(ticketData);
            }
        }
    } catch (err) {
        console.log("The Error is :", err);
    }
});



module.exports = router;