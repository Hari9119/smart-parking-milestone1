const { createEvent, getEvents, updateEvent, deleteEvent, getAdvancedEvents } = require("../controllers/eventController");
router.get("/advanced-events", getAdvancedEvents);