(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Promise = factory());
})(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var check = function (it) {
	  return it && it.Math == Math && it;
	}; // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028


	var global$D = // eslint-disable-next-line es/no-global-this -- safe
	check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) || // eslint-disable-next-line no-restricted-globals -- safe
	check(typeof self == 'object' && self) || check(typeof commonjsGlobal == 'object' && commonjsGlobal) || // eslint-disable-next-line no-new-func -- fallback
	function () {
	  return this;
	}() || Function('return this')();

	var objectGetOwnPropertyDescriptor = {};

	var fails$b = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	var fails$a = fails$b; // Detect IE8's incomplete defineProperty implementation


	var descriptors = !fails$a(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty({}, 1, {
	    get: function () {
	      return 7;
	    }
	  })[1] != 7;
	});

	var call$c = Function.prototype.call;
	var functionCall = call$c.bind ? call$c.bind(call$c) : function () {
	  return call$c.apply(call$c, arguments);
	};

	var objectPropertyIsEnumerable = {};

	var $propertyIsEnumerable = {}.propertyIsEnumerable; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe

	var getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor; // Nashorn ~ JDK8 bug

	var NASHORN_BUG = getOwnPropertyDescriptor$2 && !$propertyIsEnumerable.call({
	  1: 2
	}, 1); // `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable

	objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor$2(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : $propertyIsEnumerable;

	var createPropertyDescriptor$5 = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var FunctionPrototype$2 = Function.prototype;
	var bind$6 = FunctionPrototype$2.bind;
	var call$b = FunctionPrototype$2.call;
	var callBind = bind$6 && bind$6.bind(call$b);
	var functionUncurryThis = bind$6 ? function (fn) {
	  return fn && callBind(call$b, fn);
	} : function (fn) {
	  return fn && function () {
	    return call$b.apply(fn, arguments);
	  };
	};

	var uncurryThis$e = functionUncurryThis;

	var toString$6 = uncurryThis$e({}.toString);
	var stringSlice$1 = uncurryThis$e(''.slice);

	var classofRaw$1 = function (it) {
	  return stringSlice$1(toString$6(it), 8, -1);
	};

	var global$C = global$D;

	var uncurryThis$d = functionUncurryThis;

	var fails$9 = fails$b;

	var classof$6 = classofRaw$1;

	var Object$5 = global$C.Object;
	var split = uncurryThis$d(''.split); // fallback for non-array-like ES3 and non-enumerable old V8 strings

	var indexedObject = fails$9(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return !Object$5('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classof$6(it) == 'String' ? split(it, '') : Object$5(it);
	} : Object$5;

	var global$B = global$D;

	var TypeError$d = global$B.TypeError; // `RequireObjectCoercible` abstract operation
	// https://tc39.es/ecma262/#sec-requireobjectcoercible

	var requireObjectCoercible$3 = function (it) {
	  if (it == undefined) throw TypeError$d("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings
	var IndexedObject = indexedObject;

	var requireObjectCoercible$2 = requireObjectCoercible$3;

	var toIndexedObject$5 = function (it) {
	  return IndexedObject(requireObjectCoercible$2(it));
	};

	// `IsCallable` abstract operation
	// https://tc39.es/ecma262/#sec-iscallable
	var isCallable$i = function (argument) {
	  return typeof argument == 'function';
	};

	var isCallable$h = isCallable$i;

	var isObject$8 = function (it) {
	  return typeof it == 'object' ? it !== null : isCallable$h(it);
	};

	var global$A = global$D;

	var isCallable$g = isCallable$i;

	var aFunction = function (argument) {
	  return isCallable$g(argument) ? argument : undefined;
	};

	var getBuiltIn$9 = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(global$A[namespace]) : global$A[namespace] && global$A[namespace][method];
	};

	var uncurryThis$c = functionUncurryThis;

	var objectIsPrototypeOf = uncurryThis$c({}.isPrototypeOf);

	var getBuiltIn$8 = getBuiltIn$9;

	var engineUserAgent = getBuiltIn$8('navigator', 'userAgent') || '';

	var global$z = global$D;

	var userAgent$3 = engineUserAgent;

	var process$3 = global$z.process;
	var Deno = global$z.Deno;
	var versions = process$3 && process$3.versions || Deno && Deno.version;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.'); // in old Chrome, versions of V8 isn't V8 = Chrome / 10
	  // but their correct versions are not interesting for us

	  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
	} // BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
	// so check `userAgent` even if `.v8` exists, but 0


	if (!version && userAgent$3) {
	  match = userAgent$3.match(/Edge\/(\d+)/);

	  if (!match || match[1] >= 74) {
	    match = userAgent$3.match(/Chrome\/(\d+)/);
	    if (match) version = +match[1];
	  }
	}

	var engineV8Version = version;

	/* eslint-disable es/no-symbol -- required for testing */

	var V8_VERSION$1 = engineV8Version;

	var fails$8 = fails$b; // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing


	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails$8(function () {
	  var symbol = Symbol(); // Chrome 38 Symbol has incorrect toString conversion
	  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances

	  return !String(symbol) || !(Object(symbol) instanceof Symbol) || // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
	  !Symbol.sham && V8_VERSION$1 && V8_VERSION$1 < 41;
	});

	/* eslint-disable es/no-symbol -- required for testing */

	var NATIVE_SYMBOL$1 = nativeSymbol;

	var useSymbolAsUid = NATIVE_SYMBOL$1 && !Symbol.sham && typeof Symbol.iterator == 'symbol';

	var global$y = global$D;

	var getBuiltIn$7 = getBuiltIn$9;

	var isCallable$f = isCallable$i;

	var isPrototypeOf$3 = objectIsPrototypeOf;

	var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;

	var Object$4 = global$y.Object;
	var isSymbol$2 = USE_SYMBOL_AS_UID$1 ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  var $Symbol = getBuiltIn$7('Symbol');
	  return isCallable$f($Symbol) && isPrototypeOf$3($Symbol.prototype, Object$4(it));
	};

	var global$x = global$D;

	var String$5 = global$x.String;

	var tryToString$4 = function (argument) {
	  try {
	    return String$5(argument);
	  } catch (error) {
	    return 'Object';
	  }
	};

	var global$w = global$D;

	var isCallable$e = isCallable$i;

	var tryToString$3 = tryToString$4;

	var TypeError$c = global$w.TypeError; // `Assert: IsCallable(argument) is true`

	var aCallable$7 = function (argument) {
	  if (isCallable$e(argument)) return argument;
	  throw TypeError$c(tryToString$3(argument) + ' is not a function');
	};

	var aCallable$6 = aCallable$7; // `GetMethod` abstract operation
	// https://tc39.es/ecma262/#sec-getmethod


	var getMethod$3 = function (V, P) {
	  var func = V[P];
	  return func == null ? undefined : aCallable$6(func);
	};

	var global$v = global$D;

	var call$a = functionCall;

	var isCallable$d = isCallable$i;

	var isObject$7 = isObject$8;

	var TypeError$b = global$v.TypeError; // `OrdinaryToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-ordinarytoprimitive

	var ordinaryToPrimitive$1 = function (input, pref) {
	  var fn, val;
	  if (pref === 'string' && isCallable$d(fn = input.toString) && !isObject$7(val = call$a(fn, input))) return val;
	  if (isCallable$d(fn = input.valueOf) && !isObject$7(val = call$a(fn, input))) return val;
	  if (pref !== 'string' && isCallable$d(fn = input.toString) && !isObject$7(val = call$a(fn, input))) return val;
	  throw TypeError$b("Can't convert object to primitive value");
	};

	var shared$3 = {exports: {}};

	var global$u = global$D; // eslint-disable-next-line es/no-object-defineproperty -- safe


	var defineProperty$2 = Object.defineProperty;

	var setGlobal$3 = function (key, value) {
	  try {
	    defineProperty$2(global$u, key, {
	      value: value,
	      configurable: true,
	      writable: true
	    });
	  } catch (error) {
	    global$u[key] = value;
	  }

	  return value;
	};

	var global$t = global$D;

	var setGlobal$2 = setGlobal$3;

	var SHARED = '__core-js_shared__';
	var store$3 = global$t[SHARED] || setGlobal$2(SHARED, {});
	var sharedStore = store$3;

	var store$2 = sharedStore;

	(shared$3.exports = function (key, value) {
	  return store$2[key] || (store$2[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.20.1',
	  mode: 'global',
	  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
	});

	var global$s = global$D;

	var requireObjectCoercible$1 = requireObjectCoercible$3;

	var Object$3 = global$s.Object; // `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject

	var toObject$2 = function (argument) {
	  return Object$3(requireObjectCoercible$1(argument));
	};

	var uncurryThis$b = functionUncurryThis;

	var toObject$1 = toObject$2;

	var hasOwnProperty = uncurryThis$b({}.hasOwnProperty); // `HasOwnProperty` abstract operation
	// https://tc39.es/ecma262/#sec-hasownproperty

	var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
	  return hasOwnProperty(toObject$1(it), key);
	};

	var uncurryThis$a = functionUncurryThis;

	var id = 0;
	var postfix = Math.random();
	var toString$5 = uncurryThis$a(1.0.toString);

	var uid$2 = function (key) {
	  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$5(++id + postfix, 36);
	};

	var global$r = global$D;

	var shared$2 = shared$3.exports;

	var hasOwn$9 = hasOwnProperty_1;

	var uid$1 = uid$2;

	var NATIVE_SYMBOL = nativeSymbol;

	var USE_SYMBOL_AS_UID = useSymbolAsUid;

	var WellKnownSymbolsStore = shared$2('wks');
	var Symbol$1 = global$r.Symbol;
	var symbolFor = Symbol$1 && Symbol$1['for'];
	var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$1;

	var wellKnownSymbol$f = function (name) {
	  if (!hasOwn$9(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
	    var description = 'Symbol.' + name;

	    if (NATIVE_SYMBOL && hasOwn$9(Symbol$1, name)) {
	      WellKnownSymbolsStore[name] = Symbol$1[name];
	    } else if (USE_SYMBOL_AS_UID && symbolFor) {
	      WellKnownSymbolsStore[name] = symbolFor(description);
	    } else {
	      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
	    }
	  }

	  return WellKnownSymbolsStore[name];
	};

	var global$q = global$D;

	var call$9 = functionCall;

	var isObject$6 = isObject$8;

	var isSymbol$1 = isSymbol$2;

	var getMethod$2 = getMethod$3;

	var ordinaryToPrimitive = ordinaryToPrimitive$1;

	var wellKnownSymbol$e = wellKnownSymbol$f;

	var TypeError$a = global$q.TypeError;
	var TO_PRIMITIVE = wellKnownSymbol$e('toPrimitive'); // `ToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-toprimitive

	var toPrimitive$1 = function (input, pref) {
	  if (!isObject$6(input) || isSymbol$1(input)) return input;
	  var exoticToPrim = getMethod$2(input, TO_PRIMITIVE);
	  var result;

	  if (exoticToPrim) {
	    if (pref === undefined) pref = 'default';
	    result = call$9(exoticToPrim, input, pref);
	    if (!isObject$6(result) || isSymbol$1(result)) return result;
	    throw TypeError$a("Can't convert object to primitive value");
	  }

	  if (pref === undefined) pref = 'number';
	  return ordinaryToPrimitive(input, pref);
	};

	var toPrimitive = toPrimitive$1;

	var isSymbol = isSymbol$2; // `ToPropertyKey` abstract operation
	// https://tc39.es/ecma262/#sec-topropertykey


	var toPropertyKey$2 = function (argument) {
	  var key = toPrimitive(argument, 'string');
	  return isSymbol(key) ? key : key + '';
	};

	var global$p = global$D;

	var isObject$5 = isObject$8;

	var document$3 = global$p.document; // typeof document.createElement is 'object' in old IE

	var EXISTS$1 = isObject$5(document$3) && isObject$5(document$3.createElement);

	var documentCreateElement$2 = function (it) {
	  return EXISTS$1 ? document$3.createElement(it) : {};
	};

	var DESCRIPTORS$7 = descriptors;

	var fails$7 = fails$b;

	var createElement$1 = documentCreateElement$2; // Thank's IE8 for his funny defineProperty


	var ie8DomDefine = !DESCRIPTORS$7 && !fails$7(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty(createElement$1('div'), 'a', {
	    get: function () {
	      return 7;
	    }
	  }).a != 7;
	});

	var DESCRIPTORS$6 = descriptors;

	var call$8 = functionCall;

	var propertyIsEnumerableModule = objectPropertyIsEnumerable;

	var createPropertyDescriptor$4 = createPropertyDescriptor$5;

	var toIndexedObject$4 = toIndexedObject$5;

	var toPropertyKey$1 = toPropertyKey$2;

	var hasOwn$8 = hasOwnProperty_1;

	var IE8_DOM_DEFINE$1 = ie8DomDefine; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe


	var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor

	objectGetOwnPropertyDescriptor.f = DESCRIPTORS$6 ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject$4(O);
	  P = toPropertyKey$1(P);
	  if (IE8_DOM_DEFINE$1) try {
	    return $getOwnPropertyDescriptor(O, P);
	  } catch (error) {
	    /* empty */
	  }
	  if (hasOwn$8(O, P)) return createPropertyDescriptor$4(!call$8(propertyIsEnumerableModule.f, O, P), O[P]);
	};

	var objectDefineProperty = {};

	var global$o = global$D;

	var isObject$4 = isObject$8;

	var String$4 = global$o.String;
	var TypeError$9 = global$o.TypeError; // `Assert: Type(argument) is Object`

	var anObject$a = function (argument) {
	  if (isObject$4(argument)) return argument;
	  throw TypeError$9(String$4(argument) + ' is not an object');
	};

	var global$n = global$D;

	var DESCRIPTORS$5 = descriptors;

	var IE8_DOM_DEFINE = ie8DomDefine;

	var anObject$9 = anObject$a;

	var toPropertyKey = toPropertyKey$2;

	var TypeError$8 = global$n.TypeError; // eslint-disable-next-line es/no-object-defineproperty -- safe

	var $defineProperty = Object.defineProperty; // `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty

	objectDefineProperty.f = DESCRIPTORS$5 ? $defineProperty : function defineProperty(O, P, Attributes) {
	  anObject$9(O);
	  P = toPropertyKey(P);
	  anObject$9(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return $defineProperty(O, P, Attributes);
	  } catch (error) {
	    /* empty */
	  }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError$8('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var DESCRIPTORS$4 = descriptors;

	var definePropertyModule$4 = objectDefineProperty;

	var createPropertyDescriptor$3 = createPropertyDescriptor$5;

	var createNonEnumerableProperty$7 = DESCRIPTORS$4 ? function (object, key, value) {
	  return definePropertyModule$4.f(object, key, createPropertyDescriptor$3(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var redefine$7 = {exports: {}};

	var uncurryThis$9 = functionUncurryThis;

	var isCallable$c = isCallable$i;

	var store$1 = sharedStore;

	var functionToString = uncurryThis$9(Function.toString); // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper

	if (!isCallable$c(store$1.inspectSource)) {
	  store$1.inspectSource = function (it) {
	    return functionToString(it);
	  };
	}

	var inspectSource$4 = store$1.inspectSource;

	var global$m = global$D;

	var isCallable$b = isCallable$i;

	var inspectSource$3 = inspectSource$4;

	var WeakMap$1 = global$m.WeakMap;
	var nativeWeakMap = isCallable$b(WeakMap$1) && /native code/.test(inspectSource$3(WeakMap$1));

	var shared$1 = shared$3.exports;

	var uid = uid$2;

	var keys = shared$1('keys');

	var sharedKey$3 = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys$4 = {};

	var NATIVE_WEAK_MAP = nativeWeakMap;

	var global$l = global$D;

	var uncurryThis$8 = functionUncurryThis;

	var isObject$3 = isObject$8;

	var createNonEnumerableProperty$6 = createNonEnumerableProperty$7;

	var hasOwn$7 = hasOwnProperty_1;

	var shared = sharedStore;

	var sharedKey$2 = sharedKey$3;

	var hiddenKeys$3 = hiddenKeys$4;

	var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
	var TypeError$7 = global$l.TypeError;
	var WeakMap = global$l.WeakMap;
	var set$1, get, has;

	var enforce = function (it) {
	  return has(it) ? get(it) : set$1(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;

	    if (!isObject$3(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError$7('Incompatible receiver, ' + TYPE + ' required');
	    }

	    return state;
	  };
	};

	if (NATIVE_WEAK_MAP || shared.state) {
	  var store = shared.state || (shared.state = new WeakMap());
	  var wmget = uncurryThis$8(store.get);
	  var wmhas = uncurryThis$8(store.has);
	  var wmset = uncurryThis$8(store.set);

	  set$1 = function (it, metadata) {
	    if (wmhas(store, it)) throw new TypeError$7(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    wmset(store, it, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return wmget(store, it) || {};
	  };

	  has = function (it) {
	    return wmhas(store, it);
	  };
	} else {
	  var STATE = sharedKey$2('state');
	  hiddenKeys$3[STATE] = true;

	  set$1 = function (it, metadata) {
	    if (hasOwn$7(it, STATE)) throw new TypeError$7(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    createNonEnumerableProperty$6(it, STATE, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return hasOwn$7(it, STATE) ? it[STATE] : {};
	  };

	  has = function (it) {
	    return hasOwn$7(it, STATE);
	  };
	}

	var internalState = {
	  set: set$1,
	  get: get,
	  has: has,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var DESCRIPTORS$3 = descriptors;

	var hasOwn$6 = hasOwnProperty_1;

	var FunctionPrototype$1 = Function.prototype; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe

	var getDescriptor = DESCRIPTORS$3 && Object.getOwnPropertyDescriptor;
	var EXISTS = hasOwn$6(FunctionPrototype$1, 'name'); // additional protection from minified / mangled / dropped function names

	var PROPER = EXISTS && function something() {
	  /* empty */
	}.name === 'something';

	var CONFIGURABLE = EXISTS && (!DESCRIPTORS$3 || DESCRIPTORS$3 && getDescriptor(FunctionPrototype$1, 'name').configurable);
	var functionName = {
	  EXISTS: EXISTS,
	  PROPER: PROPER,
	  CONFIGURABLE: CONFIGURABLE
	};

	var global$k = global$D;

	var isCallable$a = isCallable$i;

	var hasOwn$5 = hasOwnProperty_1;

	var createNonEnumerableProperty$5 = createNonEnumerableProperty$7;

	var setGlobal$1 = setGlobal$3;

	var inspectSource$2 = inspectSource$4;

	var InternalStateModule$3 = internalState;

	var CONFIGURABLE_FUNCTION_NAME$1 = functionName.CONFIGURABLE;

	var getInternalState$3 = InternalStateModule$3.get;
	var enforceInternalState = InternalStateModule$3.enforce;
	var TEMPLATE = String(String).split('String');
	(redefine$7.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  var name = options && options.name !== undefined ? options.name : key;
	  var state;

	  if (isCallable$a(value)) {
	    if (String(name).slice(0, 7) === 'Symbol(') {
	      name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
	    }

	    if (!hasOwn$5(value, 'name') || CONFIGURABLE_FUNCTION_NAME$1 && value.name !== name) {
	      createNonEnumerableProperty$5(value, 'name', name);
	    }

	    state = enforceInternalState(value);

	    if (!state.source) {
	      state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
	    }
	  }

	  if (O === global$k) {
	    if (simple) O[key] = value;else setGlobal$1(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }

	  if (simple) O[key] = value;else createNonEnumerableProperty$5(O, key, value); // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return isCallable$a(this) && getInternalState$3(this).source || inspectSource$2(this);
	});

	var objectGetOwnPropertyNames = {};

	var ceil = Math.ceil;
	var floor = Math.floor; // `ToIntegerOrInfinity` abstract operation
	// https://tc39.es/ecma262/#sec-tointegerorinfinity

	var toIntegerOrInfinity$3 = function (argument) {
	  var number = +argument; // eslint-disable-next-line no-self-compare -- safe

	  return number !== number || number === 0 ? 0 : (number > 0 ? floor : ceil)(number);
	};

	var toIntegerOrInfinity$2 = toIntegerOrInfinity$3;

	var max = Math.max;
	var min$1 = Math.min; // Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).

	var toAbsoluteIndex$1 = function (index, length) {
	  var integer = toIntegerOrInfinity$2(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	var toIntegerOrInfinity$1 = toIntegerOrInfinity$3;

	var min = Math.min; // `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength

	var toLength$1 = function (argument) {
	  return argument > 0 ? min(toIntegerOrInfinity$1(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var toLength = toLength$1; // `LengthOfArrayLike` abstract operation
	// https://tc39.es/ecma262/#sec-lengthofarraylike


	var lengthOfArrayLike$2 = function (obj) {
	  return toLength(obj.length);
	};

	var toIndexedObject$3 = toIndexedObject$5;

	var toAbsoluteIndex = toAbsoluteIndex$1;

	var lengthOfArrayLike$1 = lengthOfArrayLike$2; // `Array.prototype.{ indexOf, includes }` methods implementation


	var createMethod$1 = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject$3($this);
	    var length = lengthOfArrayLike$1(O);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value; // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare -- NaN check

	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++]; // eslint-disable-next-line no-self-compare -- NaN check

	      if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
	    } else for (; length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    }
	    return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.es/ecma262/#sec-array.prototype.includes
	  includes: createMethod$1(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.es/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod$1(false)
	};

	var uncurryThis$7 = functionUncurryThis;

	var hasOwn$4 = hasOwnProperty_1;

	var toIndexedObject$2 = toIndexedObject$5;

	var indexOf = arrayIncludes.indexOf;

	var hiddenKeys$2 = hiddenKeys$4;

	var push$1 = uncurryThis$7([].push);

	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject$2(object);
	  var i = 0;
	  var result = [];
	  var key;

	  for (key in O) !hasOwn$4(hiddenKeys$2, key) && hasOwn$4(O, key) && push$1(result, key); // Don't enum bug & hidden keys


	  while (names.length > i) if (hasOwn$4(O, key = names[i++])) {
	    ~indexOf(result, key) || push$1(result, key);
	  }

	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys$3 = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

	var internalObjectKeys$1 = objectKeysInternal;

	var enumBugKeys$2 = enumBugKeys$3;

	var hiddenKeys$1 = enumBugKeys$2.concat('length', 'prototype'); // `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	// eslint-disable-next-line es/no-object-getownpropertynames -- safe

	objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return internalObjectKeys$1(O, hiddenKeys$1);
	};

	var objectGetOwnPropertySymbols = {};

	// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
	objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

	var getBuiltIn$6 = getBuiltIn$9;

	var uncurryThis$6 = functionUncurryThis;

	var getOwnPropertyNamesModule = objectGetOwnPropertyNames;

	var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;

	var anObject$8 = anObject$a;

	var concat = uncurryThis$6([].concat); // all object keys, includes non-enumerable and symbols

	var ownKeys$1 = getBuiltIn$6('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = getOwnPropertyNamesModule.f(anObject$8(it));
	  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
	  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
	};

	var hasOwn$3 = hasOwnProperty_1;

	var ownKeys = ownKeys$1;

	var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;

	var definePropertyModule$3 = objectDefineProperty;

	var copyConstructorProperties$2 = function (target, source, exceptions) {
	  var keys = ownKeys(source);
	  var defineProperty = definePropertyModule$3.f;
	  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;

	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];

	    if (!hasOwn$3(target, key) && !(exceptions && hasOwn$3(exceptions, key))) {
	      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	    }
	  }
	};

	var fails$6 = fails$b;

	var isCallable$9 = isCallable$i;

	var replacement = /#|\.prototype\./;

	var isForced$2 = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true : value == NATIVE ? false : isCallable$9(detection) ? fails$6(detection) : !!detection;
	};

	var normalize = isForced$2.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced$2.data = {};
	var NATIVE = isForced$2.NATIVE = 'N';
	var POLYFILL = isForced$2.POLYFILL = 'P';
	var isForced_1 = isForced$2;

	var global$j = global$D;

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;

	var createNonEnumerableProperty$4 = createNonEnumerableProperty$7;

	var redefine$6 = redefine$7.exports;

	var setGlobal = setGlobal$3;

	var copyConstructorProperties$1 = copyConstructorProperties$2;

	var isForced$1 = isForced_1;
	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	  options.name        - the .name of the function if it does not match the key
	*/


	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;

	  if (GLOBAL) {
	    target = global$j;
	  } else if (STATIC) {
	    target = global$j[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global$j[TARGET] || {}).prototype;
	  }

	  if (target) for (key in source) {
	    sourceProperty = source[key];

	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];

	    FORCED = isForced$1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced); // contained in target

	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty == typeof targetProperty) continue;
	      copyConstructorProperties$1(sourceProperty, targetProperty);
	    } // add a flag to not completely full polyfills


	    if (options.sham || targetProperty && targetProperty.sham) {
	      createNonEnumerableProperty$4(sourceProperty, 'sham', true);
	    } // extend global


	    redefine$6(target, key, sourceProperty, options);
	  }
	};

	var fails$5 = fails$b;

	var correctPrototypeGetter = !fails$5(function () {
	  function F() {
	    /* empty */
	  }

	  F.prototype.constructor = null; // eslint-disable-next-line es/no-object-getprototypeof -- required for testing

	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var global$i = global$D;

	var hasOwn$2 = hasOwnProperty_1;

	var isCallable$8 = isCallable$i;

	var toObject = toObject$2;

	var sharedKey$1 = sharedKey$3;

	var CORRECT_PROTOTYPE_GETTER = correctPrototypeGetter;

	var IE_PROTO$1 = sharedKey$1('IE_PROTO');
	var Object$2 = global$i.Object;
	var ObjectPrototype = Object$2.prototype; // `Object.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.getprototypeof

	var objectGetPrototypeOf = CORRECT_PROTOTYPE_GETTER ? Object$2.getPrototypeOf : function (O) {
	  var object = toObject(O);
	  if (hasOwn$2(object, IE_PROTO$1)) return object[IE_PROTO$1];
	  var constructor = object.constructor;

	  if (isCallable$8(constructor) && object instanceof constructor) {
	    return constructor.prototype;
	  }

	  return object instanceof Object$2 ? ObjectPrototype : null;
	};

	var global$h = global$D;

	var isCallable$7 = isCallable$i;

	var String$3 = global$h.String;
	var TypeError$6 = global$h.TypeError;

	var aPossiblePrototype$1 = function (argument) {
	  if (typeof argument == 'object' || isCallable$7(argument)) return argument;
	  throw TypeError$6("Can't set " + String$3(argument) + ' as a prototype');
	};

	/* eslint-disable no-proto -- safe */

	var uncurryThis$5 = functionUncurryThis;

	var anObject$7 = anObject$a;

	var aPossiblePrototype = aPossiblePrototype$1; // `Object.setPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	// eslint-disable-next-line es/no-object-setprototypeof -- safe


	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;

	  try {
	    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	    setter = uncurryThis$5(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
	    setter(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) {
	    /* empty */
	  }

	  return function setPrototypeOf(O, proto) {
	    anObject$7(O);
	    aPossiblePrototype(proto);
	    if (CORRECT_SETTER) setter(O, proto);else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	var internalObjectKeys = objectKeysInternal;

	var enumBugKeys$1 = enumBugKeys$3; // `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	// eslint-disable-next-line es/no-object-keys -- safe


	var objectKeys$1 = Object.keys || function keys(O) {
	  return internalObjectKeys(O, enumBugKeys$1);
	};

	var DESCRIPTORS$2 = descriptors;

	var definePropertyModule$2 = objectDefineProperty;

	var anObject$6 = anObject$a;

	var toIndexedObject$1 = toIndexedObject$5;

	var objectKeys = objectKeys$1; // `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	// eslint-disable-next-line es/no-object-defineproperties -- safe


	var objectDefineProperties = DESCRIPTORS$2 ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject$6(O);
	  var props = toIndexedObject$1(Properties);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;

	  while (length > index) definePropertyModule$2.f(O, key = keys[index++], props[key]);

	  return O;
	};

	var getBuiltIn$5 = getBuiltIn$9;

	var html$2 = getBuiltIn$5('document', 'documentElement');

	/* global ActiveXObject -- old IE, WSH */

	var anObject$5 = anObject$a;

	var defineProperties = objectDefineProperties;

	var enumBugKeys = enumBugKeys$3;

	var hiddenKeys = hiddenKeys$4;

	var html$1 = html$2;

	var documentCreateElement$1 = documentCreateElement$2;

	var sharedKey = sharedKey$3;

	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO = sharedKey('IE_PROTO');

	var EmptyConstructor = function () {
	  /* empty */
	};

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	}; // Create object with fake `null` prototype: use ActiveX Object with cleared prototype


	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak

	  return temp;
	}; // Create object with fake `null` prototype: use iframe Object with cleared prototype


	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement$1('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html$1.appendChild(iframe); // https://github.com/zloirock/core-js/issues/475

	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	}; // Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug


	var activeXDocument;

	var NullProtoObject = function () {
	  try {
	    activeXDocument = new ActiveXObject('htmlfile');
	  } catch (error) {
	    /* ignore */
	  }

	  NullProtoObject = typeof document != 'undefined' ? document.domain && activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) // old IE
	  : NullProtoObjectViaIFrame() : NullProtoObjectViaActiveX(activeXDocument); // WSH

	  var length = enumBugKeys.length;

	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];

	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO] = true; // `Object.create` method
	// https://tc39.es/ecma262/#sec-object.create

	var objectCreate = Object.create || function create(O, Properties) {
	  var result;

	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject$5(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null; // add "__proto__" for Object.getPrototypeOf polyfill

	    result[IE_PROTO] = O;
	  } else result = NullProtoObject();

	  return Properties === undefined ? result : defineProperties(result, Properties);
	};

	var uncurryThis$4 = functionUncurryThis;

	var replace = uncurryThis$4(''.replace);

	var TEST = function (arg) {
	  return String(Error(arg).stack);
	}('zxcasd');

	var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
	var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);

	var clearErrorStack$1 = function (stack, dropEntries) {
	  if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string') {
	    while (dropEntries--) stack = replace(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
	  }

	  return stack;
	};

	var isObject$2 = isObject$8;

	var createNonEnumerableProperty$3 = createNonEnumerableProperty$7; // `InstallErrorCause` abstract operation
	// https://tc39.es/proposal-error-cause/#sec-errorobjects-install-error-cause


	var installErrorCause$1 = function (O, options) {
	  if (isObject$2(options) && 'cause' in options) {
	    createNonEnumerableProperty$3(O, 'cause', options.cause);
	  }
	};

	var uncurryThis$3 = functionUncurryThis;

	var aCallable$5 = aCallable$7;

	var bind$5 = uncurryThis$3(uncurryThis$3.bind); // optional / simple context binding

	var functionBindContext = function (fn, that) {
	  aCallable$5(fn);
	  return that === undefined ? fn : bind$5 ? bind$5(fn, that) : function
	    /* ...args */
	  () {
	    return fn.apply(that, arguments);
	  };
	};

	var iterators = {};

	var wellKnownSymbol$d = wellKnownSymbol$f;

	var Iterators$4 = iterators;

	var ITERATOR$5 = wellKnownSymbol$d('iterator');
	var ArrayPrototype$1 = Array.prototype; // check on default Array iterator

	var isArrayIteratorMethod$1 = function (it) {
	  return it !== undefined && (Iterators$4.Array === it || ArrayPrototype$1[ITERATOR$5] === it);
	};

	var wellKnownSymbol$c = wellKnownSymbol$f;

	var TO_STRING_TAG$4 = wellKnownSymbol$c('toStringTag');
	var test = {};
	test[TO_STRING_TAG$4] = 'z';
	var toStringTagSupport = String(test) === '[object z]';

	var global$g = global$D;

	var TO_STRING_TAG_SUPPORT$2 = toStringTagSupport;

	var isCallable$6 = isCallable$i;

	var classofRaw = classofRaw$1;

	var wellKnownSymbol$b = wellKnownSymbol$f;

	var TO_STRING_TAG$3 = wellKnownSymbol$b('toStringTag');
	var Object$1 = global$g.Object; // ES3 wrong here

	var CORRECT_ARGUMENTS = classofRaw(function () {
	  return arguments;
	}()) == 'Arguments'; // fallback for IE11 Script Access Denied error

	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) {
	    /* empty */
	  }
	}; // getting tag from ES6+ `Object.prototype.toString`


	var classof$5 = TO_STRING_TAG_SUPPORT$2 ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null' // @@toStringTag case
	  : typeof (tag = tryGet(O = Object$1(it), TO_STRING_TAG$3)) == 'string' ? tag // builtinTag case
	  : CORRECT_ARGUMENTS ? classofRaw(O) // ES3 arguments fallback
	  : (result = classofRaw(O)) == 'Object' && isCallable$6(O.callee) ? 'Arguments' : result;
	};

	var classof$4 = classof$5;

	var getMethod$1 = getMethod$3;

	var Iterators$3 = iterators;

	var wellKnownSymbol$a = wellKnownSymbol$f;

	var ITERATOR$4 = wellKnownSymbol$a('iterator');

	var getIteratorMethod$2 = function (it) {
	  if (it != undefined) return getMethod$1(it, ITERATOR$4) || getMethod$1(it, '@@iterator') || Iterators$3[classof$4(it)];
	};

	var global$f = global$D;

	var call$7 = functionCall;

	var aCallable$4 = aCallable$7;

	var anObject$4 = anObject$a;

	var tryToString$2 = tryToString$4;

	var getIteratorMethod$1 = getIteratorMethod$2;

	var TypeError$5 = global$f.TypeError;

	var getIterator$1 = function (argument, usingIterator) {
	  var iteratorMethod = arguments.length < 2 ? getIteratorMethod$1(argument) : usingIterator;
	  if (aCallable$4(iteratorMethod)) return anObject$4(call$7(iteratorMethod, argument));
	  throw TypeError$5(tryToString$2(argument) + ' is not iterable');
	};

	var call$6 = functionCall;

	var anObject$3 = anObject$a;

	var getMethod = getMethod$3;

	var iteratorClose$1 = function (iterator, kind, value) {
	  var innerResult, innerError;
	  anObject$3(iterator);

	  try {
	    innerResult = getMethod(iterator, 'return');

	    if (!innerResult) {
	      if (kind === 'throw') throw value;
	      return value;
	    }

	    innerResult = call$6(innerResult, iterator);
	  } catch (error) {
	    innerError = true;
	    innerResult = error;
	  }

	  if (kind === 'throw') throw value;
	  if (innerError) throw innerResult;
	  anObject$3(innerResult);
	  return value;
	};

	var global$e = global$D;

	var bind$4 = functionBindContext;

	var call$5 = functionCall;

	var anObject$2 = anObject$a;

	var tryToString$1 = tryToString$4;

	var isArrayIteratorMethod = isArrayIteratorMethod$1;

	var lengthOfArrayLike = lengthOfArrayLike$2;

	var isPrototypeOf$2 = objectIsPrototypeOf;

	var getIterator = getIterator$1;

	var getIteratorMethod = getIteratorMethod$2;

	var iteratorClose = iteratorClose$1;

	var TypeError$4 = global$e.TypeError;

	var Result = function (stopped, result) {
	  this.stopped = stopped;
	  this.result = result;
	};

	var ResultPrototype = Result.prototype;

	var iterate$4 = function (iterable, unboundFunction, options) {
	  var that = options && options.that;
	  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
	  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
	  var INTERRUPTED = !!(options && options.INTERRUPTED);
	  var fn = bind$4(unboundFunction, that);
	  var iterator, iterFn, index, length, result, next, step;

	  var stop = function (condition) {
	    if (iterator) iteratorClose(iterator, 'normal', condition);
	    return new Result(true, condition);
	  };

	  var callFn = function (value) {
	    if (AS_ENTRIES) {
	      anObject$2(value);
	      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
	    }

	    return INTERRUPTED ? fn(value, stop) : fn(value);
	  };

	  if (IS_ITERATOR) {
	    iterator = iterable;
	  } else {
	    iterFn = getIteratorMethod(iterable);
	    if (!iterFn) throw TypeError$4(tryToString$1(iterable) + ' is not iterable'); // optimisation for array iterators

	    if (isArrayIteratorMethod(iterFn)) {
	      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
	        result = callFn(iterable[index]);
	        if (result && isPrototypeOf$2(ResultPrototype, result)) return result;
	      }

	      return new Result(false);
	    }

	    iterator = getIterator(iterable, iterFn);
	  }

	  next = iterator.next;

	  while (!(step = call$5(next, iterator)).done) {
	    try {
	      result = callFn(step.value);
	    } catch (error) {
	      iteratorClose(iterator, 'throw', error);
	    }

	    if (typeof result == 'object' && result && isPrototypeOf$2(ResultPrototype, result)) return result;
	  }

	  return new Result(false);
	};

	var global$d = global$D;

	var classof$3 = classof$5;

	var String$2 = global$d.String;

	var toString$4 = function (argument) {
	  if (classof$3(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
	  return String$2(argument);
	};

	var toString$3 = toString$4;

	var normalizeStringArgument$1 = function (argument, $default) {
	  return argument === undefined ? arguments.length < 2 ? '' : $default : toString$3(argument);
	};

	var fails$4 = fails$b;

	var createPropertyDescriptor$2 = createPropertyDescriptor$5;

	var errorStackInstallable = !fails$4(function () {
	  var error = Error('a');
	  if (!('stack' in error)) return true; // eslint-disable-next-line es/no-object-defineproperty -- safe

	  Object.defineProperty(error, 'stack', createPropertyDescriptor$2(1, 7));
	  return error.stack !== 7;
	});

	var $$5 = _export;

	var global$c = global$D;

	var isPrototypeOf$1 = objectIsPrototypeOf;

	var getPrototypeOf$2 = objectGetPrototypeOf;

	var setPrototypeOf$2 = objectSetPrototypeOf;

	var copyConstructorProperties = copyConstructorProperties$2;

	var create$2 = objectCreate;

	var createNonEnumerableProperty$2 = createNonEnumerableProperty$7;

	var createPropertyDescriptor$1 = createPropertyDescriptor$5;

	var clearErrorStack = clearErrorStack$1;

	var installErrorCause = installErrorCause$1;

	var iterate$3 = iterate$4;

	var normalizeStringArgument = normalizeStringArgument$1;

	var wellKnownSymbol$9 = wellKnownSymbol$f;

	var ERROR_STACK_INSTALLABLE = errorStackInstallable;

	var TO_STRING_TAG$2 = wellKnownSymbol$9('toStringTag');
	var Error$1 = global$c.Error;
	var push = [].push;

	var $AggregateError = function AggregateError(errors, message
	/* , options */
	) {
	  var options = arguments.length > 2 ? arguments[2] : undefined;
	  var isInstance = isPrototypeOf$1(AggregateErrorPrototype, this);
	  var that;

	  if (setPrototypeOf$2) {
	    that = setPrototypeOf$2(new Error$1(), isInstance ? getPrototypeOf$2(this) : AggregateErrorPrototype);
	  } else {
	    that = isInstance ? this : create$2(AggregateErrorPrototype);
	    createNonEnumerableProperty$2(that, TO_STRING_TAG$2, 'Error');
	  }

	  if (message !== undefined) createNonEnumerableProperty$2(that, 'message', normalizeStringArgument(message));
	  if (ERROR_STACK_INSTALLABLE) createNonEnumerableProperty$2(that, 'stack', clearErrorStack(that.stack, 1));
	  installErrorCause(that, options);
	  var errorsArray = [];
	  iterate$3(errors, push, {
	    that: errorsArray
	  });
	  createNonEnumerableProperty$2(that, 'errors', errorsArray);
	  return that;
	};

	if (setPrototypeOf$2) setPrototypeOf$2($AggregateError, Error$1);else copyConstructorProperties($AggregateError, Error$1, {
	  name: true
	});
	var AggregateErrorPrototype = $AggregateError.prototype = create$2(Error$1.prototype, {
	  constructor: createPropertyDescriptor$1(1, $AggregateError),
	  message: createPropertyDescriptor$1(1, ''),
	  name: createPropertyDescriptor$1(1, 'AggregateError')
	}); // `AggregateError` constructor
	// https://tc39.es/ecma262/#sec-aggregate-error-constructor

	$$5({
	  global: true
	}, {
	  AggregateError: $AggregateError
	});

	var wellKnownSymbol$8 = wellKnownSymbol$f;

	var create$1 = objectCreate;

	var definePropertyModule$1 = objectDefineProperty;

	var UNSCOPABLES = wellKnownSymbol$8('unscopables');
	var ArrayPrototype = Array.prototype; // Array.prototype[@@unscopables]
	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables

	if (ArrayPrototype[UNSCOPABLES] == undefined) {
	  definePropertyModule$1.f(ArrayPrototype, UNSCOPABLES, {
	    configurable: true,
	    value: create$1(null)
	  });
	} // add a key to Array.prototype[@@unscopables]


	var addToUnscopables$1 = function (key) {
	  ArrayPrototype[UNSCOPABLES][key] = true;
	};

	var fails$3 = fails$b;

	var isCallable$5 = isCallable$i;

	var getPrototypeOf$1 = objectGetPrototypeOf;

	var redefine$5 = redefine$7.exports;

	var wellKnownSymbol$7 = wellKnownSymbol$f;

	var ITERATOR$3 = wellKnownSymbol$7('iterator');
	var BUGGY_SAFARI_ITERATORS$1 = false; // `%IteratorPrototype%` object
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-object

	var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;
	/* eslint-disable es/no-array-prototype-keys -- safe */

	if ([].keys) {
	  arrayIterator = [].keys(); // Safari 8 has buggy iterators w/o `next`

	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS$1 = true;else {
	    PrototypeOfArrayIteratorPrototype = getPrototypeOf$1(getPrototypeOf$1(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
	  }
	}

	var NEW_ITERATOR_PROTOTYPE = IteratorPrototype$2 == undefined || fails$3(function () {
	  var test = {}; // FF44- legacy iterators case

	  return IteratorPrototype$2[ITERATOR$3].call(test) !== test;
	});
	if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {}; // `%IteratorPrototype%[@@iterator]()` method
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator

	if (!isCallable$5(IteratorPrototype$2[ITERATOR$3])) {
	  redefine$5(IteratorPrototype$2, ITERATOR$3, function () {
	    return this;
	  });
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype$2,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
	};

	var defineProperty$1 = objectDefineProperty.f;

	var hasOwn$1 = hasOwnProperty_1;

	var wellKnownSymbol$6 = wellKnownSymbol$f;

	var TO_STRING_TAG$1 = wellKnownSymbol$6('toStringTag');

	var setToStringTag$3 = function (target, TAG, STATIC) {
	  if (target && !STATIC) target = target.prototype;

	  if (target && !hasOwn$1(target, TO_STRING_TAG$1)) {
	    defineProperty$1(target, TO_STRING_TAG$1, {
	      configurable: true,
	      value: TAG
	    });
	  }
	};

	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;

	var create = objectCreate;

	var createPropertyDescriptor = createPropertyDescriptor$5;

	var setToStringTag$2 = setToStringTag$3;

	var Iterators$2 = iterators;

	var returnThis$1 = function () {
	  return this;
	};

	var createIteratorConstructor$1 = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = create(IteratorPrototype$1, {
	    next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next)
	  });
	  setToStringTag$2(IteratorConstructor, TO_STRING_TAG, false);
	  Iterators$2[TO_STRING_TAG] = returnThis$1;
	  return IteratorConstructor;
	};

	var $$4 = _export;

	var call$4 = functionCall;

	var FunctionName = functionName;

	var isCallable$4 = isCallable$i;

	var createIteratorConstructor = createIteratorConstructor$1;

	var getPrototypeOf = objectGetPrototypeOf;

	var setPrototypeOf$1 = objectSetPrototypeOf;

	var setToStringTag$1 = setToStringTag$3;

	var createNonEnumerableProperty$1 = createNonEnumerableProperty$7;

	var redefine$4 = redefine$7.exports;

	var wellKnownSymbol$5 = wellKnownSymbol$f;

	var Iterators$1 = iterators;

	var IteratorsCore = iteratorsCore;

	var PROPER_FUNCTION_NAME = FunctionName.PROPER;
	var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
	var IteratorPrototype = IteratorsCore.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$2 = wellKnownSymbol$5('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis = function () {
	  return this;
	};

	var defineIterator$2 = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];

	    switch (KIND) {
	      case KEYS:
	        return function keys() {
	          return new IteratorConstructor(this, KIND);
	        };

	      case VALUES:
	        return function values() {
	          return new IteratorConstructor(this, KIND);
	        };

	      case ENTRIES:
	        return function entries() {
	          return new IteratorConstructor(this, KIND);
	        };
	    }

	    return function () {
	      return new IteratorConstructor(this);
	    };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR$2] || IterablePrototype['@@iterator'] || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY; // fix native

	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));

	    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
	      if (getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
	        if (setPrototypeOf$1) {
	          setPrototypeOf$1(CurrentIteratorPrototype, IteratorPrototype);
	        } else if (!isCallable$4(CurrentIteratorPrototype[ITERATOR$2])) {
	          redefine$4(CurrentIteratorPrototype, ITERATOR$2, returnThis);
	        }
	      } // Set @@toStringTag to native iterators


	      setToStringTag$1(CurrentIteratorPrototype, TO_STRING_TAG, true);
	    }
	  } // fix Array.prototype.{ values, @@iterator }.name in V8 / FF


	  if (PROPER_FUNCTION_NAME && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
	    if (CONFIGURABLE_FUNCTION_NAME) {
	      createNonEnumerableProperty$1(IterablePrototype, 'name', VALUES);
	    } else {
	      INCORRECT_VALUES_NAME = true;

	      defaultIterator = function values() {
	        return call$4(nativeIterator, this);
	      };
	    }
	  } // export additional methods


	  if (DEFAULT) {
	    methods = {
	      values: getIterationMethod(VALUES),
	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
	      entries: getIterationMethod(ENTRIES)
	    };
	    if (FORCED) for (KEY in methods) {
	      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        redefine$4(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else $$4({
	      target: NAME,
	      proto: true,
	      forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME
	    }, methods);
	  } // define iterator


	  if (IterablePrototype[ITERATOR$2] !== defaultIterator) {
	    redefine$4(IterablePrototype, ITERATOR$2, defaultIterator, {
	      name: DEFAULT
	    });
	  }

	  Iterators$1[NAME] = defaultIterator;
	  return methods;
	};

	var toIndexedObject = toIndexedObject$5;

	var addToUnscopables = addToUnscopables$1;

	var Iterators = iterators;

	var InternalStateModule$2 = internalState;

	var defineProperty = objectDefineProperty.f;

	var defineIterator$1 = defineIterator$2;

	var DESCRIPTORS$1 = descriptors;

	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState$2 = InternalStateModule$2.set;
	var getInternalState$2 = InternalStateModule$2.getterFor(ARRAY_ITERATOR); // `Array.prototype.entries` method
	// https://tc39.es/ecma262/#sec-array.prototype.entries
	// `Array.prototype.keys` method
	// https://tc39.es/ecma262/#sec-array.prototype.keys
	// `Array.prototype.values` method
	// https://tc39.es/ecma262/#sec-array.prototype.values
	// `Array.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
	// `CreateArrayIterator` internal method
	// https://tc39.es/ecma262/#sec-createarrayiterator

	var es_array_iterator = defineIterator$1(Array, 'Array', function (iterated, kind) {
	  setInternalState$2(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject(iterated),
	    // target
	    index: 0,
	    // next index
	    kind: kind // kind

	  }); // `%ArrayIteratorPrototype%.next` method
	  // https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
	}, function () {
	  var state = getInternalState$2(this);
	  var target = state.target;
	  var kind = state.kind;
	  var index = state.index++;

	  if (!target || index >= target.length) {
	    state.target = undefined;
	    return {
	      value: undefined,
	      done: true
	    };
	  }

	  if (kind == 'keys') return {
	    value: index,
	    done: false
	  };
	  if (kind == 'values') return {
	    value: target[index],
	    done: false
	  };
	  return {
	    value: [index, target[index]],
	    done: false
	  };
	}, 'values'); // argumentsList[@@iterator] is %ArrayProto_values%
	// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
	// https://tc39.es/ecma262/#sec-createmappedargumentsobject

	var values = Iterators.Arguments = Iterators.Array; // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries'); // V8 ~ Chrome 45- bug

	if (DESCRIPTORS$1 && values.name !== 'values') try {
	  defineProperty(values, 'name', {
	    value: 'values'
	  });
	} catch (error) {
	  /* empty */
	}

	var TO_STRING_TAG_SUPPORT$1 = toStringTagSupport;

	var classof$2 = classof$5; // `Object.prototype.toString` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.tostring


	var objectToString = TO_STRING_TAG_SUPPORT$1 ? {}.toString : function toString() {
	  return '[object ' + classof$2(this) + ']';
	};

	var TO_STRING_TAG_SUPPORT = toStringTagSupport;

	var redefine$3 = redefine$7.exports;

	var toString$2 = objectToString; // `Object.prototype.toString` method
	// https://tc39.es/ecma262/#sec-object.prototype.tostring


	if (!TO_STRING_TAG_SUPPORT) {
	  redefine$3(Object.prototype, 'toString', toString$2, {
	    unsafe: true
	  });
	}

	var global$b = global$D;

	var nativePromiseConstructor = global$b.Promise;

	var redefine$2 = redefine$7.exports;

	var redefineAll$1 = function (target, src, options) {
	  for (var key in src) redefine$2(target, key, src[key], options);

	  return target;
	};

	var getBuiltIn$4 = getBuiltIn$9;

	var definePropertyModule = objectDefineProperty;

	var wellKnownSymbol$4 = wellKnownSymbol$f;

	var DESCRIPTORS = descriptors;

	var SPECIES$2 = wellKnownSymbol$4('species');

	var setSpecies$1 = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn$4(CONSTRUCTOR_NAME);
	  var defineProperty = definePropertyModule.f;

	  if (DESCRIPTORS && Constructor && !Constructor[SPECIES$2]) {
	    defineProperty(Constructor, SPECIES$2, {
	      configurable: true,
	      get: function () {
	        return this;
	      }
	    });
	  }
	};

	var global$a = global$D;

	var isPrototypeOf = objectIsPrototypeOf;

	var TypeError$3 = global$a.TypeError;

	var anInstance$1 = function (it, Prototype) {
	  if (isPrototypeOf(Prototype, it)) return it;
	  throw TypeError$3('Incorrect invocation');
	};

	var wellKnownSymbol$3 = wellKnownSymbol$f;

	var ITERATOR$1 = wellKnownSymbol$3('iterator');
	var SAFE_CLOSING = false;

	try {
	  var called = 0;
	  var iteratorWithReturn = {
	    next: function () {
	      return {
	        done: !!called++
	      };
	    },
	    'return': function () {
	      SAFE_CLOSING = true;
	    }
	  };

	  iteratorWithReturn[ITERATOR$1] = function () {
	    return this;
	  }; // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing


	  Array.from(iteratorWithReturn, function () {
	    throw 2;
	  });
	} catch (error) {
	  /* empty */
	}

	var checkCorrectnessOfIteration$1 = function (exec, SKIP_CLOSING) {
	  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
	  var ITERATION_SUPPORT = false;

	  try {
	    var object = {};

	    object[ITERATOR$1] = function () {
	      return {
	        next: function () {
	          return {
	            done: ITERATION_SUPPORT = true
	          };
	        }
	      };
	    };

	    exec(object);
	  } catch (error) {
	    /* empty */
	  }

	  return ITERATION_SUPPORT;
	};

	var uncurryThis$2 = functionUncurryThis;

	var fails$2 = fails$b;

	var isCallable$3 = isCallable$i;

	var classof$1 = classof$5;

	var getBuiltIn$3 = getBuiltIn$9;

	var inspectSource$1 = inspectSource$4;

	var noop = function () {
	  /* empty */
	};

	var empty = [];
	var construct = getBuiltIn$3('Reflect', 'construct');
	var constructorRegExp = /^\s*(?:class|function)\b/;
	var exec = uncurryThis$2(constructorRegExp.exec);
	var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

	var isConstructorModern = function isConstructor(argument) {
	  if (!isCallable$3(argument)) return false;

	  try {
	    construct(noop, empty, argument);
	    return true;
	  } catch (error) {
	    return false;
	  }
	};

	var isConstructorLegacy = function isConstructor(argument) {
	  if (!isCallable$3(argument)) return false;

	  switch (classof$1(argument)) {
	    case 'AsyncFunction':
	    case 'GeneratorFunction':
	    case 'AsyncGeneratorFunction':
	      return false;
	  }

	  try {
	    // we can't check .prototype since constructors produced by .bind haven't it
	    // `Function#toString` throws on some built-it function in some legacy engines
	    // (for example, `DOMQuad` and similar in FF41-)
	    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource$1(argument));
	  } catch (error) {
	    return true;
	  }
	};

	isConstructorLegacy.sham = true; // `IsConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-isconstructor

	var isConstructor$1 = !construct || fails$2(function () {
	  var called;
	  return isConstructorModern(isConstructorModern.call) || !isConstructorModern(Object) || !isConstructorModern(function () {
	    called = true;
	  }) || called;
	}) ? isConstructorLegacy : isConstructorModern;

	var global$9 = global$D;

	var isConstructor = isConstructor$1;

	var tryToString = tryToString$4;

	var TypeError$2 = global$9.TypeError; // `Assert: IsConstructor(argument) is true`

	var aConstructor$1 = function (argument) {
	  if (isConstructor(argument)) return argument;
	  throw TypeError$2(tryToString(argument) + ' is not a constructor');
	};

	var anObject$1 = anObject$a;

	var aConstructor = aConstructor$1;

	var wellKnownSymbol$2 = wellKnownSymbol$f;

	var SPECIES$1 = wellKnownSymbol$2('species'); // `SpeciesConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-speciesconstructor

	var speciesConstructor$2 = function (O, defaultConstructor) {
	  var C = anObject$1(O).constructor;
	  var S;
	  return C === undefined || (S = anObject$1(C)[SPECIES$1]) == undefined ? defaultConstructor : aConstructor(S);
	};

	var FunctionPrototype = Function.prototype;
	var apply$1 = FunctionPrototype.apply;
	var bind$3 = FunctionPrototype.bind;
	var call$3 = FunctionPrototype.call; // eslint-disable-next-line es/no-reflect -- safe

	var functionApply = typeof Reflect == 'object' && Reflect.apply || (bind$3 ? call$3.bind(apply$1) : function () {
	  return call$3.apply(apply$1, arguments);
	});

	var uncurryThis$1 = functionUncurryThis;

	var arraySlice$1 = uncurryThis$1([].slice);

	var userAgent$2 = engineUserAgent;

	var engineIsIos = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent$2);

	var classof = classofRaw$1;

	var global$8 = global$D;

	var engineIsNode = classof(global$8.process) == 'process';

	var global$7 = global$D;

	var apply = functionApply;

	var bind$2 = functionBindContext;

	var isCallable$2 = isCallable$i;

	var hasOwn = hasOwnProperty_1;

	var fails$1 = fails$b;

	var html = html$2;

	var arraySlice = arraySlice$1;

	var createElement = documentCreateElement$2;

	var IS_IOS$1 = engineIsIos;

	var IS_NODE$2 = engineIsNode;

	var set = global$7.setImmediate;
	var clear = global$7.clearImmediate;
	var process$2 = global$7.process;
	var Dispatch = global$7.Dispatch;
	var Function$1 = global$7.Function;
	var MessageChannel = global$7.MessageChannel;
	var String$1 = global$7.String;
	var counter = 0;
	var queue$1 = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var location, defer, channel, port;

	try {
	  // Deno throws a ReferenceError on `location` access without `--location` flag
	  location = global$7.location;
	} catch (error) {
	  /* empty */
	}

	var run = function (id) {
	  if (hasOwn(queue$1, id)) {
	    var fn = queue$1[id];
	    delete queue$1[id];
	    fn();
	  }
	};

	var runner = function (id) {
	  return function () {
	    run(id);
	  };
	};

	var listener = function (event) {
	  run(event.data);
	};

	var post = function (id) {
	  // old engines have not location.origin
	  global$7.postMessage(String$1(id), location.protocol + '//' + location.host);
	}; // Node.js 0.9+ & IE10+ has setImmediate, otherwise:


	if (!set || !clear) {
	  set = function setImmediate(fn) {
	    var args = arraySlice(arguments, 1);

	    queue$1[++counter] = function () {
	      apply(isCallable$2(fn) ? fn : Function$1(fn), undefined, args);
	    };

	    defer(counter);
	    return counter;
	  };

	  clear = function clearImmediate(id) {
	    delete queue$1[id];
	  }; // Node.js 0.8-


	  if (IS_NODE$2) {
	    defer = function (id) {
	      process$2.nextTick(runner(id));
	    }; // Sphere (JS game engine) Dispatch API

	  } else if (Dispatch && Dispatch.now) {
	    defer = function (id) {
	      Dispatch.now(runner(id));
	    }; // Browsers with MessageChannel, includes WebWorkers
	    // except iOS - https://github.com/zloirock/core-js/issues/624

	  } else if (MessageChannel && !IS_IOS$1) {
	    channel = new MessageChannel();
	    port = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = bind$2(port.postMessage, port); // Browsers with postMessage, skip WebWorkers
	    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (global$7.addEventListener && isCallable$2(global$7.postMessage) && !global$7.importScripts && location && location.protocol !== 'file:' && !fails$1(post)) {
	    defer = post;
	    global$7.addEventListener('message', listener, false); // IE8-
	  } else if (ONREADYSTATECHANGE in createElement('script')) {
	    defer = function (id) {
	      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
	        html.removeChild(this);
	        run(id);
	      };
	    }; // Rest old browsers

	  } else {
	    defer = function (id) {
	      setTimeout(runner(id), 0);
	    };
	  }
	}

	var task$1 = {
	  set: set,
	  clear: clear
	};

	var userAgent$1 = engineUserAgent;

	var global$6 = global$D;

	var engineIsIosPebble = /ipad|iphone|ipod/i.test(userAgent$1) && global$6.Pebble !== undefined;

	var userAgent = engineUserAgent;

	var engineIsWebosWebkit = /web0s(?!.*chrome)/i.test(userAgent);

	var global$5 = global$D;

	var bind$1 = functionBindContext;

	var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;

	var macrotask = task$1.set;

	var IS_IOS = engineIsIos;

	var IS_IOS_PEBBLE = engineIsIosPebble;

	var IS_WEBOS_WEBKIT = engineIsWebosWebkit;

	var IS_NODE$1 = engineIsNode;

	var MutationObserver = global$5.MutationObserver || global$5.WebKitMutationObserver;
	var document$2 = global$5.document;
	var process$1 = global$5.process;
	var Promise$1 = global$5.Promise; // Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`

	var queueMicrotaskDescriptor = getOwnPropertyDescriptor(global$5, 'queueMicrotask');
	var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;
	var flush, head, last, notify$1, toggle, node, promise$2, then; // modern engines have queueMicrotask method

	if (!queueMicrotask) {
	  flush = function () {
	    var parent, fn;
	    if (IS_NODE$1 && (parent = process$1.domain)) parent.exit();

	    while (head) {
	      fn = head.fn;
	      head = head.next;

	      try {
	        fn();
	      } catch (error) {
	        if (head) notify$1();else last = undefined;
	        throw error;
	      }
	    }

	    last = undefined;
	    if (parent) parent.enter();
	  }; // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
	  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898


	  if (!IS_IOS && !IS_NODE$1 && !IS_WEBOS_WEBKIT && MutationObserver && document$2) {
	    toggle = true;
	    node = document$2.createTextNode('');
	    new MutationObserver(flush).observe(node, {
	      characterData: true
	    });

	    notify$1 = function () {
	      node.data = toggle = !toggle;
	    }; // environments with maybe non-completely correct, but existent Promise

	  } else if (!IS_IOS_PEBBLE && Promise$1 && Promise$1.resolve) {
	    // Promise.resolve without an argument throws an error in LG WebOS 2
	    promise$2 = Promise$1.resolve(undefined); // workaround of WebKit ~ iOS Safari 10.1 bug

	    promise$2.constructor = Promise$1;
	    then = bind$1(promise$2.then, promise$2);

	    notify$1 = function () {
	      then(flush);
	    }; // Node.js without promises

	  } else if (IS_NODE$1) {
	    notify$1 = function () {
	      process$1.nextTick(flush);
	    }; // for other environments - macrotask based on:
	    // - setImmediate
	    // - MessageChannel
	    // - window.postMessag
	    // - onreadystatechange
	    // - setTimeout

	  } else {
	    // strange IE + webpack dev server bug - use .bind(global)
	    macrotask = bind$1(macrotask, global$5);

	    notify$1 = function () {
	      macrotask(flush);
	    };
	  }
	}

	var microtask$1 = queueMicrotask || function (fn) {
	  var task = {
	    fn: fn,
	    next: undefined
	  };
	  if (last) last.next = task;

	  if (!head) {
	    head = task;
	    notify$1();
	  }

	  last = task;
	};

	var newPromiseCapability$2 = {};

	var aCallable$3 = aCallable$7;

	var PromiseCapability = function (C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = aCallable$3(resolve);
	  this.reject = aCallable$3(reject);
	}; // `NewPromiseCapability` abstract operation
	// https://tc39.es/ecma262/#sec-newpromisecapability


	newPromiseCapability$2.f = function (C) {
	  return new PromiseCapability(C);
	};

	var anObject = anObject$a;

	var isObject$1 = isObject$8;

	var newPromiseCapability$1 = newPromiseCapability$2;

	var promiseResolve$2 = function (C, x) {
	  anObject(C);
	  if (isObject$1(x) && x.constructor === C) return x;
	  var promiseCapability = newPromiseCapability$1.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};

	var global$4 = global$D;

	var hostReportErrors$1 = function (a, b) {
	  var console = global$4.console;

	  if (console && console.error) {
	    arguments.length == 1 ? console.error(a) : console.error(a, b);
	  }
	};

	var perform$3 = function (exec) {
	  try {
	    return {
	      error: false,
	      value: exec()
	    };
	  } catch (error) {
	    return {
	      error: true,
	      value: error
	    };
	  }
	};

	var Queue$1 = function () {
	  this.head = null;
	  this.tail = null;
	};

	Queue$1.prototype = {
	  add: function (item) {
	    var entry = {
	      item: item,
	      next: null
	    };
	    if (this.head) this.tail.next = entry;else this.head = entry;
	    this.tail = entry;
	  },
	  get: function () {
	    var entry = this.head;

	    if (entry) {
	      this.head = entry.next;
	      if (this.tail === entry) this.tail = null;
	      return entry.item;
	    }
	  }
	};
	var queue = Queue$1;

	var engineIsBrowser = typeof window == 'object';

	var $$3 = _export;

	var global$3 = global$D;

	var getBuiltIn$2 = getBuiltIn$9;

	var call$2 = functionCall;

	var NativePromise$1 = nativePromiseConstructor;

	var redefine$1 = redefine$7.exports;

	var redefineAll = redefineAll$1;

	var setPrototypeOf = objectSetPrototypeOf;

	var setToStringTag = setToStringTag$3;

	var setSpecies = setSpecies$1;

	var aCallable$2 = aCallable$7;

	var isCallable$1 = isCallable$i;

	var isObject = isObject$8;

	var anInstance = anInstance$1;

	var inspectSource = inspectSource$4;

	var iterate$2 = iterate$4;

	var checkCorrectnessOfIteration = checkCorrectnessOfIteration$1;

	var speciesConstructor$1 = speciesConstructor$2;

	var task = task$1.set;

	var microtask = microtask$1;

	var promiseResolve$1 = promiseResolve$2;

	var hostReportErrors = hostReportErrors$1;

	var newPromiseCapabilityModule$2 = newPromiseCapability$2;

	var perform$2 = perform$3;

	var Queue = queue;

	var InternalStateModule$1 = internalState;

	var isForced = isForced_1;

	var wellKnownSymbol$1 = wellKnownSymbol$f;

	var IS_BROWSER = engineIsBrowser;

	var IS_NODE = engineIsNode;

	var V8_VERSION = engineV8Version;

	var SPECIES = wellKnownSymbol$1('species');
	var PROMISE = 'Promise';
	var getInternalState$1 = InternalStateModule$1.getterFor(PROMISE);
	var setInternalState$1 = InternalStateModule$1.set;
	var getInternalPromiseState = InternalStateModule$1.getterFor(PROMISE);
	var NativePromisePrototype = NativePromise$1 && NativePromise$1.prototype;
	var PromiseConstructor = NativePromise$1;
	var PromisePrototype = NativePromisePrototype;
	var TypeError$1 = global$3.TypeError;
	var document$1 = global$3.document;
	var process = global$3.process;
	var newPromiseCapability = newPromiseCapabilityModule$2.f;
	var newGenericPromiseCapability = newPromiseCapability;
	var DISPATCH_EVENT = !!(document$1 && document$1.createEvent && global$3.dispatchEvent);
	var NATIVE_REJECTION_EVENT = isCallable$1(global$3.PromiseRejectionEvent);
	var UNHANDLED_REJECTION = 'unhandledrejection';
	var REJECTION_HANDLED = 'rejectionhandled';
	var PENDING = 0;
	var FULFILLED = 1;
	var REJECTED = 2;
	var HANDLED = 1;
	var UNHANDLED = 2;
	var SUBCLASSING = false;
	var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;
	var FORCED = isForced(PROMISE, function () {
	  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(PromiseConstructor);
	  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(PromiseConstructor); // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
	  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
	  // We can't detect it synchronously, so just check versions

	  if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION === 66) return true; // We need Promise#finally in the pure version for preventing prototype pollution
	  // deoptimization and performance degradation
	  // https://github.com/zloirock/core-js/issues/679

	  if (V8_VERSION >= 51 && /native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) return false; // Detect correctness of subclassing with @@species support

	  var promise = new PromiseConstructor(function (resolve) {
	    resolve(1);
	  });

	  var FakePromise = function (exec) {
	    exec(function () {
	      /* empty */
	    }, function () {
	      /* empty */
	    });
	  };

	  var constructor = promise.constructor = {};
	  constructor[SPECIES] = FakePromise;
	  SUBCLASSING = promise.then(function () {
	    /* empty */
	  }) instanceof FakePromise;
	  if (!SUBCLASSING) return true; // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test

	  return !GLOBAL_CORE_JS_PROMISE && IS_BROWSER && !NATIVE_REJECTION_EVENT;
	});
	var INCORRECT_ITERATION = FORCED || !checkCorrectnessOfIteration(function (iterable) {
	  PromiseConstructor.all(iterable)['catch'](function () {
	    /* empty */
	  });
	}); // helpers

	var isThenable = function (it) {
	  var then;
	  return isObject(it) && isCallable$1(then = it.then) ? then : false;
	};

	var callReaction = function (reaction, state) {
	  var value = state.value;
	  var ok = state.state == FULFILLED;
	  var handler = ok ? reaction.ok : reaction.fail;
	  var resolve = reaction.resolve;
	  var reject = reaction.reject;
	  var domain = reaction.domain;
	  var result, then, exited;

	  try {
	    if (handler) {
	      if (!ok) {
	        if (state.rejection === UNHANDLED) onHandleUnhandled(state);
	        state.rejection = HANDLED;
	      }

	      if (handler === true) result = value;else {
	        if (domain) domain.enter();
	        result = handler(value); // can throw

	        if (domain) {
	          domain.exit();
	          exited = true;
	        }
	      }

	      if (result === reaction.promise) {
	        reject(TypeError$1('Promise-chain cycle'));
	      } else if (then = isThenable(result)) {
	        call$2(then, result, resolve, reject);
	      } else resolve(result);
	    } else reject(value);
	  } catch (error) {
	    if (domain && !exited) domain.exit();
	    reject(error);
	  }
	};

	var notify = function (state, isReject) {
	  if (state.notified) return;
	  state.notified = true;
	  microtask(function () {
	    var reactions = state.reactions;
	    var reaction;

	    while (reaction = reactions.get()) {
	      callReaction(reaction, state);
	    }

	    state.notified = false;
	    if (isReject && !state.rejection) onUnhandled(state);
	  });
	};

	var dispatchEvent = function (name, promise, reason) {
	  var event, handler;

	  if (DISPATCH_EVENT) {
	    event = document$1.createEvent('Event');
	    event.promise = promise;
	    event.reason = reason;
	    event.initEvent(name, false, true);
	    global$3.dispatchEvent(event);
	  } else event = {
	    promise: promise,
	    reason: reason
	  };

	  if (!NATIVE_REJECTION_EVENT && (handler = global$3['on' + name])) handler(event);else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
	};

	var onUnhandled = function (state) {
	  call$2(task, global$3, function () {
	    var promise = state.facade;
	    var value = state.value;
	    var IS_UNHANDLED = isUnhandled(state);
	    var result;

	    if (IS_UNHANDLED) {
	      result = perform$2(function () {
	        if (IS_NODE) {
	          process.emit('unhandledRejection', value, promise);
	        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
	      }); // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should

	      state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
	      if (result.error) throw result.value;
	    }
	  });
	};

	var isUnhandled = function (state) {
	  return state.rejection !== HANDLED && !state.parent;
	};

	var onHandleUnhandled = function (state) {
	  call$2(task, global$3, function () {
	    var promise = state.facade;

	    if (IS_NODE) {
	      process.emit('rejectionHandled', promise);
	    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
	  });
	};

	var bind = function (fn, state, unwrap) {
	  return function (value) {
	    fn(state, value, unwrap);
	  };
	};

	var internalReject = function (state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  state.value = value;
	  state.state = REJECTED;
	  notify(state, true);
	};

	var internalResolve = function (state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;

	  try {
	    if (state.facade === value) throw TypeError$1("Promise can't be resolved itself");
	    var then = isThenable(value);

	    if (then) {
	      microtask(function () {
	        var wrapper = {
	          done: false
	        };

	        try {
	          call$2(then, value, bind(internalResolve, wrapper, state), bind(internalReject, wrapper, state));
	        } catch (error) {
	          internalReject(wrapper, error, state);
	        }
	      });
	    } else {
	      state.value = value;
	      state.state = FULFILLED;
	      notify(state, false);
	    }
	  } catch (error) {
	    internalReject({
	      done: false
	    }, error, state);
	  }
	}; // constructor polyfill


	if (FORCED) {
	  // 25.4.3.1 Promise(executor)
	  PromiseConstructor = function Promise(executor) {
	    anInstance(this, PromisePrototype);
	    aCallable$2(executor);
	    call$2(Internal, this);
	    var state = getInternalState$1(this);

	    try {
	      executor(bind(internalResolve, state), bind(internalReject, state));
	    } catch (error) {
	      internalReject(state, error);
	    }
	  };

	  PromisePrototype = PromiseConstructor.prototype; // eslint-disable-next-line no-unused-vars -- required for `.length`

	  Internal = function Promise(executor) {
	    setInternalState$1(this, {
	      type: PROMISE,
	      done: false,
	      notified: false,
	      parent: false,
	      reactions: new Queue(),
	      rejection: false,
	      state: PENDING,
	      value: undefined
	    });
	  };

	  Internal.prototype = redefineAll(PromisePrototype, {
	    // `Promise.prototype.then` method
	    // https://tc39.es/ecma262/#sec-promise.prototype.then
	    then: function then(onFulfilled, onRejected) {
	      var state = getInternalPromiseState(this);
	      var reaction = newPromiseCapability(speciesConstructor$1(this, PromiseConstructor));
	      state.parent = true;
	      reaction.ok = isCallable$1(onFulfilled) ? onFulfilled : true;
	      reaction.fail = isCallable$1(onRejected) && onRejected;
	      reaction.domain = IS_NODE ? process.domain : undefined;
	      if (state.state == PENDING) state.reactions.add(reaction);else microtask(function () {
	        callReaction(reaction, state);
	      });
	      return reaction.promise;
	    },
	    // `Promise.prototype.catch` method
	    // https://tc39.es/ecma262/#sec-promise.prototype.catch
	    'catch': function (onRejected) {
	      return this.then(undefined, onRejected);
	    }
	  });

	  OwnPromiseCapability = function () {
	    var promise = new Internal();
	    var state = getInternalState$1(promise);
	    this.promise = promise;
	    this.resolve = bind(internalResolve, state);
	    this.reject = bind(internalReject, state);
	  };

	  newPromiseCapabilityModule$2.f = newPromiseCapability = function (C) {
	    return C === PromiseConstructor || C === PromiseWrapper ? new OwnPromiseCapability(C) : newGenericPromiseCapability(C);
	  };

	  if (isCallable$1(NativePromise$1) && NativePromisePrototype !== Object.prototype) {
	    nativeThen = NativePromisePrototype.then;

	    if (!SUBCLASSING) {
	      // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
	      redefine$1(NativePromisePrototype, 'then', function then(onFulfilled, onRejected) {
	        var that = this;
	        return new PromiseConstructor(function (resolve, reject) {
	          call$2(nativeThen, that, resolve, reject);
	        }).then(onFulfilled, onRejected); // https://github.com/zloirock/core-js/issues/640
	      }, {
	        unsafe: true
	      }); // makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`

	      redefine$1(NativePromisePrototype, 'catch', PromisePrototype['catch'], {
	        unsafe: true
	      });
	    } // make `.constructor === Promise` work for native promise-based APIs


	    try {
	      delete NativePromisePrototype.constructor;
	    } catch (error) {
	      /* empty */
	    } // make `instanceof Promise` work for native promise-based APIs


	    if (setPrototypeOf) {
	      setPrototypeOf(NativePromisePrototype, PromisePrototype);
	    }
	  }
	}

	$$3({
	  global: true,
	  wrap: true,
	  forced: FORCED
	}, {
	  Promise: PromiseConstructor
	});
	setToStringTag(PromiseConstructor, PROMISE, false);
	setSpecies(PROMISE);
	PromiseWrapper = getBuiltIn$2(PROMISE); // statics

	$$3({
	  target: PROMISE,
	  stat: true,
	  forced: FORCED
	}, {
	  // `Promise.reject` method
	  // https://tc39.es/ecma262/#sec-promise.reject
	  reject: function reject(r) {
	    var capability = newPromiseCapability(this);
	    call$2(capability.reject, undefined, r);
	    return capability.promise;
	  }
	});
	$$3({
	  target: PROMISE,
	  stat: true,
	  forced: FORCED
	}, {
	  // `Promise.resolve` method
	  // https://tc39.es/ecma262/#sec-promise.resolve
	  resolve: function resolve(x) {
	    return promiseResolve$1(this, x);
	  }
	});
	$$3({
	  target: PROMISE,
	  stat: true,
	  forced: INCORRECT_ITERATION
	}, {
	  // `Promise.all` method
	  // https://tc39.es/ecma262/#sec-promise.all
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapability(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform$2(function () {
	      var $promiseResolve = aCallable$2(C.resolve);
	      var values = [];
	      var counter = 0;
	      var remaining = 1;
	      iterate$2(iterable, function (promise) {
	        var index = counter++;
	        var alreadyCalled = false;
	        remaining++;
	        call$2($promiseResolve, C, promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  },
	  // `Promise.race` method
	  // https://tc39.es/ecma262/#sec-promise.race
	  race: function race(iterable) {
	    var C = this;
	    var capability = newPromiseCapability(C);
	    var reject = capability.reject;
	    var result = perform$2(function () {
	      var $promiseResolve = aCallable$2(C.resolve);
	      iterate$2(iterable, function (promise) {
	        call$2($promiseResolve, C, promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	var $$2 = _export;

	var call$1 = functionCall;

	var aCallable$1 = aCallable$7;

	var newPromiseCapabilityModule$1 = newPromiseCapability$2;

	var perform$1 = perform$3;

	var iterate$1 = iterate$4; // `Promise.allSettled` method
	// https://tc39.es/ecma262/#sec-promise.allsettled


	$$2({
	  target: 'Promise',
	  stat: true
	}, {
	  allSettled: function allSettled(iterable) {
	    var C = this;
	    var capability = newPromiseCapabilityModule$1.f(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform$1(function () {
	      var promiseResolve = aCallable$1(C.resolve);
	      var values = [];
	      var counter = 0;
	      var remaining = 1;
	      iterate$1(iterable, function (promise) {
	        var index = counter++;
	        var alreadyCalled = false;
	        remaining++;
	        call$1(promiseResolve, C, promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = {
	            status: 'fulfilled',
	            value: value
	          };
	          --remaining || resolve(values);
	        }, function (error) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = {
	            status: 'rejected',
	            reason: error
	          };
	          --remaining || resolve(values);
	        });
	      });
	      --remaining || resolve(values);
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	var $$1 = _export;

	var aCallable = aCallable$7;

	var getBuiltIn$1 = getBuiltIn$9;

	var call = functionCall;

	var newPromiseCapabilityModule = newPromiseCapability$2;

	var perform = perform$3;

	var iterate = iterate$4;

	var PROMISE_ANY_ERROR = 'No one promise resolved'; // `Promise.any` method
	// https://tc39.es/ecma262/#sec-promise.any

	$$1({
	  target: 'Promise',
	  stat: true
	}, {
	  any: function any(iterable) {
	    var C = this;
	    var AggregateError = getBuiltIn$1('AggregateError');
	    var capability = newPromiseCapabilityModule.f(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform(function () {
	      var promiseResolve = aCallable(C.resolve);
	      var errors = [];
	      var counter = 0;
	      var remaining = 1;
	      var alreadyResolved = false;
	      iterate(iterable, function (promise) {
	        var index = counter++;
	        var alreadyRejected = false;
	        remaining++;
	        call(promiseResolve, C, promise).then(function (value) {
	          if (alreadyRejected || alreadyResolved) return;
	          alreadyResolved = true;
	          resolve(value);
	        }, function (error) {
	          if (alreadyRejected || alreadyResolved) return;
	          alreadyRejected = true;
	          errors[index] = error;
	          --remaining || reject(new AggregateError(errors, PROMISE_ANY_ERROR));
	        });
	      });
	      --remaining || reject(new AggregateError(errors, PROMISE_ANY_ERROR));
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	var $ = _export;

	var NativePromise = nativePromiseConstructor;

	var fails = fails$b;

	var getBuiltIn = getBuiltIn$9;

	var isCallable = isCallable$i;

	var speciesConstructor = speciesConstructor$2;

	var promiseResolve = promiseResolve$2;

	var redefine = redefine$7.exports; // Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829


	var NON_GENERIC = !!NativePromise && fails(function () {
	  NativePromise.prototype['finally'].call({
	    then: function () {
	      /* empty */
	    }
	  }, function () {
	    /* empty */
	  });
	}); // `Promise.prototype.finally` method
	// https://tc39.es/ecma262/#sec-promise.prototype.finally

	$({
	  target: 'Promise',
	  proto: true,
	  real: true,
	  forced: NON_GENERIC
	}, {
	  'finally': function (onFinally) {
	    var C = speciesConstructor(this, getBuiltIn('Promise'));
	    var isFunction = isCallable(onFinally);
	    return this.then(isFunction ? function (x) {
	      return promiseResolve(C, onFinally()).then(function () {
	        return x;
	      });
	    } : onFinally, isFunction ? function (e) {
	      return promiseResolve(C, onFinally()).then(function () {
	        throw e;
	      });
	    } : onFinally);
	  }
	}); // makes sure that native promise-based APIs `Promise#finally` properly works with patched `Promise#then`

	if (isCallable(NativePromise)) {
	  var method = getBuiltIn('Promise').prototype['finally'];

	  if (NativePromise.prototype['finally'] !== method) {
	    redefine(NativePromise.prototype, 'finally', method, {
	      unsafe: true
	    });
	  }
	}

	var uncurryThis = functionUncurryThis;

	var toIntegerOrInfinity = toIntegerOrInfinity$3;

	var toString$1 = toString$4;

	var requireObjectCoercible = requireObjectCoercible$3;

	var charAt$1 = uncurryThis(''.charAt);
	var charCodeAt = uncurryThis(''.charCodeAt);
	var stringSlice = uncurryThis(''.slice);

	var createMethod = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = toString$1(requireObjectCoercible($this));
	    var position = toIntegerOrInfinity(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = charCodeAt(S, position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF ? CONVERT_TO_STRING ? charAt$1(S, position) : first : CONVERT_TO_STRING ? stringSlice(S, position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod(true)
	};

	var charAt = stringMultibyte.charAt;

	var toString = toString$4;

	var InternalStateModule = internalState;

	var defineIterator = defineIterator$2;

	var STRING_ITERATOR = 'String Iterator';
	var setInternalState = InternalStateModule.set;
	var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR); // `String.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-string.prototype-@@iterator

	defineIterator(String, 'String', function (iterated) {
	  setInternalState(this, {
	    type: STRING_ITERATOR,
	    string: toString(iterated),
	    index: 0
	  }); // `%StringIteratorPrototype%.next` method
	  // https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
	}, function next() {
	  var state = getInternalState(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) return {
	    value: undefined,
	    done: true
	  };
	  point = charAt(string, index);
	  state.index += point.length;
	  return {
	    value: point,
	    done: false
	  };
	});

	var global$2 = global$D;

	var path$1 = global$2;

	var path = path$1;

	var promise$1 = path.Promise;

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`
	var documentCreateElement = documentCreateElement$2;

	var classList = documentCreateElement('span').classList;
	var DOMTokenListPrototype$1 = classList && classList.constructor && classList.constructor.prototype;
	var domTokenListPrototype = DOMTokenListPrototype$1 === Object.prototype ? undefined : DOMTokenListPrototype$1;

	var global$1 = global$D;

	var DOMIterables = domIterables;

	var DOMTokenListPrototype = domTokenListPrototype;

	var ArrayIteratorMethods = es_array_iterator;

	var createNonEnumerableProperty = createNonEnumerableProperty$7;

	var wellKnownSymbol = wellKnownSymbol$f;

	var ITERATOR = wellKnownSymbol('iterator');
	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	var ArrayValues = ArrayIteratorMethods.values;

	var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
	  if (CollectionPrototype) {
	    // some Chrome versions have non-configurable methods on DOMTokenList
	    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
	      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
	    } catch (error) {
	      CollectionPrototype[ITERATOR] = ArrayValues;
	    }

	    if (!CollectionPrototype[TO_STRING_TAG]) {
	      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
	    }

	    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
	      // some Chrome versions have non-configurable methods on DOMTokenList
	      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
	        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
	      } catch (error) {
	        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
	      }
	    }
	  }
	};

	for (var COLLECTION_NAME in DOMIterables) {
	  handlePrototype(global$1[COLLECTION_NAME] && global$1[COLLECTION_NAME].prototype, COLLECTION_NAME);
	}

	handlePrototype(DOMTokenListPrototype, 'DOMTokenList');

	var parent = promise$1;



	var promise = parent;

	return promise;

}));
