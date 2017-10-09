const Generator = require('../../utils/generator');

module.exports = class extends Generator {
  writing() {
    this.copy('.editorconfig');
  }
};
