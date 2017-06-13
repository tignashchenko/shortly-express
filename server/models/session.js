const utils = require('../lib/hashUtils');
const Model = require('./model');
const Users = require('./user');

class Sessions extends Model {
  constructor() {
    super('sessions');
  }

  isLoggedIn(session) {
    return !!session.user;
  }

  compare(identifier, hash, salt) {
    return utils.compareHash(identifier, hash, salt);
  }

  get(options) {
    return super.get.call(this, options)
      .then(session => {
        if (!session || !session.userId) {
          return session;
        }

        return Users.get({ id: session.userId }).then(user => {
          session.user = user;
          return session;
        });
      });
  }

  create(identifier) {
    var salt = utils.createSalt();
    var hash = utils.createHash(identifier, salt);

    return super.create.call(this, { hash, salt });
  }
}

module.exports = new Sessions();
