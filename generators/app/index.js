const fs = require('fs');

const Generator = require('../../utils/generator');

const opts = require('./options.json');

module.exports = class extends Generator {
  initializing() {
    const isRepoInited = fs.existsSync(this.destinationPath('.git'));

    opts.INIT_REPO.prompt.when = !isRepoInited;

    this.addOptions(opts);
  }

  prompting() {
    const preselected = this.config.get(opts.PACKAGE_MANAGER.name);

    if (preselected) {
      opts.PACKAGE_MANAGER.default = preselected;
    }

    return this.prompt(this.promptsFromOptions(opts)).then(answers => {
      this.answers = answers;
    });
  }

  configuring() {
    const answers = this.answers;
    const features = answers[opts.FEATURES.name];
    const initRepo = answers[opts.INIT_REPO.name];
    const pkgName = answers[opts.PACKAGE_MANAGER.name];

    if (initRepo) {
      this.spawnCommandSync('git', ['init']);
    }

    this.config.set(opts.PACKAGE_MANAGER.name, pkgName);

    this.composeWith(require.resolve('../package'));

    const featuresGenerators = [
      'editorconfig',
      'gitignore',
      'eslint',
      'conventional-commits',
      'test-mocha'
    ];

    featuresGenerators.forEach(name => {
      if (features.includes('editorconfig')) {
        this.composeWith(require.resolve(`../${name}`));
      }
    });
  }
};
