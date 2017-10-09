const sortKeys = require('sort-object-keys');
const BaseGenerator = require('yeoman-generator');
const Case = require('case');
const chalk = require('chalk');

const getUserInfo = require('./get-user-info');
const normalizeOption = require('./normalize-option');
const promptFromOption = require('./prompt-from-option');

/**
 * @param {Object} object
 * @return {Array}
 */
function objectValuesToArray(object) {
  return Object.keys(object).map(key => object[key]);
}

class PlainGenerator extends BaseGenerator {
  get package() {
    return this.readPackageJson();
  }

  get hasPackage() {
    return this.package !== null;
  }

  addOption(config) {
    const normalized = normalizeOption(config);
    this.option(normalized.name, normalized);
  }

  addOptions(opts) {
    let arr;

    if (typeof opts === 'object') {
      arr = [];
      Object.keys(opts).forEach(id => {
        arr.push(opts[id]);
      });
    } else if (Array.isArray(opts)) {
      arr = opts;
    } else {
      throw new Error('Could only add array or object of options');
    }

    arr.forEach(opt => this.addOption(opt));
  }

  printIntro(msg) {
    this.log(chalk.yellow(`\n${msg}\n`));
  }

  /**
   * Wrapper over `this.fs.copyTpl` with predefined template and destination paths
   * @param {Object} options
   * @param {string} options.to
   * @param {string} [options.from]
   * @param {Object} [options.context] Template context
   */
  renderAndCopyTpl(options) {
    const { from, to, context } = options;

    this.fs.copyTpl(
      this.templatePath(from || to),
      this.destinationPath(to),
      context
    );
  }

  copy(from, to = from) {
    this.fs.copy(
      this.templatePath(from),
      this.destinationPath(to)
    );
  }

  /**
   * @return {string}
   */
  getProjectName(humanize = false) {
    const name = this.determineAppname();
    return humanize ? Case.capital(name) : Case.kebab(name);
  }

  /**
   * @return {{projectName, git: {username, email, remote}}}
   */
  getInfo() {
    const data = getUserInfo();
    const { git } = data;

    if (!git.remote && git.username) {
      git.remote = `https://github.com/${git.username}/${this.getProjectName()}`;
    }

    data.projectName = this.getProjectName();

    return data;
  }

  /**
   * @return {boolean}
   */
  isPackageJsonExist() {
    return this.fs.exists(`${this.destinationPath()}/package.json`);
  }

  /**
   * @return {Object|null} null returns in case of file not found
   */
  readPackageJson() {
    return this.fs.readJSON(
      `${this.destinationPath()}/package.json`,
      null
    );
  }

  writePackageJson(content) {
    if (content.scripts) {
      content.scripts = sortKeys(content.scripts);
    }

    this.fs.writeJSON(
      this.destinationPath('package.json'),
      content
    );
  }

  promptFromOption(option) {
    return promptFromOption(option);
  }

  promptsFromOptions(options) {
    return objectValuesToArray(options).map(promptFromOption);
  }

  getPackageManager() {
    return this.config.get('packageManager') || 'npm';
  }

  i(deps, dev = true, exact = true) {
    // eslint-disable-next-line no-unused-expressions
    this.getPackageManager() === 'yarn'
      ? this.yarnInstall(deps, { exact, dev })
      : this.npmInstall(deps, { exact, dev });
  }
}

module.exports = PlainGenerator;
