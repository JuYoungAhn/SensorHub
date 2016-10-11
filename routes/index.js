module.exports = function(app) {
  var smappee = require('../routes/smappee');
  app.use('/smappee', smappee);
};
