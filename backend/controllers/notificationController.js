const Notification = require('../models/Notification');

exports.createNotification = async (req, res) => {
  try {
    const { message, urgency } = req.body;
    
    const notificationId = await Notification.create({
      userId: req.user.userId,
      message,
      urgency
    });
    
    res.json({ 
      id: notificationId,
      message,
      urgency
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.getByUser(req.user.userId);
    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.getAll();
    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};