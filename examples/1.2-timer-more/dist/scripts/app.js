(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var makeClass = require("classnames");
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

// APP =============================================================================================
var Model = Cycle.createModel(function (Intent) {
  var started = Date.now();
  var control$ = Rx.Observable.merge(Intent.get("continue$"), Intent.get("pause$").map(function () {
    return false;
  }));
  return {
    msSinceStart$: Rx.Observable.interval(100).map(function () {
      return Date.now() - started;
    }).pausable(control$.startWith(true)).takeUntil(Intent.get("stop$")),

    stopped$: Intent.get("stop$").startWith(false) };
});

var View = Cycle.createView(function (Model) {
  return {
    vtree$: Rx.Observable.combineLatest(Model.get("msSinceStart$"), Model.get("stopped$"), function (msSinceStart, stopped) {
      var timeDelta = (msSinceStart / 1000).toFixed(1);
      return h("div", null, [h("p", { className: makeClass({ muted: stopped }) }, ["Started ", timeDelta, " seconds ago ", stopped ? "(Timer stopped)" : ""]), h("div", { className: "btn-group" }, [h("button", { className: "btn btn-default pause", disabled: stopped }, ["Pause"]), h("button", { className: "btn btn-default continue", disabled: stopped }, ["Continue"]), h("button", { className: "btn btn-default stop", disabled: stopped }, ["Stop"])])]);
    }) };
});

var Intent = Cycle.createIntent(function (User) {
  return {
    pause$: User.event$(".btn.pause", "click").map(function () {
      return true;
    }),
    continue$: User.event$(".btn.continue", "click").map(function () {
      return true;
    }),
    stop$: User.event$(".btn.stop", "click").map(function () {
      return true;
    }) };
});

var User = Cycle.createDOMUser("main");

User.inject(View).inject(Model).inject(Intent).inject(User);

},{"classnames":"classnames","cyclejs":"cyclejs"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJ1aWxkL3NjcmlwdHMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDQ0EsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3RDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxQixFQUFFLEdBQU8sS0FBSyxDQUFkLEVBQUU7SUFBRSxDQUFDLEdBQUksS0FBSyxDQUFWLENBQUM7OztBQUdWLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsVUFBQSxNQUFNLEVBQUk7QUFDdEMsTUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3pCLE1BQUksUUFBUSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUNoQyxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUN2QixNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQztXQUFNLEtBQUs7R0FBQSxDQUFDLENBQ3RDLENBQUM7QUFDRixTQUFPO0FBQ0wsaUJBQWEsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FDdkMsR0FBRyxDQUFDO2FBQU0sSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLE9BQU87S0FBQSxDQUFDLENBQy9CLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQ2xDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVqQyxZQUFRLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQy9DLENBQUM7Q0FDSCxDQUFDLENBQUM7O0FBRUgsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxVQUFBLEtBQUssRUFBSTtBQUNuQyxTQUFPO0FBQ0wsVUFBTSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUNqQyxLQUFLLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQ2pELFVBQVMsWUFBWSxFQUFFLE9BQU8sRUFBRTtBQUM5QixVQUFJLFNBQVMsR0FBRyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUEsQ0FBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakQsYUFDRSxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxDQUNiLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQyxDQUFDLEVBQUMsRUFBRSxDQUMvQyxVQUFVLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxPQUFPLEdBQUcsaUJBQWlCLEdBQUcsRUFBRSxDQUN6RSxDQUFDLEVBQ0YsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUMsRUFBRSxDQUNqQyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUMsU0FBUyxFQUFFLHVCQUF1QixFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQy9FLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBQyxTQUFTLEVBQUUsMEJBQTBCLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsRUFDckYsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFDLFNBQVMsRUFBRSxzQkFBc0IsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUM5RSxDQUFDLENBQ0gsQ0FBQyxDQUNGO0tBQ0gsQ0FDRixFQUNGLENBQUM7Q0FDSCxDQUFDLENBQUM7O0FBRUgsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxVQUFBLElBQUksRUFBSTtBQUN0QyxTQUFPO0FBQ0wsVUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQzthQUFNLElBQUk7S0FBQSxDQUFDO0FBQzFELGFBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUM7YUFBTSxJQUFJO0tBQUEsQ0FBQztBQUNoRSxTQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDO2FBQU0sSUFBSTtLQUFBLENBQUMsRUFDekQsQ0FBQTtDQUNGLENBQUMsQ0FBQzs7QUFFSCxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUV2QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBtYWtlQ2xhc3MgPSByZXF1aXJlKFwiY2xhc3NuYW1lc1wiKTtcbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeCwgaH0gPSBDeWNsZTtcblxuLy8gQVBQID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IE1vZGVsID0gQ3ljbGUuY3JlYXRlTW9kZWwoSW50ZW50ID0+IHtcbiAgbGV0IHN0YXJ0ZWQgPSBEYXRlLm5vdygpO1xuICBsZXQgY29udHJvbCQgPSBSeC5PYnNlcnZhYmxlLm1lcmdlKFxuICAgIEludGVudC5nZXQoXCJjb250aW51ZSRcIiksXG4gICAgSW50ZW50LmdldChcInBhdXNlJFwiKS5tYXAoKCkgPT4gZmFsc2UpXG4gICk7XG4gIHJldHVybiB7XG4gICAgbXNTaW5jZVN0YXJ0JDogUnguT2JzZXJ2YWJsZS5pbnRlcnZhbCgxMDApXG4gICAgICAubWFwKCgpID0+IERhdGUubm93KCkgLSBzdGFydGVkKVxuICAgICAgLnBhdXNhYmxlKGNvbnRyb2wkLnN0YXJ0V2l0aCh0cnVlKSlcbiAgICAgIC50YWtlVW50aWwoSW50ZW50LmdldChcInN0b3AkXCIpKSxcblxuICAgIHN0b3BwZWQkOiBJbnRlbnQuZ2V0KFwic3RvcCRcIikuc3RhcnRXaXRoKGZhbHNlKSxcbiAgfTtcbn0pO1xuXG5sZXQgVmlldyA9IEN5Y2xlLmNyZWF0ZVZpZXcoTW9kZWwgPT4ge1xuICByZXR1cm4ge1xuICAgIHZ0cmVlJDogUnguT2JzZXJ2YWJsZS5jb21iaW5lTGF0ZXN0KFxuICAgICAgTW9kZWwuZ2V0KFwibXNTaW5jZVN0YXJ0JFwiKSwgTW9kZWwuZ2V0KFwic3RvcHBlZCRcIiksXG4gICAgICBmdW5jdGlvbihtc1NpbmNlU3RhcnQsIHN0b3BwZWQpIHtcbiAgICAgICAgbGV0IHRpbWVEZWx0YSA9IChtc1NpbmNlU3RhcnQgLyAxMDAwKS50b0ZpeGVkKDEpO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIGgoJ2RpdicsIG51bGwsIFtcbiAgICAgICAgICAgIGgoJ3AnLCB7Y2xhc3NOYW1lOiBtYWtlQ2xhc3Moe211dGVkOiBzdG9wcGVkfSl9LCBbXG4gICAgICAgICAgICAgIFwiU3RhcnRlZCBcIiwgdGltZURlbHRhLCBcIiBzZWNvbmRzIGFnbyBcIiwgc3RvcHBlZCA/IFwiKFRpbWVyIHN0b3BwZWQpXCIgOiBcIlwiXG4gICAgICAgICAgICBdKSxcbiAgICAgICAgICAgIGgoJ2RpdicsIHtjbGFzc05hbWU6IFwiYnRuLWdyb3VwXCJ9LCBbXG4gICAgICAgICAgICAgIGgoJ2J1dHRvbicsIHtjbGFzc05hbWU6IFwiYnRuIGJ0bi1kZWZhdWx0IHBhdXNlXCIsIGRpc2FibGVkOiBzdG9wcGVkfSwgW1wiUGF1c2VcIl0pLFxuICAgICAgICAgICAgICBoKCdidXR0b24nLCB7Y2xhc3NOYW1lOiBcImJ0biBidG4tZGVmYXVsdCBjb250aW51ZVwiLCBkaXNhYmxlZDogc3RvcHBlZH0sIFtcIkNvbnRpbnVlXCJdKSxcbiAgICAgICAgICAgICAgaCgnYnV0dG9uJywge2NsYXNzTmFtZTogXCJidG4gYnRuLWRlZmF1bHQgc3RvcFwiLCBkaXNhYmxlZDogc3RvcHBlZH0sIFtcIlN0b3BcIl0pXG4gICAgICAgICAgICBdKVxuICAgICAgICAgIF0pXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgKSxcbiAgfTtcbn0pO1xuXG5sZXQgSW50ZW50ID0gQ3ljbGUuY3JlYXRlSW50ZW50KFVzZXIgPT4ge1xuICByZXR1cm4ge1xuICAgIHBhdXNlJDogVXNlci5ldmVudCQoXCIuYnRuLnBhdXNlXCIsIFwiY2xpY2tcIikubWFwKCgpID0+IHRydWUpLFxuICAgIGNvbnRpbnVlJDogVXNlci5ldmVudCQoXCIuYnRuLmNvbnRpbnVlXCIsIFwiY2xpY2tcIikubWFwKCgpID0+IHRydWUpLFxuICAgIHN0b3AkOiBVc2VyLmV2ZW50JChcIi5idG4uc3RvcFwiLCBcImNsaWNrXCIpLm1hcCgoKSA9PiB0cnVlKSxcbiAgfVxufSk7XG5cbmxldCBVc2VyID0gQ3ljbGUuY3JlYXRlRE9NVXNlcihcIm1haW5cIik7XG5cblVzZXIuaW5qZWN0KFZpZXcpLmluamVjdChNb2RlbCkuaW5qZWN0KEludGVudCkuaW5qZWN0KFVzZXIpOyJdfQ==
