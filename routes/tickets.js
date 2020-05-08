const express = require('express')
const {
    Ticket
} = require('../models/ticket')
const {
    User,
    userValidate
} = require('../models/user')


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

//update ticket status and user details
router.put('/ticket/:ticketId', async (req, res) => {
    try {
        const ticketId = req.params.ticketId || null;
        const requestData = req.body;
        let passenger = requestData.passenger || null;


        if (requestData.is_booked == true) {
            let ticketData = await Ticket.findById(ticketId);
            if (ticketData) {
                const userId = ticketData.passenger;
                const deleteData = await User.remove({
                    _id: userId
                });
                if (deleteData) {
                    ticketData.is_booked = requestData.is_booked;
                    const result = await ticketData.save();
                    return res.status(200).json(result);
                }
            }
        }
        if (requestData.is_booked == false && passenger != null) {
            let ticketData = await Ticket.findById(ticketId);
            if (!ticketData) {
                return res.status(404).json({
                    message: "Not found"
                });
            }
            const userData = new User(passenger);
            const userSaved = await userData.save();
            if (userSaved) {
                ticketData.passenger = userSaved._id;
                ticketData.is_booked = requestData.is_booked;
                const ticketSaved = await ticketData.save();
                return res.status(200).send(ticketSaved);
            }
        }
    } catch (err) {
        return res.status(400).send("Already updated with the same details");
    }
});




//view ticket status based on ticket_id
router.get('/ticket/:ticketId', async (req, res) => {
    try {
        const {
            ticketId
        } = req.params;
        const ticketData = await Ticket.findById(ticketId);
        if (ticketData) {
            return res.status(200).json({
                status: ticketData.is_booked
            });
        }
    } catch (err) {
        res.status(404).json({
            message: err
        });
    }
})

router.get('/tickets/open', async (req, res) => {
    try {
        const data = await Ticket.find({
            is_booked: false
        }).limit(10).select({
            __v: 0
        });
        return res.status(200).send(data);
    } catch {
        return res.status(400).send("An unknown error occured");
    }
})

router.get('/tickets/close', async (req, res) => {
    try {
        const data = await Ticket.find({
            is_booked: true
        }).limit(10).select({
            __v: 0
        });
        return res.status(200).send(data);
    } catch {
        return res.status(400).send("An unknown error occured");
    }
})

router.get('/user/:ticketId', async (req, res) => {
    try {
        const {
            ticketId
        } = req.params;
        if (!ticketId) {
            return res.status(400).send("ticketId is missing");
        }
        const ticketData = await Ticket.findById(ticketId);
        if (!ticketData) {
            return res.status(404).send("Ticket doesn't exists");
        }
        const personData = await User.findById(ticketData.passenger);
        if (personData) {
            return res.status(200).send(personData);
        }
    } catch (err) {
        return res.status(400).send("An unknown error occured");
    }
})


module.exports = router;