// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//
module.exports = [
  {
    type: 'input',
    name: 'name',
    message: "What's your component name?",
  },
  {
    type: 'input',
    name: 'location',
    message: 'Where should your component live?',
  },
];
