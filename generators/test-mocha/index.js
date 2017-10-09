const Generator = require('../../utils/generator');

const opts = require('./options.json');

module.exports = class extends Generator {
  initializing() {
    this.addOptions(opts);
  }

  prompting() {
    return this.prompt(this.promptsFromOptions(opts)).then(answers => {
      this.answers = answers;
    });
  }

  writing() {
    const { answers } = this;
    const pkg = this.package;

    this.copy('.mocha-setup.js');
    this.copy('test/mocha.opts');

    if (!this.hasPackage) {
      return;
    }

    if (answers[opts.ADD_TEST_SCRIPT.name]) {
      pkg.scripts.test = 'mocha test/*.test.js';
      this.writePackageJson(pkg);
    }

    if (answers[opts.COVERAGE.name]) {
      this.composeWith(require.resolve('../test-coverage'));
    }
  }

  install() {
    this.i([
      'mocha',
      'chai'
    ]);
  }
};
