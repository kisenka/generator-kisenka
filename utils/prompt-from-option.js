const clone = require('clone');

const OPTION_TO_PROMPT_TYPE_MAPPING = {
  boolean: 'confirm',
  string: 'input',
  number: 'input'
};

function promptFromOption(option) {
  const promptData = option.prompt;
  const types = OPTION_TO_PROMPT_TYPE_MAPPING;
  const promptType = types[option.type];
  let prompt;

  if (typeof promptData === 'undefined' || promptData === false) {
    prompt = null;
  } else if (promptData === true) {
    prompt = {
      name: option.name,
      type: promptType,
      message: option.desc,
      default: option.default
    };

    if (
      option.default === undefined &&
      option.required &&
      (promptType === types.string || promptType === types.number)
    ) {
      // TODO process numbers separately
      prompt.validate = input => input.trim() !== '';
    }

  } else {
    const cloned = clone(promptData);
    cloned.name = promptData.name || option.name;
    cloned.message = promptData.message || option.desc;
    cloned.default = promptData.default !== undefined
      ? promptData.default
      : option.default;
    prompt = cloned;
  }

  return prompt;
}

module.exports = promptFromOption;
