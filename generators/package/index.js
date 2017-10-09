const licensesList = require('generator-license').licenses;

const Generator = require('../../utils/generator');

const opts = require('./options.json');

module.exports = class extends Generator {
  initializing() {
    const { git, projectName } = this.getInfo();

    opts.PROJECT_NAME.default = projectName;
    opts.AUTHOR_NAME.default = git.username;
    opts.AUTHOR_EMAIL.default = git.email;
    opts.GITHUB_REPO_URL.default = git.remote;
    opts.LICENSE.prompt.choices = licensesList.map(license => ({
      name: license.name,
      value: license.value
    }));

    this.addOptions(opts);
  }

  prompting() {
    const prompts = this.promptsFromOptions(opts);
    return this.prompt(prompts).then(answers => {
      this.answers = answers;
    });
  }

  writing() {
    const { answers } = this;
    const keywords = `"${ answers.projectName.split('-').join('", "') }"`;

    if (answers[opts.CREATE_LICENSE.name] === true) {
      const licenseOptions = {
        name: answers[opts.AUTHOR_NAME.name],
        email: answers[opts.AUTHOR_EMAIL.name],
        license: answers[opts.LICENSE.name],
        website: ''
      };
      this.composeWith(require.resolve('generator-license'), licenseOptions);
    }

    this.renderAndCopyTpl({
      to: 'package.json',
      context: { ...answers, keywords }
    });
  }
};
