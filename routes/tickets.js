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

//view ticket status based on ticket_id
router.get('/ticket/:ticketId', async (req, res)=>{
    try{
    //    console.log(req.params.ticketId);
       const { ticketId }  = req.params;
       const ticketData = await Ticket.findById(ticketId);
       if(ticketData){
           return res.status(200).json({status : ticketData.is_booked});
       }
    }
    catch(err){
        res.status(404).json({message : err});
    }
})

//view all closest tickets
router.get('/ticket/open', async (req, res)=>{
    try{
       const data = await Ticket.find({is_booked : false}).limit(10);
       return res.status(200).send(data);
    }
    catch(err){
       return res.status(404).send("Not found");
    }
})



module.exports = router;