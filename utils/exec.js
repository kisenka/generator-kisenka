const shell = require('shelljs');

/**
 * @param {string} cmd
 * @param {boolean} [returnErrorWhenFail=false]
 * @return {string|undefined}
 */
function exec(cmd, returnErrorWhenFail = false) {
  const res = shell.exec(cmd, { silent: true });
  const { stderr, code } = res;
  const stdout = res.stdout.trim();

  if (code !== 0 && returnErrorWhenFail) {
    const err = new Error(stderr);
    err.code = code;
    return err;
  }

  return stdout === '' ? undefined : stdout;
}

module.exports = exec;
