const bcrypt = require('bcryptjs');

const Booking = require("../../models/booking");
const Event = require("../../models/event");
const User = require("../../models/user");

const events = async eventIds => {
  try {
    console.log(eventIds);
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return { ...event._doc, _id: event.id, createdBy: user.bind(this, event._doc.createdBy) };
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async eventId => {
  try {
    const single_event = await Event.findById(eventId);    
    return { ...single_event._doc, _id: single_event.id, createdBy: user.bind(this, single_event._doc.createdBy) };
  } catch (err) {
    throw err;
  }
};

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return { ...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents) };
  } catch (error) {
    throw error;
  }
}


module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return { ...event._doc, _id: event.id, createdBy: user.bind(this, event._doc.createdBy) };
      });
    } catch (error) {
      throw error;
    }
  },

  bookings : async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return { ...booking._doc, _id: booking.id, user: user.bind(this, booking._doc.user), event : singleEvent.bind(this, booking._doc.event)};
      });
    } catch (error) {
      throw error;
    }
  },

  bookEvent : async args => {
    try {
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
  },
  
  createEvent: async args => {
    try {
      let event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        createdBy: "5d7cd1057a8d41491ccda6c7"
      })
      let createdEvent;
      const result = await event.save()
      createdEvent = { ...result._doc, _id: result.id, createdBy: user.bind(this, result._doc.createdBy) };
      const user = await User.findById("5d7cd1057a8d41491ccda6c7");
      if (!user) {
        throw new Error("User not found");
      }
      user.createdEvents.push(event);
      await user.save();
      return createdEvent;
    } catch (error) {
      throw error;
    }
  },
  createUser: async args => {
    try {
      const user = await User.findOne({ email: args.userInput.email });
      if (user) {
        throw new Error('user already existing');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      let createdUser = await new User({
        email: args.userInput.email,
        password: hashedPassword
      }).save();
      return { ...createdUser._doc, password: null, _id: createdUser.id };

    } catch (err) {
      throw new err;
    }
  }
}