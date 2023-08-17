const AitEmail = require('../utils/aitEmail');

exports.contact = async (req, res, next) => {
  const lead = {
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message
  };
  const mail = new AitEmail(lead.email);
  mail.contact(lead);
  await mail.contactUser();
  // console.log(mail);
  res.status(200).json({ data: mail });
};
