const Generator = require('../../utils/generator');

module.exports = class extends Generator {
  writing() {
    if (this.isPackageJsonExist()) {
      const pkg = this.readPackageJson();
      const config = pkg.config || {};

      config.commitizen = { path: 'node_modules/cz-customizable' };
      config['cz-customizable'] = { config: '.cz-config.js' };

      pkg.scripts.commit = 'git-cz';
      pkg.scripts.commitmsg = 'cz-customizable-ghooks';

      this.writePackageJson(pkg);
    }

    this.copy('.commitizen.config.js');
  }

  install() {
    this.i([
      'commitizen',
      'cz-customizable',
      'cz-customizable-ghooks',
      'husky'
    ]);
  }

  end() {
    // Setup husky manually
    this.spawnCommandSync('node', ['node_modules/husky/bin/install.js']);
  }
};
