const Event = require("../../models/event");
const User = require("../../models/user");

const {tranformEvent} = require('./utils');


module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return tranformEvent(event);
      });
    } catch (error) {
      throw error;
    }
  },

  createEvent: async (args, req) => {
    try {
      if(!req.isAuth) {
        throw new Error("Not Authorized");
      }

      let event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        createdBy: "5d7cd1057a8d41491ccda6c7"
      })
      let createdEvent;
      const result = await event.save()
      createdEvent = tranformEvent(result);
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
  }
}