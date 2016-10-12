var EnertalkAPI = require('./enertalk-api.js');

var enertalk = new EnertalkAPI({
    debug: false,
    clientId: "ank5MzYzMEBuYXZlci5jb21faW1yYw==",
    clientSecret: "x410y4ls6xz80w4zh66l4th3gk7f29z761d13d6"
});

module.exports = enertalk;
