const Generator = require('../../utils/generator');

const opts = require('./options.json');

module.exports = class extends Generator {
  initializing() {
    this.printIntro(
      'Intro text'
    );

    // Here you can override `opts` object

    this.deps = [];
    this.addOptions(opts);
  }

  prompting() {
    return this.prompt(this.promptsFromOptions(opts)).then(answers => {
      this.answers = answers;
    });
  }

  writing() {
    const { answers } = this;

    if (this.isPackageJsonExist()) {
      const pkg = this.readPackageJson();

      // Do something...

      this.writePackageJson(pkg);
    }

    this.copy('some-file');
  }

  install() {
    this.i(this.deps);
  }

  end() {
    const { answers } = this;
  }
};
