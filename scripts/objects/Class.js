/* Simple JavaScript Inheritance for ES 5.1
 * based on http://ejohn.org/blog/simple-javascript-inheritance/
 *  (inspired by base2 and Prototype)
 * MIT Licensed.
 */
(function(global) {
  "use strict";
  var fnTest = /xyz/.test(function(){xyz;}) ? /\bsuper\b/ : /.*/;

  // The base Class implementation (does nothing)
  function BaseClass(){}

  // Create a new Class that inherits from this class
  BaseClass.extend = function(props) {
    var superMethod = this.prototype;

    // Set up the prototype to inherit from the base class
    // (but without running the init constructor)
    var proto = Object.create(superMethod);

    // Copy the properties over onto the new prototype
    for (var name in props) {
      // Check if we're overwriting an existing function
      proto[name] = typeof props[name] === "function" && 
        typeof superMethod[name] == "function" && fnTest.test(props[name])
        ? (function(name, fn){
            return function() {
              var tmp = this.super;

              // Add a new .super() method that is the same method
              // but on the super-class
              this.super = superMethod[name];

              // The method only need to be bound temporarily, so we
              // remove it when we're done executing
              var ret = fn.apply(this, arguments);        
              this.super = tmp;

              return ret;
            };
          })(name, props[name])
        : props[name];
    }

    // The new constructor
    var newClass = typeof proto.construct === "function"
      ? proto.hasOwnProperty("construct")
        ? proto.construct // All construction is actually done in the construct method
        : function SubClass(){ superMethod.construct.apply(this, arguments); }
      : function EmptyClass(){};

    // Populate our constructed prototype object
    newClass.prototype = proto;

    // Enforce the constructor to be what we expect
    proto.constructor = newClass;

    // And make this class extendable
    newClass.extend = BaseClass.extend;

    return newClass;
  };

  // export
  global.Class = BaseClass;
})(this);