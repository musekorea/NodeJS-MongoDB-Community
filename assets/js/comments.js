/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var runtime = function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.

  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }

  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.

    generator._invoke = makeInvokeMethod(innerFn, self, context);
    return generator;
  }

  exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.

  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.

  var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.

  function Generator() {}

  function GeneratorFunction() {}

  function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.


  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"); // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.

  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  exports.mark = function (genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }

    genFun.prototype = Object.create(Gp);
    return genFun;
  }; // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.


  exports.awrap = function (arg) {
    return {
      __await: arg
    };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);

      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;

        if (value && _typeof(value) === "object" && hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function (error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise = // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    } // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).


    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.

  exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;
    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        } // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;

        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);

          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;
        var record = tryCatch(innerFn, self, context);

        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted; // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.

          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  } // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.


  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];

    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (!info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

      context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.

      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }
    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    } // The delegate iterator is finished, so forget it and continue with
    // the outer generator.


    context.delegate = null;
    return ContinueSentinel;
  } // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.


  defineIteratorMethods(Gp);
  define(Gp, toStringTagSymbol, "Generator"); // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.

  define(Gp, iteratorSymbol, function () {
    return this;
  });
  define(Gp, "toString", function () {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{
      tryLoc: "root"
    }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function (object) {
    var keys = [];

    for (var key in object) {
      keys.push(key);
    }

    keys.reverse(); // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.

    return function next() {
      while (keys.length) {
        var key = keys.pop();

        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      } // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.


      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];

      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;
          return next;
        };

        return next.next = next;
      }
    } // Return an iterator with no values.


    return {
      next: doneResult
    };
  }

  exports.values = values;

  function doneResult() {
    return {
      value: undefined,
      done: true
    };
  }

  Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0; // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.

      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;
      this.method = "next";
      this.arg = undefined;
      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },
    stop: function stop() {
      this.done = true;
      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;

      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;

      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;

          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }

          return thrown;
        }
      } // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.


      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  }; // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.

  return exports;
}( // If this script is executing as a CommonJS module, use module.exports
// as the regeneratorRuntime namespace. Otherwise create a new empty
// object. Either way, the resulting object will be used to initialize
// the regeneratorRuntime variable at the top of this file.
( false ? 0 : _typeof(module)) === "object" ? module.exports : {});

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if ((typeof globalThis === "undefined" ? "undefined" : _typeof(globalThis)) === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*******************************!*\
  !*** ./public/js/comments.js ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var regenerator_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! regenerator-runtime */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime__WEBPACK_IMPORTED_MODULE_0__);
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


var articleContainer = document.querySelector('#articleContainer');
var commentBtn = document.querySelector('#commentBtn');
var commentForm = document.querySelector('#commentForm');
var commentCancelBtn = document.querySelector('#commentCancelBtn');
var commentInput = document.querySelector('#commentInput');
var commentsContainer = document.querySelector('#commentsContainer');
var commentNumbers = document.querySelectorAll('.commentsNumber');
var commentDeleteBtns = document.querySelectorAll('.commentDeleteBtn');
var nestedDeleteBtns = document.querySelectorAll('.nestedDeleteBtn');
var editBtn = document.querySelector('#editBtn');
var dataSet = document.querySelector('#dataSet');
var currentURL = window.location.href.split('/');
var postID = currentURL[currentURL.length - 1];
var nestedState = false;
var commentState = false;
var commentID;
var parentComment;

var createdAt = function createdAt(oldTime) {
  var currentTime = Math.floor(new Date().getTime() / (1000 * 60));
  var targetTime = Math.floor(Number(oldTime / (1000 * 60)));
  var calTime = currentTime - targetTime;
  var resultTime;
  var resultCreatedAt;

  if (calTime < 60) {
    resultTime = calTime;
    return resultCreatedAt = resultTime <= 1 ? "1 minute ago" : "".concat(resultTime, " minutes ago");
  } else if (calTime >= 60 && calTime < 60 * 24) {
    resultTime = Math.floor(calTime / 60);
    return resultCreatedAt = resultTime <= 1 ? "1 hour ago" : "".concat(resultTime, " hours ago");
  } else if (calTime >= 60 * 24 && calTime < 60 * 24 * 30) {
    resultTime = Math.floor(calTime / (60 * 24));
    return resultCreatedAt = resultTime <= 1 ? "1 day ago" : "".concat(resultTime, " day ago");
  } else if (calTime >= 60 * 24 * 30 && calTime < 60 * 24 * 30 * 12) {
    resultTime = Math.floor(calTime / (60 * 24 * 30));
    return resultCreatedAt = resultTime <= 1 ? "1 month ago" : "".concat(resultTime, " months ago");
  } else {
    resultTime = Math.floor(calTime / (60 * 24 * 30 * 12));
    return resultCreatedAt = resultTime <= 1 ? "1 year ago" : "".concat(resultTime, " years ago");
  }
};

var createComment = function createComment(comment) {
  var commentDiv = document.createElement('div');
  commentDiv.className = "mb-3";
  commentDiv.style = "\n  border: 1px solid rgba(90, 40, 40, 0.1);\n  border-top:none;\n  border-left:none;\n  border-radius: 20px;\n  background-color: aliceblue;\n  box-shadow: 6px 6px 6px rgba(0, 0, 0, 0.2);\n  padding:10px 20px 10px 20px;\n  position:relative;\n";
  var commentHeader = document.createElement('div');
  commentHeader.className = "mb-3";
  var commentAvatar = document.createElement('img');
  commentHeader.innerHTML = "".concat(dataSet.dataset.user, " | ").concat(createdAt(new Date().getTime()));
  commentAvatar.src = dataSet.dataset.avatar;
  commentAvatar.style = "width:30px;height:30px;border-radius:50%;margin-right:15px";
  commentHeader.prepend(commentAvatar);
  var commentBody = document.createElement('p');
  commentBody.innerHTML = comment;
  var nestedCommentBtn = document.createElement('button');
  nestedCommentBtn.innerHTML = "\u21A9";
  nestedCommentBtn.className = "nestedCommentBtn";
  nestedCommentBtn.style = "pointer-events:auto";
  nestedCommentBtn.type = "button";
  var commentDeleteJSBtn = document.createElement('a');
  commentDeleteJSBtn.className = "commentDeleteBtn";
  commentDeleteJSBtn.innerHTML = "\n  <button\n      style=\"\n        color: white;\n        border: none;\n        outline: none;\n        background-color: steelblue;\n        border-radius: 10px;\n        position: absolute;\n        top: 10px;\n        right: 30px;\n      \"\n    >\n      Delete\n    </button>";
  commentDiv.append(commentHeader, commentBody, nestedCommentBtn, commentDeleteJSBtn);
  commentsContainer.prepend(commentDiv);
  commentState = false;
  refreshNestedCommentBtns();
  var nestCommentContainer = document.createElement('div');
  commentsContainer.insertBefore(nestCommentContainer, commentDiv.nextSibling);
  refreshCommentDeleteBtns();
};

var addComment = function addComment(e) {
  e.preventDefault();
  commentBtn.classList.add('hide');
  commentForm.classList.remove('hide');
  editBtn.classList.add('hide');
  commentState = true;
  commentDeleteBtns.forEach(function (commentDeleteBtn) {
    commentDeleteBtn.style = "pointer-events: none";
  });
  nestedDeleteBtns.forEach(function (nestedDeleteBtn) {
    nestedDeleteBtn.style = "pointer-events: none";
  });
  document.querySelectorAll('.nestedCommentBtn').forEach(function (nestedCommentBtn) {
    nestedCommentBtn.style = "pointer-events: none";
  });
};

var cancelComment = function cancelComment(e) {
  commentInput.value = '';
  commentBtn.classList.remove('hide');
  commentForm.classList.add('hide');
  editBtn.classList.remove('hide');
  commentState = false;
  commentDeleteBtns.forEach(function (commentDeleteBtn) {
    commentDeleteBtn.style = "pointer-events: auto";
  });
  nestedDeleteBtns.forEach(function (nestedDeleteBtn) {
    nestedDeleteBtn.style = "pointer-events: auto";
  });
  document.querySelectorAll('.nestedCommentBtn').forEach(function (nestedCommentBtn) {
    nestedCommentBtn.style = "pointer-events: auto";
  });
};

var submitComment = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regenerator_runtime__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee(e) {
    var comment, fetchComment, _commentID, currentComment, nestCommentContainer;

    return regenerator_runtime__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            e.preventDefault();
            comment = commentInput.value;
            _context.prev = 2;
            _context.next = 5;
            return fetch("/community/comments/".concat(postID), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                comment: comment
              })
            });

          case 5:
            fetchComment = _context.sent;

            if (!(fetchComment.status === 200)) {
              _context.next = 20;
              break;
            }

            cancelComment();
            createComment(comment);
            _context.next = 11;
            return fetchComment.json();

          case 11:
            _commentID = _context.sent;
            _commentID = _commentID.commentID;
            currentComment = commentsContainer.firstElementChild;
            currentComment.id = _commentID;
            nestCommentContainer = currentComment.nextElementSibling;
            nestCommentContainer.className = _commentID;
            refreshNestedCommentBtns();
            commentState = false;
            commentNumbers.forEach(function (commentNumber) {
              commentNumber.innerText = "".concat(Number(commentNumber.innerText) + 1);
            });

          case 20:
            _context.next = 25;
            break;

          case 22:
            _context.prev = 22;
            _context.t0 = _context["catch"](2);
            console.log(_context.t0);

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 22]]);
  }));

  return function submitComment(_x) {
    return _ref.apply(this, arguments);
  };
}();

var renderingNestedComment = function renderingNestedComment(nestID, content) {
  var nickname = dataSet.dataset.user;
  var avatar = dataSet.dataset.avatar;
  var nestedForm = document.querySelector('#nestedForm');
  nestedForm.remove();
  var commentDiv = document.createElement('div');
  commentDiv.className = "mb-3";
  commentDiv.id = "".concat(nestID);
  commentDiv.style = "\n  border: 1px solid rgba(90, 40, 40, 0.1);\n  border-top:none;\n  border-left:none;\n  border-radius: 20px;\n  background-color: thistle;\n  box-shadow: 6px 6px 6px rgba(0, 0, 0, 0.2);\n  padding:10px 20px 10px 20px;\n  position:relative;\n  left:20%;\n  width:80%\n";
  var commentHeader = document.createElement('div');
  commentHeader.className = "mb-3";
  var commentAvatar = document.createElement('img');
  commentHeader.innerHTML = "".concat(nickname, " | ").concat(createdAt(new Date().getTime()));
  commentAvatar.src = avatar;
  commentAvatar.style = "width:30px;height:30px;border-radius:50%;margin-right:15px";
  commentHeader.prepend(commentAvatar);
  var commentBody = document.createElement('p');
  commentBody.innerHTML = content;
  var renderNestedDelBtn = document.createElement('a');
  renderNestedDelBtn.className = "nestedDeleteBtn";
  renderNestedDelBtn.innerHTML = "\n  <button\n      style=\"\n        color: white;\n        border: none;\n        outline: none;\n        background-color: steelblue;\n        border-radius: 10px;\n        position: absolute;\n        top: 10px;\n        right: 30px;\n      \"\n    >\n      Delete\n    </button>";
  commentDiv.append(commentHeader, commentBody, renderNestedDelBtn);
  var parentCommentDiv = document.querySelector("[id=\"".concat(commentID, "\"]"));
  parentCommentDiv.nextElementSibling.append(commentDiv);
  refreshNestedCommentBtns();
  refreshNestedDeleteBtns();
  nestedState = false;
  commentState = false;
};

var submitNestedComment = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator_runtime__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee2(e) {
    var content, replyInput, nestFetch, nestJson;
    return regenerator_runtime__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            e.preventDefault();
            content = e.target.children[0].value;

            if (!(content === '' || !content)) {
              _context2.next = 8;
              break;
            }

            replyInput = document.querySelector('#nestedInput');
            replyInput.placeholder = "Must not be empty \uD83E\uDD38\u200D\u2640\uFE0F";
            replyInput.classList.add('placeholderError');
            nestedState = true;
            return _context2.abrupt("return");

          case 8:
            _context2.prev = 8;
            _context2.next = 11;
            return fetch("/community/nested/".concat(postID), {
              method: 'post',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                postID: postID,
                commentID: commentID,
                content: content
              })
            });

          case 11:
            nestFetch = _context2.sent;
            _context2.next = 14;
            return nestFetch.json();

          case 14:
            nestJson = _context2.sent;

            if (nestFetch.status === 200) {
              nestedState = false;
              commentState = false;
              renderingNestedComment(nestJson.nestedCommentID, content);
            }

            commentBtn.style = "pointer-events: auto";
            editBtn.style = "pointer-events: auto";
            commentNumbers.forEach(function (commentNumber) {
              commentNumber.innerText = "".concat(Number(commentNumber.innerText) + 1);
            });
            _context2.next = 24;
            break;

          case 21:
            _context2.prev = 21;
            _context2.t0 = _context2["catch"](8);
            console.log(_context2.t0);

          case 24:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[8, 21]]);
  }));

  return function submitNestedComment(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var handleClickNestedComment = function handleClickNestedComment(e) {
  if (commentState === true) {
    return;
  }

  if (nestedState === false) {
    parentComment = e.target.parentElement;
    commentID = parentComment.id;
    var nestedForm = document.createElement('form');
    nestedForm.id = 'nestedForm';
    nestedForm.className = "input-group mb-3";
    var nestedInput = document.createElement('input');
    nestedInput.id = "nestedInput";
    nestedInput.className = "form-control";
    nestedInput.placeholder = "Add a comment";
    nestedInput.ariaRoleDescription = "button-addon2";
    var nestedInputButton = document.createElement('button');
    nestedInputButton.className = "btn btn-outline-secondary";
    nestedInputButton.id = "button-addon2";
    nestedInputButton.innerHTML = "reply";
    nestedInputButton.style = "background-color:tomato;color:white";
    nestedForm.append(nestedInput);
    nestedForm.append(nestedInputButton);
    commentsContainer.insertBefore(nestedForm, parentComment.nextSibling);
    commentBtn.style = "pointer-events: none";
    editBtn.style = "pointer-events: none";
    nestedForm.addEventListener('submit', submitNestedComment);
    nestedState = true;
    document.querySelectorAll('.commentDeleteBtn').forEach(function (commentDeleteBtn) {
      commentDeleteBtn.style = "display:none";
    });
    nestedDeleteBtns.forEach(function (nestedDeleteBtn) {
      nestedDeleteBtn.style = "display:none";
    });
  } else {
    var _nestedForm = document.querySelector('#nestedForm');

    _nestedForm.remove();

    nestedState = false;
    commentBtn.style = "pointer-events: auto";
    editBtn.style = "pointer-events: auto";
    document.querySelectorAll('.commentDeleteBtn').forEach(function (commentDeleteBtn) {
      commentDeleteBtn.style = "display:block";
    });
    nestedDeleteBtns.forEach(function (nestedDeleteBtn) {
      nestedDeleteBtn.style = "display:block";
    });
  }
};

var commentDelete = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regenerator_runtime__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee3(e) {
    var targetComment, checkNested, nestedModal, nestedModalBtn, deleteComment, comment, nestedCommentContainer;
    return regenerator_runtime__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            e.preventDefault();
            targetComment = e.target.parentElement.parentElement;
            checkNested = targetComment.nextElementSibling;

            if (!checkNested.innerHTML) {
              _context3.next = 13;
              break;
            }

            document.body.style = 'overflow:hidden';
            nestedModal = document.createElement('div');
            nestedModal.id = "nestedModal";
            nestedModal.style = "position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.4);overflow:hidden";
            nestedModal.innerHTML = "\n    <div class=\"modal-dialog\" style=\"top:30%\">\n      <div class=\"modal-content\">\n        <div class=\"modal-body\">\n          <p>If the comment has a nested comment, you'cant delete</p>\n        </div>\n        <div class=\"modal-footer\">\n          <button id=\"nestedModalBtn\" type=\"button\" class=\"btn btn-secondary\" >Close</button>\n        </div>\n      </div>\n    </div>\n  ";
            articleContainer.append(nestedModal);
            nestedModalBtn = document.querySelector('#nestedModalBtn');
            nestedModalBtn.addEventListener('click', function () {
              nestedModal.remove();
              document.body.style = 'overflow:auto';
              return;
            });
            return _context3.abrupt("return");

          case 13:
            _context3.prev = 13;
            _context3.next = 16;
            return fetch("/community/comments/".concat(postID), {
              method: 'delete',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                commentID: targetComment.id
              })
            });

          case 16:
            deleteComment = _context3.sent;

            if (deleteComment.status === 200) {
              comment = document.querySelector("[id=\"".concat(targetComment.id, "\"]"));
              nestedCommentContainer = document.querySelector("[class=\"".concat(targetComment.id, "\"]"));
              commentNumbers.forEach(function (commentNumber) {
                commentNumber.innerText = "".concat(Number(commentNumber.innerText) - 1);
              });
              comment.remove();
              nestedCommentContainer.remove();
            }

            _context3.next = 23;
            break;

          case 20:
            _context3.prev = 20;
            _context3.t0 = _context3["catch"](13);
            console.log(_context3.t0);

          case 23:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[13, 20]]);
  }));

  return function commentDelete(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var nestedDelete = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regenerator_runtime__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee4(e) {
    var parentNested, parentCommentID, nestedID, deleteNested;
    return regenerator_runtime__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            parentNested = e.target.parentElement.parentElement;
            parentCommentID = e.target.parentElement.parentElement.parentElement.className;
            nestedID = parentNested.id;
            _context4.prev = 3;
            _context4.next = 6;
            return fetch("/community/nested/".concat(nestedID), {
              method: 'delete',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                postID: postID,
                commentID: parentCommentID
              })
            });

          case 6:
            deleteNested = _context4.sent;

            if (deleteNested.status === 200) {
              commentNumbers.forEach(function (commentNumber) {
                commentNumber.innerText = "".concat(Number(commentNumber.innerText) - 1);
              });
              parentNested.remove();
            }

            _context4.next = 13;
            break;

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](3);
            console.log(_context4.t0);

          case 13:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[3, 10]]);
  }));

  return function nestedDelete(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

if (commentBtn) {
  commentBtn.addEventListener('click', addComment);
}

if (commentCancelBtn) {
  commentCancelBtn.addEventListener('click', cancelComment);
}

if (commentForm) {
  commentForm.addEventListener('submit', submitComment);
}

var refreshCommentDeleteBtns = function refreshCommentDeleteBtns() {
  commentDeleteBtns = document.querySelectorAll(".commentDeleteBtn");

  if (commentDeleteBtns) {
    commentDeleteBtns.forEach(function (commentDeleteBtn) {
      commentDeleteBtn.addEventListener('click', commentDelete);
    });
  }
};

var refreshNestedCommentBtns = function refreshNestedCommentBtns() {
  if (articleContainer.dataset.isloggedin === 'true') {
    var allNestedBtn = document.querySelectorAll('.nestedCommentBtn');
    allNestedBtn.forEach(function (nestedBtn) {
      nestedBtn.addEventListener('click', handleClickNestedComment);
    });
  }
};

var refreshNestedDeleteBtns = function refreshNestedDeleteBtns() {
  if (nestedDeleteBtns) {
    nestedDeleteBtns = document.querySelectorAll(".nestedDeleteBtn");
    nestedDeleteBtns.forEach(function (nestedDelBtn) {
      nestedDelBtn.addEventListener('click', nestedDelete);
    });
  }
};

function init() {
  refreshNestedCommentBtns();
  refreshCommentDeleteBtns();
  refreshNestedDeleteBtns();
}

init();
})();

/******/ })()
;
//# sourceMappingURL=comments.js.map