exports.getOverview = (req, res) => {
  res.status(200).render('overview', {
    title: 'All the tours'
  });
};

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Park Camper Tour'
  });
};
