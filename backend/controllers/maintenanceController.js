const Maintenance = require('../models/Maintenance');

exports.createTicket = async (req, res) => {
  try {
    const { issueType, description, urgency } = req.body;
    
    const ticketId = await Maintenance.create({
      userId: req.user.id,  // ✅ fixed here
      issueType,
      description,
      urgency
    });
    
    res.json({ 
      id: ticketId,
      issueType,
      description,
      urgency,
      status: 'open'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getUserTickets = async (req, res) => {
  try {
    const tickets = await Maintenance.findByUser(req.user.id);  // ✅ fixed here
    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Maintenance.getAll();
    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
