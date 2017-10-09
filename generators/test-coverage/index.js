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
    this.deps = ['nyc'];

    const packageHasTestScript = pkg && pkg.scripts !== undefined && pkg.scripts.test !== undefined;

    if (!pkg) {
      return;
    }

    if (packageHasTestScript && answers[opts.UPDATE_TEST_SCRIPT.name]) {
      pkg.scripts.test = `nyc --check-coverage ${pkg.scripts.test}`;
    }

    if (answers[opts.CODECOV_INTEGRATION.name]) {
      this.deps.push('codecov');
      pkg.scripts['upload-coverage'] = 'codecov';
      this.copy('.codecov.yml');
    }

    this.writePackageJson(pkg);
    this.copy('.nycrc');
  }

  install() {
    this.i(this.deps);
  }

  end() {
    const { answers } = this;

    if (answers[opts.CODECOV_INTEGRATION.name]) {
      this.log(`
    ------------------------------------------------------------------------------------------------------------
    Codecov.io integration: don't forget to set $CODECOV_TOKEN (from https://codecov.io) env variable on your CI
    ------------------------------------------------------------------------------------------------------------
`);
    }
  }
};
