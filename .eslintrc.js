// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: ['eslint-config-egg', 'standard'],
  // add your custom rules here
  rules: {
    // allow strict mode
    strict: [0, 'global'],
    // require trailing commas when multiline
    // 'comma-dangle': ['error', 'always-multiline'],
    'comma-dangle': 0,
    // allow async-await
    'generator-star-spacing': 'off',
    // turn off spacing before function parenthesis
    'space-before-function-paren': 0,
    // turn off spaces inside of brackets
    'array-bracket-spacing': 0
  }
}
