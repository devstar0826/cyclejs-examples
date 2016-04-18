let {identity, intersperse, map, merge, prop, sortBy, values} = require("ramda")
let {Observable} = require("rx")
let {a, div, h1, hr} = require("@cycle/dom")
let {view} = require("../rx.utils")
let menu = require("../chunks/menu")
let userCard = require("../chunks/user.card")

module.exports = function ({navi, state}) {
  return {
    DOM: Observable.combineLatest(
      navi, state::view("users"),
      (navi, users) => {
        console.log("render user.index")
        users = sortBy(prop("username"), values(users))
        let cards = map((user) => userCard({navi, user}), users)
        return div([
          h1("User Index"),
          menu({navi}),
          div(intersperse(hr(), cards)) // no templates – no pain
        ])
      }
    )
  }
}