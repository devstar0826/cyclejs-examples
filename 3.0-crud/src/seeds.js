let {makeUser} = require("./makers")

let seeds = {
  userCreateForm: {
    data: {
      username: null,
      email: null,
      points: null,
      bonus: null,
    },
    errors: {
      username: null,
      email: null,
      points: null,
      bonus: null,
    },
  },

  userEditForm: {
    data: {
      points: null,
      bonus: null,
    },
    errors: {
      points: null,
      bonus: null,
    },
  },

  users: {
    "1": makeUser({id: "1", username: "gizmo", email: "gizmo@paqmind.com", points: 30, bonus: 10}),
    "2": makeUser({id: "2", username: "fancy", email: "fancy@paqmind.com", points: 20}),
    "3": makeUser({id: "3", username: "random", email: "random@paqmind.com", points: 15}),
    "4": makeUser({id: "4", username: "voodoo", email: "voodoo@paqmind.com", points: 25})
  },
}

module.exports = seeds