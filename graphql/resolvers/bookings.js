
const Booking = require("../../models/booking");
const { user, singleEvent} = require('./utils');

module.exports = {

  bookings : async (args, req) => {
    try {
      if(!req.isAuth) {
        throw new Error("Not Authorized");
      }

      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return { ...booking._doc, _id: booking.id, user: user.bind(this, booking._doc.user), event : singleEvent.bind(this, booking._doc.event)};
      });
    } catch (error) {
      throw error;
    }
  },

  bookEvent : async (args, req) => {
    try {
      if(!req.isAuth) {
        throw new Error("Not Authorized");
      }
      console.log(args.eventID);

      const eventExisting = await Event.findById(args.eventID);
      if (!eventExisting) {
        throw new Error("Event not found");
      }
      const booking = await new Booking({
        event: args.eventID,
        user: "5d7cd1057a8d41491ccda6c7" 
      }).save();
      return { ...booking._doc, _id: booking.id, user: user.bind(this, booking._doc.user), event : singleEvent.bind(this, booking._doc.event) };
    } catch (error) {
      throw error;
    }
  }
  
}