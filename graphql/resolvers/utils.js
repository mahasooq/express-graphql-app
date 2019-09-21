const Event = require("../../models/event");
const User = require("../../models/user");


const tranformEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    createdBy: user.bind(this, event._doc.createdBy)
  };
}

const events = async eventIds => {
  try {
    console.log(eventIds);
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return tranformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async eventId => {
  try {
    const single_event = await Event.findById(eventId);    
    return tranformEvent(single_event);
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

exports.user = user;
exports.singleEvent = singleEvent;
exports.events = events;
exports.tranformEvent = tranformEvent;