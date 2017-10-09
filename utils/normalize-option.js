const clone = require('clone');

const OPTION_TYPE_MAPPING = {
  boolean: Boolean,
  string: String,
  number: Number
};

/**
 * Normalize to Yeoman option format.
 * @param {Object} config
 * @return {Object}
 */
function normalizeOption(config) {
  const normalized = clone(config);
  normalized.type = OPTION_TYPE_MAPPING[normalized.type];
  delete normalized.prompt;
  return normalized;
}

module.exports = normalizeOption;
