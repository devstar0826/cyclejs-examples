(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
require("../../common/scripts/shims");
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

var Picture = require("./picture");
var View = require("./view");

// APP =============================================================================================
var User = Cycle.createDOMUser("main");

User.inject(View);

User.event$(".picture", "favup").subscribe(function (event) {
  console.log("Favup:", event.data);
});

User.event$(".picture", "unfav").subscribe(function (event) {
  console.log("Unfav:", event.data);
});

// Not supported yet!
//User.event$("Picture", "favup").subscribe(...);
//User.event$("Picture", "unfav").subscribe(...);

},{"../../common/scripts/shims":4,"./picture":2,"./view":3,"cyclejs":"cyclejs"}],2:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

var Class = require("classnames");

// COMPONENTS ======================================================================================
var props = {
  src$: null,
  title$: null,
  favorite$: null,
  width$: null };

module.exports = Cycle.registerCustomElement("Picture", function (User, Props) {
  var Model = Cycle.createModel(function (Intent, Props) {
    return {
      src$: Props.get("src$").startWith("#").shareReplay(1), // `src$` is exposed so `shareReplay` is required

      title$: Props.get("title$").startWith(""),

      favorite$: Props.get("favorite$").merge(Intent.get("toggle$")).scan(false, function (favorite) {
        return !favorite;
      }).startWith(false),

      width$: Props.get("width$").startWith(100) };
  });

  var View = Cycle.createView(function (Model) {
    return {
      vtree$: Cycle.latest(Model, Object.keys(props), function (model) {
        return h("div", { className: Class({ picture: true, favorite: model.favorite }) }, [h("img", { src: model.src, width: model.width, title: model.title })]);
      }) };
  });

  var Intent = Cycle.createIntent(function (User) {
    return {
      toggle$: User.event$(".picture", "click").map(function () {
        return true;
      }) };
  });

  User.inject(View).inject(Model).inject(Intent, Props)[0].inject(User);

  return {
    // As Model::favorite$ already dependes on Intent::toggle$ we can only use `.withLatestFrom`
    // `.flatMap(Model.get("favorite$"))` would create new observables at every step (circular dependency => memory leak)
    favup$: Intent.get("toggle$").withLatestFrom(Model.get("favorite$"), function (_, fav) {
      return fav;
    }).filter(function (v) {
      return !v;
    }).flatMap(Model.get("src$")),

    unfav$: Intent.get("toggle$").withLatestFrom(Model.get("favorite$"), function (_, fav) {
      return fav;
    }).filter(function (v) {
      return v;
    }).flatMap(Model.get("src$")) };
});

},{"classnames":"classnames","cyclejs":"cyclejs"}],3:[function(require,module,exports){
"use strict";

// CONSTS ==========================================================================================
var pictures = [{
  src: "https://avatars3.githubusercontent.com/u/984368?v=3&s=400",
  title: "AngularJS",
  favorite: false
}, {
  src: "https://pbs.twimg.com/media/B5AJRfWCYAAbLyJ.png",
  title: "RxJS",
  favorite: true
}, {
  src: "https://lh6.googleusercontent.com/-TlY7amsfzPs/T9ZgLXXK1cI/AAAAAAABK-c/Ki-inmeYNKk/w749-h794/AngularJS-Shield-large.png",
  title: "CycleJS" }];

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

// VIEWS ===========================================================================================
module.exports = Cycle.createView(function () {
  return {
    vtree$: Rx.Observable["return"](h("div", { className: "pictures" }, [h("Picture", { src: pictures[0].src, title: pictures[0].title, favorite: pictures[0].favorite, width: "100", something: "x" }), h("Picture", { src: pictures[1].src, title: pictures[1].title, favorite: pictures[1].favorite, width: "100", something: "y" }), h("Picture", { src: pictures[2].src, title: pictures[2].title, width: "100", something: "z" })])) };
});

},{"cyclejs":"cyclejs"}],4:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
require("babel/polyfill");

// SHIMS ===========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;

Cycle.latest = function (DataNode, keys, resultSelector) {
  var observables = keys.map(function (key) {
    return DataNode.get(key);
  });
  var args = observables.concat([function selector() {
    for (var _len = arguments.length, list = Array(_len), _key = 0; _key < _len; _key++) {
      list[_key] = arguments[_key];
    }

    var model = keys.reduce(function (model, key) {
      model[key.slice(0, -1)] = list[keys.indexOf(key)];
      return model;
    }, {});
    return resultSelector(model);
  }]);
  return Rx.Observable.combineLatest.apply(null, args);
};

console.spy = function spy() {
  var _console$log;

  for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
    params[_key] = arguments[_key];
  }

  return (_console$log = console.log).bind.apply(_console$log, [console].concat(params));
};

},{"babel/polyfill":"babel/polyfill","cyclejs":"cyclejs"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC82LjEtZmF2cy1zaW5nbGUvc2NyaXB0cy9hcHAuanMiLCJidWlsZC82LjEtZmF2cy1zaW5nbGUvc2NyaXB0cy9waWN0dXJlLmpzIiwiYnVpbGQvNi4xLWZhdnMtc2luZ2xlL3NjcmlwdHMvdmlldy5qcyIsImJ1aWxkL2NvbW1vbi9zY3JpcHRzL3NoaW1zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDQ0EsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDdEMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFCLEVBQUUsR0FBTyxLQUFLLENBQWQsRUFBRTtJQUFFLENBQUMsR0FBSSxLQUFLLENBQVYsQ0FBQzs7QUFDVixJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbkMsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7QUFHN0IsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFdkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQUEsS0FBSyxFQUFJO0FBQ2xELFNBQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUNuQyxDQUFDLENBQUM7O0FBRUgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQUEsS0FBSyxFQUFJO0FBQ2xELFNBQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUNuQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7QUNqQkgsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFCLEVBQUUsR0FBTyxLQUFLLENBQWQsRUFBRTtJQUFFLENBQUMsR0FBSSxLQUFLLENBQVYsQ0FBQzs7QUFDVixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7OztBQUdsQyxJQUFJLEtBQUssR0FBRztBQUNWLE1BQUksRUFBRSxJQUFJO0FBQ1YsUUFBTSxFQUFFLElBQUk7QUFDWixXQUFTLEVBQUUsSUFBSTtBQUNmLFFBQU0sRUFBRSxJQUFJLEVBQ2IsQ0FBQzs7aUJBRWEsS0FBSyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxVQUFDLElBQUksRUFBRSxLQUFLLEVBQUs7QUFDckUsTUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFDLE1BQU0sRUFBRSxLQUFLO1dBQU07QUFDaEQsVUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7O0FBRXJELFlBQU0sRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7O0FBRXpDLGVBQVMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUM5QixLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUM1QixJQUFJLENBQUMsS0FBSyxFQUFFLFVBQUEsUUFBUTtlQUFJLENBQUMsUUFBUTtPQUFBLENBQUMsQ0FDbEMsU0FBUyxDQUFDLEtBQUssQ0FBQzs7QUFFbkIsWUFBTSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUMzQztHQUFDLENBQUMsQ0FBQzs7QUFFSixNQUFJLElBQUksR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLFVBQUEsS0FBSyxFQUFJO0FBQ25DLFdBQU87QUFDTCxZQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxVQUFBLEtBQUssRUFBSTtBQUNyRCxlQUNFLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsRUFBRSxDQUN0RSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUNuRSxDQUFDLENBQ0Y7T0FDSCxDQUNGLEVBQ0YsQ0FBQztHQUNILENBQUMsQ0FBQzs7QUFFSCxNQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQ3RDLFdBQU87QUFDTCxhQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sSUFBSTtPQUFBLENBQUMsRUFDMUQsQ0FBQztHQUNILENBQUMsQ0FBQzs7QUFFSCxNQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFdEUsU0FBTzs7O0FBR0wsVUFBTSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQzFCLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFLFVBQUMsQ0FBQyxFQUFFLEdBQUc7YUFBSyxHQUFHO0tBQUEsQ0FBQyxDQUN2RCxNQUFNLENBQUMsVUFBQSxDQUFDO2FBQUksQ0FBQyxDQUFDO0tBQUEsQ0FBQyxDQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUU3QixVQUFNLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FDMUIsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUUsVUFBQyxDQUFDLEVBQUUsR0FBRzthQUFLLEdBQUc7S0FBQSxDQUFDLENBQ3ZELE1BQU0sQ0FBQyxVQUFBLENBQUM7YUFBSSxDQUFDO0tBQUEsQ0FBQyxDQUNkLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQzlCLENBQUM7Q0FDSCxDQUFDOzs7Ozs7QUM1REYsSUFBTSxRQUFRLEdBQUcsQ0FDZjtBQUNFLEtBQUcsRUFBRSwyREFBMkQ7QUFDaEUsT0FBSyxFQUFFLFdBQVc7QUFDbEIsVUFBUSxFQUFFLEtBQUs7Q0FDaEIsRUFDRDtBQUNFLEtBQUcsRUFBRSxpREFBaUQ7QUFDdEQsT0FBSyxFQUFFLE1BQU07QUFDYixVQUFRLEVBQUUsSUFBSTtDQUNmLEVBQ0Q7QUFDRSxLQUFHLEVBQUUseUhBQXlIO0FBQzlILE9BQUssRUFBRSxTQUFTLEVBQ2pCLENBQ0YsQ0FBQzs7O0FBR0YsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFCLEVBQUUsR0FBTyxLQUFLLENBQWQsRUFBRTtJQUFFLENBQUMsR0FBSSxLQUFLLENBQVYsQ0FBQzs7O2lCQUdLLEtBQUssQ0FBQyxVQUFVLENBQUM7U0FBTztBQUNyQyxVQUFNLEVBQUUsRUFBRSxDQUFDLFVBQVUsVUFBTyxDQUMxQixDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBQyxFQUFFLENBQ2hDLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUMsQ0FBQyxFQUM1SCxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFDLENBQUMsRUFDNUgsQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQzdGLENBQUMsQ0FDSCxFQUNGO0NBQUMsQ0FBQzs7Ozs7O0FDOUJILE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7QUFHMUIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFCLEVBQUUsR0FBSSxLQUFLLENBQVgsRUFBRTs7QUFFUCxLQUFLLENBQUMsTUFBTSxHQUFHLFVBQVUsUUFBUSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUU7QUFDdkQsTUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUc7V0FBSSxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztHQUFBLENBQUMsQ0FBQztBQUNyRCxNQUFJLElBQUksR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQzVCLFNBQVMsUUFBUSxHQUFVO3NDQUFOLElBQUk7QUFBSixVQUFJOzs7QUFDdkIsUUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFDLEtBQUssRUFBRSxHQUFHLEVBQUs7QUFDdEMsV0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2xELGFBQU8sS0FBSyxDQUFDO0tBQ2QsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNQLFdBQU8sY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQzlCLENBQ0YsQ0FBQyxDQUFDO0FBQ0gsU0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0NBQ3RELENBQUM7O0FBRUYsT0FBTyxDQUFDLEdBQUcsR0FBRyxTQUFTLEdBQUcsR0FBWTs7O29DQUFSLE1BQU07QUFBTixVQUFNOzs7QUFDbEMsU0FBTyxnQkFBQSxPQUFPLENBQUMsR0FBRyxFQUFDLElBQUksTUFBQSxnQkFBQyxPQUFPLFNBQUssTUFBTSxFQUFDLENBQUM7Q0FDN0MsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5yZXF1aXJlKFwiLi4vLi4vY29tbW9uL3NjcmlwdHMvc2hpbXNcIik7XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7UngsIGh9ID0gQ3ljbGU7XG5sZXQgUGljdHVyZSA9IHJlcXVpcmUoXCIuL3BpY3R1cmVcIik7XG5sZXQgVmlldyA9IHJlcXVpcmUoXCIuL3ZpZXdcIik7XG5cbi8vIEFQUCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBVc2VyID0gQ3ljbGUuY3JlYXRlRE9NVXNlcihcIm1haW5cIik7XG5cblVzZXIuaW5qZWN0KFZpZXcpO1xuXG5Vc2VyLmV2ZW50JChcIi5waWN0dXJlXCIsIFwiZmF2dXBcIikuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgY29uc29sZS5sb2coXCJGYXZ1cDpcIiwgZXZlbnQuZGF0YSk7XG59KTtcblxuVXNlci5ldmVudCQoXCIucGljdHVyZVwiLCBcInVuZmF2XCIpLnN1YnNjcmliZShldmVudCA9PiB7XG4gIGNvbnNvbGUubG9nKFwiVW5mYXY6XCIsIGV2ZW50LmRhdGEpO1xufSk7XG5cbi8vIE5vdCBzdXBwb3J0ZWQgeWV0IVxuLy9Vc2VyLmV2ZW50JChcIlBpY3R1cmVcIiwgXCJmYXZ1cFwiKS5zdWJzY3JpYmUoLi4uKTtcbi8vVXNlci5ldmVudCQoXCJQaWN0dXJlXCIsIFwidW5mYXZcIikuc3Vic2NyaWJlKC4uLik7XG5cblxuXG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7UngsIGh9ID0gQ3ljbGU7XG5sZXQgQ2xhc3MgPSByZXF1aXJlKFwiY2xhc3NuYW1lc1wiKTtcblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHByb3BzID0ge1xuICBzcmMkOiBudWxsLFxuICB0aXRsZSQ6IG51bGwsXG4gIGZhdm9yaXRlJDogbnVsbCxcbiAgd2lkdGgkOiBudWxsLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ3ljbGUucmVnaXN0ZXJDdXN0b21FbGVtZW50KFwiUGljdHVyZVwiLCAoVXNlciwgUHJvcHMpID0+IHtcbiAgbGV0IE1vZGVsID0gQ3ljbGUuY3JlYXRlTW9kZWwoKEludGVudCwgUHJvcHMpID0+ICh7XG4gICAgc3JjJDogUHJvcHMuZ2V0KFwic3JjJFwiKS5zdGFydFdpdGgoXCIjXCIpLnNoYXJlUmVwbGF5KDEpLCAvLyBgc3JjJGAgaXMgZXhwb3NlZCBzbyBgc2hhcmVSZXBsYXlgIGlzIHJlcXVpcmVkXG5cbiAgICB0aXRsZSQ6IFByb3BzLmdldChcInRpdGxlJFwiKS5zdGFydFdpdGgoXCJcIiksXG5cbiAgICBmYXZvcml0ZSQ6IFByb3BzLmdldChcImZhdm9yaXRlJFwiKVxuICAgICAgLm1lcmdlKEludGVudC5nZXQoXCJ0b2dnbGUkXCIpKVxuICAgICAgLnNjYW4oZmFsc2UsIGZhdm9yaXRlID0+ICFmYXZvcml0ZSlcbiAgICAgIC5zdGFydFdpdGgoZmFsc2UpLFxuXG4gICAgd2lkdGgkOiBQcm9wcy5nZXQoXCJ3aWR0aCRcIikuc3RhcnRXaXRoKDEwMCksXG4gIH0pKTtcblxuICBsZXQgVmlldyA9IEN5Y2xlLmNyZWF0ZVZpZXcoTW9kZWwgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICB2dHJlZSQ6IEN5Y2xlLmxhdGVzdChNb2RlbCwgT2JqZWN0LmtleXMocHJvcHMpLCBtb2RlbCA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIGgoJ2RpdicsIHtjbGFzc05hbWU6IENsYXNzKHtwaWN0dXJlOiB0cnVlLCBmYXZvcml0ZTogbW9kZWwuZmF2b3JpdGV9KX0sIFtcbiAgICAgICAgICAgICAgaCgnaW1nJywge3NyYzogbW9kZWwuc3JjLCB3aWR0aDogbW9kZWwud2lkdGgsIHRpdGxlOiBtb2RlbC50aXRsZX0pXG4gICAgICAgICAgICBdKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICksXG4gICAgfTtcbiAgfSk7XG5cbiAgbGV0IEludGVudCA9IEN5Y2xlLmNyZWF0ZUludGVudChVc2VyID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgdG9nZ2xlJDogVXNlci5ldmVudCQoXCIucGljdHVyZVwiLCBcImNsaWNrXCIpLm1hcCgoKSA9PiB0cnVlKSxcbiAgICB9O1xuICB9KTtcblxuICBVc2VyLmluamVjdChWaWV3KS5pbmplY3QoTW9kZWwpLmluamVjdChJbnRlbnQsIFByb3BzKVswXS5pbmplY3QoVXNlcik7XG5cbiAgcmV0dXJuIHtcbiAgICAvLyBBcyBNb2RlbDo6ZmF2b3JpdGUkIGFscmVhZHkgZGVwZW5kZXMgb24gSW50ZW50Ojp0b2dnbGUkIHdlIGNhbiBvbmx5IHVzZSBgLndpdGhMYXRlc3RGcm9tYFxuICAgIC8vIGAuZmxhdE1hcChNb2RlbC5nZXQoXCJmYXZvcml0ZSRcIikpYCB3b3VsZCBjcmVhdGUgbmV3IG9ic2VydmFibGVzIGF0IGV2ZXJ5IHN0ZXAgKGNpcmN1bGFyIGRlcGVuZGVuY3kgPT4gbWVtb3J5IGxlYWspXG4gICAgZmF2dXAkOiBJbnRlbnQuZ2V0KFwidG9nZ2xlJFwiKVxuICAgICAgLndpdGhMYXRlc3RGcm9tKE1vZGVsLmdldChcImZhdm9yaXRlJFwiKSwgKF8sIGZhdikgPT4gZmF2KVxuICAgICAgLmZpbHRlcih2ID0+ICF2KVxuICAgICAgLmZsYXRNYXAoTW9kZWwuZ2V0KFwic3JjJFwiKSksXG5cbiAgICB1bmZhdiQ6IEludGVudC5nZXQoXCJ0b2dnbGUkXCIpXG4gICAgICAud2l0aExhdGVzdEZyb20oTW9kZWwuZ2V0KFwiZmF2b3JpdGUkXCIpLCAoXywgZmF2KSA9PiBmYXYpXG4gICAgICAuZmlsdGVyKHYgPT4gdilcbiAgICAgIC5mbGF0TWFwKE1vZGVsLmdldChcInNyYyRcIikpLFxuICB9O1xufSk7IiwiLy8gQ09OU1RTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY29uc3QgcGljdHVyZXMgPSBbXG4gIHtcbiAgICBzcmM6IFwiaHR0cHM6Ly9hdmF0YXJzMy5naXRodWJ1c2VyY29udGVudC5jb20vdS85ODQzNjg/dj0zJnM9NDAwXCIsXG4gICAgdGl0bGU6IFwiQW5ndWxhckpTXCIsXG4gICAgZmF2b3JpdGU6IGZhbHNlXG4gIH0sXG4gIHtcbiAgICBzcmM6IFwiaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I1QUpSZldDWUFBYkx5Si5wbmdcIixcbiAgICB0aXRsZTogXCJSeEpTXCIsXG4gICAgZmF2b3JpdGU6IHRydWVcbiAgfSxcbiAge1xuICAgIHNyYzogXCJodHRwczovL2xoNi5nb29nbGV1c2VyY29udGVudC5jb20vLVRsWTdhbXNmelBzL1Q5WmdMWFhLMWNJL0FBQUFBQUFCSy1jL0tpLWlubWVZTktrL3c3NDktaDc5NC9Bbmd1bGFySlMtU2hpZWxkLWxhcmdlLnBuZ1wiLFxuICAgIHRpdGxlOiBcIkN5Y2xlSlNcIixcbiAgfSxcbl07XG5cbi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeCwgaH0gPSBDeWNsZTtcblxuLy8gVklFV1MgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgQ3ljbGUuY3JlYXRlVmlldygoKSA9PiAoe1xuICB2dHJlZSQ6IFJ4Lk9ic2VydmFibGUucmV0dXJuKFxuICAgIGgoJ2RpdicsIHtjbGFzc05hbWU6IFwicGljdHVyZXNcIn0sIFtcbiAgICAgIGgoJ1BpY3R1cmUnLCB7c3JjOiBwaWN0dXJlc1swXS5zcmMsIHRpdGxlOiBwaWN0dXJlc1swXS50aXRsZSwgZmF2b3JpdGU6IHBpY3R1cmVzWzBdLmZhdm9yaXRlLCB3aWR0aDogXCIxMDBcIiwgc29tZXRoaW5nOiBcInhcIn0pLFxuICAgICAgaCgnUGljdHVyZScsIHtzcmM6IHBpY3R1cmVzWzFdLnNyYywgdGl0bGU6IHBpY3R1cmVzWzFdLnRpdGxlLCBmYXZvcml0ZTogcGljdHVyZXNbMV0uZmF2b3JpdGUsIHdpZHRoOiBcIjEwMFwiLCBzb21ldGhpbmc6IFwieVwifSksXG4gICAgICBoKCdQaWN0dXJlJywge3NyYzogcGljdHVyZXNbMl0uc3JjLCB0aXRsZTogcGljdHVyZXNbMl0udGl0bGUsIHdpZHRoOiBcIjEwMFwiLCBzb21ldGhpbmc6IFwielwifSlcbiAgICBdKVxuICApLFxufSkpOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbnJlcXVpcmUoXCJiYWJlbC9wb2x5ZmlsbFwiKTtcblxuLy8gU0hJTVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEN5Y2xlID0gcmVxdWlyZShcImN5Y2xlanNcIik7XG5sZXQge1J4fSA9IEN5Y2xlO1xuXG5DeWNsZS5sYXRlc3QgPSBmdW5jdGlvbiAoRGF0YU5vZGUsIGtleXMsIHJlc3VsdFNlbGVjdG9yKSB7XG4gIGxldCBvYnNlcnZhYmxlcyA9IGtleXMubWFwKGtleSA9PiBEYXRhTm9kZS5nZXQoa2V5KSk7XG4gIGxldCBhcmdzID0gb2JzZXJ2YWJsZXMuY29uY2F0KFtcbiAgICBmdW5jdGlvbiBzZWxlY3RvciguLi5saXN0KSB7XG4gICAgICBsZXQgbW9kZWwgPSBrZXlzLnJlZHVjZSgobW9kZWwsIGtleSkgPT4ge1xuICAgICAgICBtb2RlbFtrZXkuc2xpY2UoMCwgLTEpXSA9IGxpc3Rba2V5cy5pbmRleE9mKGtleSldO1xuICAgICAgICByZXR1cm4gbW9kZWw7XG4gICAgICB9LCB7fSk7XG4gICAgICByZXR1cm4gcmVzdWx0U2VsZWN0b3IobW9kZWwpO1xuICAgIH1cbiAgXSk7XG4gIHJldHVybiBSeC5PYnNlcnZhYmxlLmNvbWJpbmVMYXRlc3QuYXBwbHkobnVsbCwgYXJncyk7XG59O1xuXG5jb25zb2xlLnNweSA9IGZ1bmN0aW9uIHNweSguLi5wYXJhbXMpIHtcbiAgcmV0dXJuIGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSwgLi4ucGFyYW1zKTtcbn07Il19