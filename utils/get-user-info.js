const user = require('yeoman-generator/lib/actions/user');

const exec = require('./exec');

/**
 * @return {{git: {username, email, remote}}}
 */
function getUserInfo() {
  const git = {
    username: user.git.name(),
    email: user.git.email(),
    remote: exec('git config remote.origin.url')
  };
  return { git };
}

module.exports = getUserInfo;
