const Generator = require('../../utils/generator');

const opts = require('./options.json');

module.exports = class extends Generator {
  initializing() {
    opts.ADD_PRECOMMIT_HOOK.prompt.when = answers => answers[opts.ADD_LINT_SCRIPT.name] === true;
    this.addOptions(opts);
  }

  prompting() {
    return this.prompt(this.promptsFromOptions(opts)).then(answers => {
      this.answers = answers;
    });
  }

  writing() {
    const { answers } = this;

    if (this.isPackageJsonExist() && answers[opts.ADD_LINT_SCRIPT.name]) {
      const pkg = this.readPackageJson();

      pkg.scripts.lint = 'eslint .';

      if (answers[opts.ADD_PRECOMMIT_HOOK.name]) {
        pkg.scripts.precommit = `${this.getPackageManager()} run lint`;
      }

      this.writePackageJson(pkg);
    }

    this.copy('.eslintrc');
    this.copy('.eslintrc-test');
    this.copy('.eslintignore');
  }

  install() {
    this.i([
      'eslint',
      '@kisenka/eslint-config'
    ]);
  }
};


