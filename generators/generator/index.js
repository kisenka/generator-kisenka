const Generator = require('../../utils/generator');

module.exports = class extends Generator {
  initializing() {
    this.argument('name', {
      type: String,
      required: true,
      desc: 'Generator name'
    });
  }

  writing() {
    const { options } = this;

    this.copy('index.js', `generators/${options.name}/index.js`);
  }
};
