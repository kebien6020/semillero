(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var _assign = require('object-assign');

var emptyObject = require('fbjs/lib/emptyObject');
var _invariant = require('fbjs/lib/invariant');

if (process.env.NODE_ENV !== 'production') {
  var warning = require('fbjs/lib/warning');
}

var MIXINS_KEY = 'mixins';

// Helper function to allow the creation of anonymous functions which do not
// have .name set to the name of the variable being assigned to.
function identity(fn) {
  return fn;
}

var ReactPropTypeLocationNames;
if (process.env.NODE_ENV !== 'production') {
  ReactPropTypeLocationNames = {
    prop: 'prop',
    context: 'context',
    childContext: 'child context'
  };
} else {
  ReactPropTypeLocationNames = {};
}

function factory(ReactComponent, isValidElement, ReactNoopUpdateQueue) {
  /**
   * Policies that describe methods in `ReactClassInterface`.
   */

  var injectedMixins = [];

  /**
   * Composite components are higher-level components that compose other composite
   * or host components.
   *
   * To create a new type of `ReactClass`, pass a specification of
   * your new class to `React.createClass`. The only requirement of your class
   * specification is that you implement a `render` method.
   *
   *   var MyComponent = React.createClass({
   *     render: function() {
   *       return <div>Hello World</div>;
   *     }
   *   });
   *
   * The class specification supports a specific protocol of methods that have
   * special meaning (e.g. `render`). See `ReactClassInterface` for
   * more the comprehensive protocol. Any other properties and methods in the
   * class specification will be available on the prototype.
   *
   * @interface ReactClassInterface
   * @internal
   */
  var ReactClassInterface = {
    /**
     * An array of Mixin objects to include when defining your component.
     *
     * @type {array}
     * @optional
     */
    mixins: 'DEFINE_MANY',

    /**
     * An object containing properties and methods that should be defined on
     * the component's constructor instead of its prototype (static methods).
     *
     * @type {object}
     * @optional
     */
    statics: 'DEFINE_MANY',

    /**
     * Definition of prop types for this component.
     *
     * @type {object}
     * @optional
     */
    propTypes: 'DEFINE_MANY',

    /**
     * Definition of context types for this component.
     *
     * @type {object}
     * @optional
     */
    contextTypes: 'DEFINE_MANY',

    /**
     * Definition of context types this component sets for its children.
     *
     * @type {object}
     * @optional
     */
    childContextTypes: 'DEFINE_MANY',

    // ==== Definition methods ====

    /**
     * Invoked when the component is mounted. Values in the mapping will be set on
     * `this.props` if that prop is not specified (i.e. using an `in` check).
     *
     * This method is invoked before `getInitialState` and therefore cannot rely
     * on `this.state` or use `this.setState`.
     *
     * @return {object}
     * @optional
     */
    getDefaultProps: 'DEFINE_MANY_MERGED',

    /**
     * Invoked once before the component is mounted. The return value will be used
     * as the initial value of `this.state`.
     *
     *   getInitialState: function() {
     *     return {
     *       isOn: false,
     *       fooBaz: new BazFoo()
     *     }
     *   }
     *
     * @return {object}
     * @optional
     */
    getInitialState: 'DEFINE_MANY_MERGED',

    /**
     * @return {object}
     * @optional
     */
    getChildContext: 'DEFINE_MANY_MERGED',

    /**
     * Uses props from `this.props` and state from `this.state` to render the
     * structure of the component.
     *
     * No guarantees are made about when or how often this method is invoked, so
     * it must not have side effects.
     *
     *   render: function() {
     *     var name = this.props.name;
     *     return <div>Hello, {name}!</div>;
     *   }
     *
     * @return {ReactComponent}
     * @required
     */
    render: 'DEFINE_ONCE',

    // ==== Delegate methods ====

    /**
     * Invoked when the component is initially created and about to be mounted.
     * This may have side effects, but any external subscriptions or data created
     * by this method must be cleaned up in `componentWillUnmount`.
     *
     * @optional
     */
    componentWillMount: 'DEFINE_MANY',

    /**
     * Invoked when the component has been mounted and has a DOM representation.
     * However, there is no guarantee that the DOM node is in the document.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been mounted (initialized and rendered) for the first time.
     *
     * @param {DOMElement} rootNode DOM element representing the component.
     * @optional
     */
    componentDidMount: 'DEFINE_MANY',

    /**
     * Invoked before the component receives new props.
     *
     * Use this as an opportunity to react to a prop transition by updating the
     * state using `this.setState`. Current props are accessed via `this.props`.
     *
     *   componentWillReceiveProps: function(nextProps, nextContext) {
     *     this.setState({
     *       likesIncreasing: nextProps.likeCount > this.props.likeCount
     *     });
     *   }
     *
     * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
     * transition may cause a state change, but the opposite is not true. If you
     * need it, you are probably looking for `componentWillUpdate`.
     *
     * @param {object} nextProps
     * @optional
     */
    componentWillReceiveProps: 'DEFINE_MANY',

    /**
     * Invoked while deciding if the component should be updated as a result of
     * receiving new props, state and/or context.
     *
     * Use this as an opportunity to `return false` when you're certain that the
     * transition to the new props/state/context will not require a component
     * update.
     *
     *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
     *     return !equal(nextProps, this.props) ||
     *       !equal(nextState, this.state) ||
     *       !equal(nextContext, this.context);
     *   }
     *
     * @param {object} nextProps
     * @param {?object} nextState
     * @param {?object} nextContext
     * @return {boolean} True if the component should update.
     * @optional
     */
    shouldComponentUpdate: 'DEFINE_ONCE',

    /**
     * Invoked when the component is about to update due to a transition from
     * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
     * and `nextContext`.
     *
     * Use this as an opportunity to perform preparation before an update occurs.
     *
     * NOTE: You **cannot** use `this.setState()` in this method.
     *
     * @param {object} nextProps
     * @param {?object} nextState
     * @param {?object} nextContext
     * @param {ReactReconcileTransaction} transaction
     * @optional
     */
    componentWillUpdate: 'DEFINE_MANY',

    /**
     * Invoked when the component's DOM representation has been updated.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been updated.
     *
     * @param {object} prevProps
     * @param {?object} prevState
     * @param {?object} prevContext
     * @param {DOMElement} rootNode DOM element representing the component.
     * @optional
     */
    componentDidUpdate: 'DEFINE_MANY',

    /**
     * Invoked when the component is about to be removed from its parent and have
     * its DOM representation destroyed.
     *
     * Use this as an opportunity to deallocate any external resources.
     *
     * NOTE: There is no `componentDidUnmount` since your component will have been
     * destroyed by that point.
     *
     * @optional
     */
    componentWillUnmount: 'DEFINE_MANY',

    // ==== Advanced methods ====

    /**
     * Updates the component's currently mounted DOM representation.
     *
     * By default, this implements React's rendering and reconciliation algorithm.
     * Sophisticated clients may wish to override this.
     *
     * @param {ReactReconcileTransaction} transaction
     * @internal
     * @overridable
     */
    updateComponent: 'OVERRIDE_BASE'
  };

  /**
   * Mapping from class specification keys to special processing functions.
   *
   * Although these are declared like instance properties in the specification
   * when defining classes using `React.createClass`, they are actually static
   * and are accessible on the constructor instead of the prototype. Despite
   * being static, they must be defined outside of the "statics" key under
   * which all other static methods are defined.
   */
  var RESERVED_SPEC_KEYS = {
    displayName: function(Constructor, displayName) {
      Constructor.displayName = displayName;
    },
    mixins: function(Constructor, mixins) {
      if (mixins) {
        for (var i = 0; i < mixins.length; i++) {
          mixSpecIntoComponent(Constructor, mixins[i]);
        }
      }
    },
    childContextTypes: function(Constructor, childContextTypes) {
      if (process.env.NODE_ENV !== 'production') {
        validateTypeDef(Constructor, childContextTypes, 'childContext');
      }
      Constructor.childContextTypes = _assign(
        {},
        Constructor.childContextTypes,
        childContextTypes
      );
    },
    contextTypes: function(Constructor, contextTypes) {
      if (process.env.NODE_ENV !== 'production') {
        validateTypeDef(Constructor, contextTypes, 'context');
      }
      Constructor.contextTypes = _assign(
        {},
        Constructor.contextTypes,
        contextTypes
      );
    },
    /**
     * Special case getDefaultProps which should move into statics but requires
     * automatic merging.
     */
    getDefaultProps: function(Constructor, getDefaultProps) {
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps = createMergedResultFunction(
          Constructor.getDefaultProps,
          getDefaultProps
        );
      } else {
        Constructor.getDefaultProps = getDefaultProps;
      }
    },
    propTypes: function(Constructor, propTypes) {
      if (process.env.NODE_ENV !== 'production') {
        validateTypeDef(Constructor, propTypes, 'prop');
      }
      Constructor.propTypes = _assign({}, Constructor.propTypes, propTypes);
    },
    statics: function(Constructor, statics) {
      mixStaticSpecIntoComponent(Constructor, statics);
    },
    autobind: function() {}
  };

  function validateTypeDef(Constructor, typeDef, location) {
    for (var propName in typeDef) {
      if (typeDef.hasOwnProperty(propName)) {
        // use a warning instead of an _invariant so components
        // don't show up in prod but only in __DEV__
        if (process.env.NODE_ENV !== 'production') {
          warning(
            typeof typeDef[propName] === 'function',
            '%s: %s type `%s` is invalid; it must be a function, usually from ' +
              'React.PropTypes.',
            Constructor.displayName || 'ReactClass',
            ReactPropTypeLocationNames[location],
            propName
          );
        }
      }
    }
  }

  function validateMethodOverride(isAlreadyDefined, name) {
    var specPolicy = ReactClassInterface.hasOwnProperty(name)
      ? ReactClassInterface[name]
      : null;

    // Disallow overriding of base class methods unless explicitly allowed.
    if (ReactClassMixin.hasOwnProperty(name)) {
      _invariant(
        specPolicy === 'OVERRIDE_BASE',
        'ReactClassInterface: You are attempting to override ' +
          '`%s` from your class specification. Ensure that your method names ' +
          'do not overlap with React methods.',
        name
      );
    }

    // Disallow defining methods more than once unless explicitly allowed.
    if (isAlreadyDefined) {
      _invariant(
        specPolicy === 'DEFINE_MANY' || specPolicy === 'DEFINE_MANY_MERGED',
        'ReactClassInterface: You are attempting to define ' +
          '`%s` on your component more than once. This conflict may be due ' +
          'to a mixin.',
        name
      );
    }
  }

  /**
   * Mixin helper which handles policy validation and reserved
   * specification keys when building React classes.
   */
  function mixSpecIntoComponent(Constructor, spec) {
    if (!spec) {
      if (process.env.NODE_ENV !== 'production') {
        var typeofSpec = typeof spec;
        var isMixinValid = typeofSpec === 'object' && spec !== null;

        if (process.env.NODE_ENV !== 'production') {
          warning(
            isMixinValid,
            "%s: You're attempting to include a mixin that is either null " +
              'or not an object. Check the mixins included by the component, ' +
              'as well as any mixins they include themselves. ' +
              'Expected object but got %s.',
            Constructor.displayName || 'ReactClass',
            spec === null ? null : typeofSpec
          );
        }
      }

      return;
    }

    _invariant(
      typeof spec !== 'function',
      "ReactClass: You're attempting to " +
        'use a component class or function as a mixin. Instead, just use a ' +
        'regular object.'
    );
    _invariant(
      !isValidElement(spec),
      "ReactClass: You're attempting to " +
        'use a component as a mixin. Instead, just use a regular object.'
    );

    var proto = Constructor.prototype;
    var autoBindPairs = proto.__reactAutoBindPairs;

    // By handling mixins before any other properties, we ensure the same
    // chaining order is applied to methods with DEFINE_MANY policy, whether
    // mixins are listed before or after these methods in the spec.
    if (spec.hasOwnProperty(MIXINS_KEY)) {
      RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
    }

    for (var name in spec) {
      if (!spec.hasOwnProperty(name)) {
        continue;
      }

      if (name === MIXINS_KEY) {
        // We have already handled mixins in a special case above.
        continue;
      }

      var property = spec[name];
      var isAlreadyDefined = proto.hasOwnProperty(name);
      validateMethodOverride(isAlreadyDefined, name);

      if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
        RESERVED_SPEC_KEYS[name](Constructor, property);
      } else {
        // Setup methods on prototype:
        // The following member methods should not be automatically bound:
        // 1. Expected ReactClass methods (in the "interface").
        // 2. Overridden methods (that were mixed in).
        var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
        var isFunction = typeof property === 'function';
        var shouldAutoBind =
          isFunction &&
          !isReactClassMethod &&
          !isAlreadyDefined &&
          spec.autobind !== false;

        if (shouldAutoBind) {
          autoBindPairs.push(name, property);
          proto[name] = property;
        } else {
          if (isAlreadyDefined) {
            var specPolicy = ReactClassInterface[name];

            // These cases should already be caught by validateMethodOverride.
            _invariant(
              isReactClassMethod &&
                (specPolicy === 'DEFINE_MANY_MERGED' ||
                  specPolicy === 'DEFINE_MANY'),
              'ReactClass: Unexpected spec policy %s for key %s ' +
                'when mixing in component specs.',
              specPolicy,
              name
            );

            // For methods which are defined more than once, call the existing
            // methods before calling the new property, merging if appropriate.
            if (specPolicy === 'DEFINE_MANY_MERGED') {
              proto[name] = createMergedResultFunction(proto[name], property);
            } else if (specPolicy === 'DEFINE_MANY') {
              proto[name] = createChainedFunction(proto[name], property);
            }
          } else {
            proto[name] = property;
            if (process.env.NODE_ENV !== 'production') {
              // Add verbose displayName to the function, which helps when looking
              // at profiling tools.
              if (typeof property === 'function' && spec.displayName) {
                proto[name].displayName = spec.displayName + '_' + name;
              }
            }
          }
        }
      }
    }
  }

  function mixStaticSpecIntoComponent(Constructor, statics) {
    if (!statics) {
      return;
    }
    for (var name in statics) {
      var property = statics[name];
      if (!statics.hasOwnProperty(name)) {
        continue;
      }

      var isReserved = name in RESERVED_SPEC_KEYS;
      _invariant(
        !isReserved,
        'ReactClass: You are attempting to define a reserved ' +
          'property, `%s`, that shouldn\'t be on the "statics" key. Define it ' +
          'as an instance property instead; it will still be accessible on the ' +
          'constructor.',
        name
      );

      var isInherited = name in Constructor;
      _invariant(
        !isInherited,
        'ReactClass: You are attempting to define ' +
          '`%s` on your component more than once. This conflict may be ' +
          'due to a mixin.',
        name
      );
      Constructor[name] = property;
    }
  }

  /**
   * Merge two objects, but throw if both contain the same key.
   *
   * @param {object} one The first object, which is mutated.
   * @param {object} two The second object
   * @return {object} one after it has been mutated to contain everything in two.
   */
  function mergeIntoWithNoDuplicateKeys(one, two) {
    _invariant(
      one && two && typeof one === 'object' && typeof two === 'object',
      'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.'
    );

    for (var key in two) {
      if (two.hasOwnProperty(key)) {
        _invariant(
          one[key] === undefined,
          'mergeIntoWithNoDuplicateKeys(): ' +
            'Tried to merge two objects with the same key: `%s`. This conflict ' +
            'may be due to a mixin; in particular, this may be caused by two ' +
            'getInitialState() or getDefaultProps() methods returning objects ' +
            'with clashing keys.',
          key
        );
        one[key] = two[key];
      }
    }
    return one;
  }

  /**
   * Creates a function that invokes two functions and merges their return values.
   *
   * @param {function} one Function to invoke first.
   * @param {function} two Function to invoke second.
   * @return {function} Function that invokes the two argument functions.
   * @private
   */
  function createMergedResultFunction(one, two) {
    return function mergedResult() {
      var a = one.apply(this, arguments);
      var b = two.apply(this, arguments);
      if (a == null) {
        return b;
      } else if (b == null) {
        return a;
      }
      var c = {};
      mergeIntoWithNoDuplicateKeys(c, a);
      mergeIntoWithNoDuplicateKeys(c, b);
      return c;
    };
  }

  /**
   * Creates a function that invokes two functions and ignores their return vales.
   *
   * @param {function} one Function to invoke first.
   * @param {function} two Function to invoke second.
   * @return {function} Function that invokes the two argument functions.
   * @private
   */
  function createChainedFunction(one, two) {
    return function chainedFunction() {
      one.apply(this, arguments);
      two.apply(this, arguments);
    };
  }

  /**
   * Binds a method to the component.
   *
   * @param {object} component Component whose method is going to be bound.
   * @param {function} method Method to be bound.
   * @return {function} The bound method.
   */
  function bindAutoBindMethod(component, method) {
    var boundMethod = method.bind(component);
    if (process.env.NODE_ENV !== 'production') {
      boundMethod.__reactBoundContext = component;
      boundMethod.__reactBoundMethod = method;
      boundMethod.__reactBoundArguments = null;
      var componentName = component.constructor.displayName;
      var _bind = boundMethod.bind;
      boundMethod.bind = function(newThis) {
        for (
          var _len = arguments.length,
            args = Array(_len > 1 ? _len - 1 : 0),
            _key = 1;
          _key < _len;
          _key++
        ) {
          args[_key - 1] = arguments[_key];
        }

        // User is trying to bind() an autobound method; we effectively will
        // ignore the value of "this" that the user is trying to use, so
        // let's warn.
        if (newThis !== component && newThis !== null) {
          if (process.env.NODE_ENV !== 'production') {
            warning(
              false,
              'bind(): React component methods may only be bound to the ' +
                'component instance. See %s',
              componentName
            );
          }
        } else if (!args.length) {
          if (process.env.NODE_ENV !== 'production') {
            warning(
              false,
              'bind(): You are binding a component method to the component. ' +
                'React does this for you automatically in a high-performance ' +
                'way, so you can safely remove this call. See %s',
              componentName
            );
          }
          return boundMethod;
        }
        var reboundMethod = _bind.apply(boundMethod, arguments);
        reboundMethod.__reactBoundContext = component;
        reboundMethod.__reactBoundMethod = method;
        reboundMethod.__reactBoundArguments = args;
        return reboundMethod;
      };
    }
    return boundMethod;
  }

  /**
   * Binds all auto-bound methods in a component.
   *
   * @param {object} component Component whose method is going to be bound.
   */
  function bindAutoBindMethods(component) {
    var pairs = component.__reactAutoBindPairs;
    for (var i = 0; i < pairs.length; i += 2) {
      var autoBindKey = pairs[i];
      var method = pairs[i + 1];
      component[autoBindKey] = bindAutoBindMethod(component, method);
    }
  }

  var IsMountedPreMixin = {
    componentDidMount: function() {
      this.__isMounted = true;
    }
  };

  var IsMountedPostMixin = {
    componentWillUnmount: function() {
      this.__isMounted = false;
    }
  };

  /**
   * Add more to the ReactClass base class. These are all legacy features and
   * therefore not already part of the modern ReactComponent.
   */
  var ReactClassMixin = {
    /**
     * TODO: This will be deprecated because state should always keep a consistent
     * type signature and the only use case for this, is to avoid that.
     */
    replaceState: function(newState, callback) {
      this.updater.enqueueReplaceState(this, newState, callback);
    },

    /**
     * Checks whether or not this composite component is mounted.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    isMounted: function() {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          this.__didWarnIsMounted,
          '%s: isMounted is deprecated. Instead, make sure to clean up ' +
            'subscriptions and pending requests in componentWillUnmount to ' +
            'prevent memory leaks.',
          (this.constructor && this.constructor.displayName) ||
            this.name ||
            'Component'
        );
        this.__didWarnIsMounted = true;
      }
      return !!this.__isMounted;
    }
  };

  var ReactClassComponent = function() {};
  _assign(
    ReactClassComponent.prototype,
    ReactComponent.prototype,
    ReactClassMixin
  );

  /**
   * Creates a composite component class given a class specification.
   * See https://facebook.github.io/react/docs/top-level-api.html#react.createclass
   *
   * @param {object} spec Class specification (which must define `render`).
   * @return {function} Component constructor function.
   * @public
   */
  function createClass(spec) {
    // To keep our warnings more understandable, we'll use a little hack here to
    // ensure that Constructor.name !== 'Constructor'. This makes sure we don't
    // unnecessarily identify a class without displayName as 'Constructor'.
    var Constructor = identity(function(props, context, updater) {
      // This constructor gets overridden by mocks. The argument is used
      // by mocks to assert on what gets mounted.

      if (process.env.NODE_ENV !== 'production') {
        warning(
          this instanceof Constructor,
          'Something is calling a React component directly. Use a factory or ' +
            'JSX instead. See: https://fb.me/react-legacyfactory'
        );
      }

      // Wire up auto-binding
      if (this.__reactAutoBindPairs.length) {
        bindAutoBindMethods(this);
      }

      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;

      this.state = null;

      // ReactClasses doesn't have constructors. Instead, they use the
      // getInitialState and componentWillMount methods for initialization.

      var initialState = this.getInitialState ? this.getInitialState() : null;
      if (process.env.NODE_ENV !== 'production') {
        // We allow auto-mocks to proceed as if they're returning null.
        if (
          initialState === undefined &&
          this.getInitialState._isMockFunction
        ) {
          // This is probably bad practice. Consider warning here and
          // deprecating this convenience.
          initialState = null;
        }
      }
      _invariant(
        typeof initialState === 'object' && !Array.isArray(initialState),
        '%s.getInitialState(): must return an object or null',
        Constructor.displayName || 'ReactCompositeComponent'
      );

      this.state = initialState;
    });
    Constructor.prototype = new ReactClassComponent();
    Constructor.prototype.constructor = Constructor;
    Constructor.prototype.__reactAutoBindPairs = [];

    injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));

    mixSpecIntoComponent(Constructor, IsMountedPreMixin);
    mixSpecIntoComponent(Constructor, spec);
    mixSpecIntoComponent(Constructor, IsMountedPostMixin);

    // Initialize the defaultProps property after all mixins have been merged.
    if (Constructor.getDefaultProps) {
      Constructor.defaultProps = Constructor.getDefaultProps();
    }

    if (process.env.NODE_ENV !== 'production') {
      // This is a tag to indicate that the use of these method names is ok,
      // since it's used with createClass. If it's not, then it's likely a
      // mistake so we'll warn you to use the static property, property
      // initializer or constructor respectively.
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps.isReactClassApproved = {};
      }
      if (Constructor.prototype.getInitialState) {
        Constructor.prototype.getInitialState.isReactClassApproved = {};
      }
    }

    _invariant(
      Constructor.prototype.render,
      'createClass(...): Class specification must implement a `render` method.'
    );

    if (process.env.NODE_ENV !== 'production') {
      warning(
        !Constructor.prototype.componentShouldUpdate,
        '%s has a method called ' +
          'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' +
          'The name is phrased as a question because the function is ' +
          'expected to return a value.',
        spec.displayName || 'A component'
      );
      warning(
        !Constructor.prototype.componentWillRecieveProps,
        '%s has a method called ' +
          'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?',
        spec.displayName || 'A component'
      );
    }

    // Reduce time spent doing lookups by setting these on the prototype.
    for (var methodName in ReactClassInterface) {
      if (!Constructor.prototype[methodName]) {
        Constructor.prototype[methodName] = null;
      }
    }

    return Constructor;
  }

  return createClass;
}

module.exports = factory;

}).call(this,require('_process'))
},{"_process":7,"fbjs/lib/emptyObject":3,"fbjs/lib/invariant":4,"fbjs/lib/warning":5,"object-assign":6}],2:[function(require,module,exports){
"use strict";

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;
},{}],3:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var emptyObject = {};

if (process.env.NODE_ENV !== 'production') {
  Object.freeze(emptyObject);
}

module.exports = emptyObject;
}).call(this,require('_process'))
},{"_process":7}],4:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;
}).call(this,require('_process'))
},{"_process":7}],5:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var emptyFunction = require('./emptyFunction');

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (process.env.NODE_ENV !== 'production') {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

module.exports = warning;
}).call(this,require('_process'))
},{"./emptyFunction":2,"_process":7}],6:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],7:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],8:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

if (process.env.NODE_ENV !== 'production') {
  var invariant = require('fbjs/lib/invariant');
  var warning = require('fbjs/lib/warning');
  var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
  var loggedTypeFailures = {};
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, typeof typeSpecs[typeSpecName]);
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
        }
      }
    }
  }
}

module.exports = checkPropTypes;

}).call(this,require('_process'))
},{"./lib/ReactPropTypesSecret":13,"_process":7,"fbjs/lib/invariant":4,"fbjs/lib/warning":5}],9:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

// React 15.5 references this module, and assumes PropTypes are still callable in production.
// Therefore we re-export development-only version with all the PropTypes checks here.
// However if one is migrating to the `prop-types` npm library, they will go through the
// `index.js` entry point, and it will branch depending on the environment.
var factory = require('./factoryWithTypeCheckers');
module.exports = function(isValidElement) {
  // It is still allowed in 15.5.
  var throwOnDirectAccess = false;
  return factory(isValidElement, throwOnDirectAccess);
};

},{"./factoryWithTypeCheckers":11}],10:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var emptyFunction = require('fbjs/lib/emptyFunction');
var invariant = require('fbjs/lib/invariant');
var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    invariant(
      false,
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

},{"./lib/ReactPropTypesSecret":13,"fbjs/lib/emptyFunction":2,"fbjs/lib/invariant":4}],11:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var emptyFunction = require('fbjs/lib/emptyFunction');
var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');
var assign = require('object-assign');

var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
var checkPropTypes = require('./checkPropTypes');

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          invariant(
            false,
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            warning(
              false,
              'You are manually calling a React.PropTypes validation ' +
              'function for the `%s` prop on `%s`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.',
              propFullName,
              componentName
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction.thatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        warning(
          false,
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received %s at index %s.',
          getPostfixForTypeWarning(checker),
          i
        );
        return emptyFunction.thatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

}).call(this,require('_process'))
},{"./checkPropTypes":8,"./lib/ReactPropTypesSecret":13,"_process":7,"fbjs/lib/emptyFunction":2,"fbjs/lib/invariant":4,"fbjs/lib/warning":5,"object-assign":6}],12:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = require('./factoryWithTypeCheckers')(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = require('./factoryWithThrowingShims')();
}

}).call(this,require('_process'))
},{"./factoryWithThrowingShims":10,"./factoryWithTypeCheckers":11,"_process":7}],13:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;

},{}],14:[function(require,module,exports){
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _propTypes = __webpack_require__(2);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var KEYCODE_UP = 38;
	var KEYCODE_DOWN = 40;
	var IS_BROWSER = typeof document != 'undefined';
	var RE_NUMBER = /^[+-]?((\.\d+)|(\d+(\.\d+)?))$/;
	var RE_INCOMPLETE_NUMBER = /^([+-]|\.0*|[+-]\.0*|[+-]?\d+\.)?$/;

	function addClass(element, className) {
	    if (element.classList) {
	        return element.classList.add(className);
	    }
	    if (!element.className.search(new RegExp("\\b" + className + "\\b"))) {
	        element.className = " " + className;
	    }
	}

	function removeClass(element, className) {
	    if (element.className) {
	        if (element.classList) {
	            return element.classList.remove(className);
	        }

	        element.className = element.className.replace(new RegExp("\\b" + className + "\\b", "g"), "");
	    }
	}

	function access(object, prop, defaultValue) {
	    var result = object[prop];
	    if (typeof result == "function") {
	        for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
	            args[_key - 3] = arguments[_key];
	        }

	        result = result.apply(undefined, args);
	    }
	    return result === undefined ? defaultValue : result;
	}

	var NumericInput = function (_Component) {
	    _inherits(NumericInput, _Component);

	    function NumericInput() {
	        var _ref;

	        _classCallCheck(this, NumericInput);

	        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	            args[_key2] = arguments[_key2];
	        }

	        var _this = _possibleConstructorReturn(this, (_ref = NumericInput.__proto__ || Object.getPrototypeOf(NumericInput)).call.apply(_ref, [this].concat(args)));

	        _this._isStrict = !!_this.props.strict;

	        _this.state = _extends({
	            btnDownHover: false,
	            btnDownActive: false,
	            btnUpHover: false,
	            btnUpActive: false,
	            inputFocus: false,

	            stringValue: ""
	        }, _this._propsToState(_this.props));

	        _this.stop = _this.stop.bind(_this);
	        _this.onTouchEnd = _this.onTouchEnd.bind(_this);
	        return _this;
	    }

	    _createClass(NumericInput, [{
	        key: '_propsToState',
	        value: function _propsToState(props) {
	            var out = {};

	            if (props.hasOwnProperty("value")) {
	                out.stringValue = String(props.value || props.value === 0 ? props.value : '').trim();

	                out.value = out.stringValue !== '' ? this._parse(props.value) : null;
	            } else if (!this._isMounted && props.hasOwnProperty("defaultValue")) {
	                out.stringValue = String(props.defaultValue || props.defaultValue === 0 ? props.defaultValue : '').trim();

	                out.value = props.defaultValue !== '' ? this._parse(props.defaultValue) : null;
	            }

	            return out;
	        }
	    }, {
	        key: 'componentWillReceiveProps',
	        value: function componentWillReceiveProps(props) {
	            var _this2 = this;

	            this._isStrict = !!props.strict;
	            var nextState = this._propsToState(props);
	            if (Object.keys(nextState).length) {
	                this._ignoreValueChange = true;
	                this.setState(nextState, function () {
	                    _this2._ignoreValueChange = false;
	                });
	            }
	        }
	    }, {
	        key: 'componentWillUpdate',
	        value: function componentWillUpdate() {
	            this.saveSelection();
	        }
	    }, {
	        key: 'componentDidUpdate',
	        value: function componentDidUpdate(prevProps, prevState) {
	            if (!this._ignoreValueChange && prevState.value !== this.state.value && (!isNaN(this.state.value) || this.state.value === null)) {
	                    this._invokeEventCallback("onChange", this.state.value, this.refs.input.value, this.refs.input);
	                }

	            if (this.state.inputFocus) {
	                this.refs.input.focus();

	                if (this.state.selectionStart || this.state.selectionStart === 0) {
	                    this.refs.input.selectionStart = this.state.selectionStart;
	                }

	                if (this.state.selectionEnd || this.state.selectionEnd === 0) {
	                    this.refs.input.selectionEnd = this.state.selectionEnd;
	                }
	            }

	            this.checkValidity();
	        }
	    }, {
	        key: 'componentWillUnmount',
	        value: function componentWillUnmount() {
	            this._isMounted = false;
	            this.stop();
	        }
	    }, {
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            var _this3 = this;

	            this._isMounted = true;
	            this.refs.input.getValueAsNumber = function () {
	                return _this3.state.value || 0;
	            };

	            this.refs.input.setValue = function (value) {
	                _this3.setState({
	                    value: _this3._parse(value),
	                    stringValue: value
	                });
	            };

	            if (!this.state.inputFocus && IS_BROWSER && document.activeElement === this.refs.input) {
	                this.state.inputFocus = true;
	                this.refs.input.focus();
	                this._invokeEventCallback("onFocus", {
	                    target: this.refs.input,
	                    type: "focus"
	                });
	            }

	            this.checkValidity();
	        }
	    }, {
	        key: 'saveSelection',
	        value: function saveSelection() {
	            this.state.selectionStart = this.refs.input.selectionStart;
	            this.state.selectionEnd = this.refs.input.selectionEnd;
	        }
	    }, {
	        key: 'checkValidity',
	        value: function checkValidity() {
	            var valid = void 0,
	                validationError = "";

	            var supportsValidation = !!this.refs.input.checkValidity;

	            var noValidate = !!(this.props.noValidate && this.props.noValidate != "false");

	            this.refs.input.noValidate = noValidate;

	            valid = noValidate || !supportsValidation;

	            if (valid) {
	                validationError = "";
	            } else {
	                if (this.refs.input.pattern === "") {
	                    this.refs.input.pattern = this.props.required ? ".+" : ".*";
	                }

	                if (supportsValidation) {
	                    this.refs.input.checkValidity();
	                    valid = this.refs.input.validity.valid;

	                    if (!valid) {
	                        validationError = this.refs.input.validationMessage;
	                    }
	                }

	                if (valid && supportsValidation && this.props.maxLength) {
	                    if (this.refs.input.value.length > this.props.maxLength) {
	                        validationError = "This value is too long";
	                    }
	                }
	            }

	            validationError = validationError || (valid ? "" : this.refs.input.validationMessage || "Unknown Error");

	            var validStateChanged = this._valid !== validationError;
	            this._valid = validationError;
	            if (validationError) {
	                addClass(this.refs.wrapper, "has-error");
	                if (validStateChanged) {
	                    this._invokeEventCallback("onInvalid", validationError, this.state.value, this.refs.input.value);
	                }
	            } else {
	                removeClass(this.refs.wrapper, "has-error");
	                if (validStateChanged) {
	                    this._invokeEventCallback("onValid", this.state.value, this.refs.input.value);
	                }
	            }
	        }
	    }, {
	        key: '_toNumber',
	        value: function _toNumber(x) {
	            var n = parseFloat(x);
	            if (isNaN(n) || !isFinite(n)) {
	                n = 0;
	            }

	            if (this._isStrict) {
	                var precision = access(this.props, "precision", null, this);
	                var q = Math.pow(10, precision === null ? 10 : precision);
	                var _min = +access(this.props, "min", NumericInput.defaultProps.min, this);
	                var _max = +access(this.props, "max", NumericInput.defaultProps.max, this);
	                n = Math.min(Math.max(n, _min), _max);
	                n = Math.round(n * q) / q;
	            }

	            return n;
	        }
	    }, {
	        key: '_parse',
	        value: function _parse(x) {
	            x = String(x);
	            if (typeof this.props.parse == 'function') {
	                return parseFloat(this.props.parse(x));
	            }
	            return parseFloat(x);
	        }
	    }, {
	        key: '_format',
	        value: function _format(n) {
	            var _n = this._toNumber(n);
	            var precision = access(this.props, "precision", null, this);
	            if (precision !== null) {
	                _n = n.toFixed(precision);
	            }

	            _n += "";

	            if (this.props.format) {
	                return this.props.format(_n);
	            }

	            return _n;
	        }
	    }, {
	        key: '_step',
	        value: function _step(n, callback) {
	            var _isStrict = this._isStrict;
	            this._isStrict = true;

	            var _step = +access(this.props, "step", NumericInput.defaultProps.step, this, n > 0 ? NumericInput.DIRECTION_UP : NumericInput.DIRECTION_DOWN);

	            var _n = this._toNumber((this.state.value || 0) + _step * n);

	            if (this.props.snap) {
	                _n = Math.round(_n / _step) * _step;
	            }

	            this._isStrict = _isStrict;

	            if (_n !== this.state.value) {
	                this.setState({ value: _n, stringValue: _n + "" }, callback);
	                return true;
	            }

	            return false;
	        }
	    }, {
	        key: '_onKeyDown',
	        value: function _onKeyDown() {
	            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	                args[_key3] = arguments[_key3];
	            }

	            args[0].persist();
	            this._invokeEventCallback.apply(this, ["onKeyDown"].concat(args));
	            var e = args[0];
	            if (!e.isDefaultPrevented()) {
	                if (e.keyCode === KEYCODE_UP) {
	                    e.preventDefault();
	                    this._step(e.ctrlKey || e.metaKey ? 0.1 : e.shiftKey ? 10 : 1);
	                } else if (e.keyCode === KEYCODE_DOWN) {
	                    e.preventDefault();
	                    this._step(e.ctrlKey || e.metaKey ? -0.1 : e.shiftKey ? -10 : -1);
	                } else {
	                    var _value = this.refs.input.value,
	                        length = _value.length;
	                    if (e.keyCode === 8) {
	                        if (this.refs.input.selectionStart == this.refs.input.selectionEnd && this.refs.input.selectionEnd > 0 && _value.length && _value.charAt(this.refs.input.selectionEnd - 1) === ".") {
	                            e.preventDefault();
	                            this.refs.input.selectionStart = this.refs.input.selectionEnd = this.refs.input.selectionEnd - 1;
	                        }
	                    } else if (e.keyCode === 46) {
	                        if (this.refs.input.selectionStart == this.refs.input.selectionEnd && this.refs.input.selectionEnd < length + 1 && _value.length && _value.charAt(this.refs.input.selectionEnd) === ".") {
	                            e.preventDefault();
	                            this.refs.input.selectionStart = this.refs.input.selectionEnd = this.refs.input.selectionEnd + 1;
	                        }
	                    }
	                }
	            }
	        }
	    }, {
	        key: 'stop',
	        value: function stop() {
	            if (this._timer) {
	                clearTimeout(this._timer);
	            }
	        }
	    }, {
	        key: 'increase',
	        value: function increase() {
	            var _this4 = this;

	            var _recursive = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

	            var callback = arguments[1];

	            this.stop();
	            this._step(1, callback);
	            var _max = +access(this.props, "max", NumericInput.defaultProps.max, this);
	            if (isNaN(this.state.value) || +this.state.value < _max) {
	                this._timer = setTimeout(function () {
	                    _this4.increase(true);
	                }, _recursive ? NumericInput.SPEED : NumericInput.DELAY);
	            }
	        }
	    }, {
	        key: 'decrease',
	        value: function decrease() {
	            var _this5 = this;

	            var _recursive = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

	            var callback = arguments[1];

	            this.stop();
	            this._step(-1, callback);
	            var _min = +access(this.props, "min", NumericInput.defaultProps.min, this);
	            if (isNaN(this.state.value) || +this.state.value > _min) {
	                this._timer = setTimeout(function () {
	                    _this5.decrease(true);
	                }, _recursive ? NumericInput.SPEED : NumericInput.DELAY);
	            }
	        }
	    }, {
	        key: 'onMouseDown',
	        value: function onMouseDown(dir, callback) {
	            if (dir == 'down') {
	                this.decrease(false, callback);
	            } else if (dir == 'up') {
	                this.increase(false, callback);
	            }
	        }
	    }, {
	        key: 'onTouchStart',
	        value: function onTouchStart(dir, e) {
	            e.preventDefault();
	            if (dir == 'down') {
	                this.decrease();
	            } else if (dir == 'up') {
	                this.increase();
	            }
	        }
	    }, {
	        key: 'onTouchEnd',
	        value: function onTouchEnd(e) {
	            e.preventDefault();
	            this.stop();
	        }
	    }, {
	        key: '_invokeEventCallback',
	        value: function _invokeEventCallback(callbackName) {
	            if (typeof this.props[callbackName] == "function") {
	                var _props$callbackName;

	                for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
	                    args[_key4 - 1] = arguments[_key4];
	                }

	                (_props$callbackName = this.props[callbackName]).call.apply(_props$callbackName, [null].concat(args));
	            }
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this6 = this;

	            var props = this.props;
	            var state = this.state;
	            var css = {};

	            var _props = this.props,
	                step = _props.step,
	                min = _props.min,
	                max = _props.max,
	                precision = _props.precision,
	                parse = _props.parse,
	                format = _props.format,
	                mobile = _props.mobile,
	                snap = _props.snap,
	                value = _props.value,
	                type = _props.type,
	                style = _props.style,
	                defaultValue = _props.defaultValue,
	                onInvalid = _props.onInvalid,
	                onValid = _props.onValid,
	                strict = _props.strict,
	                rest = _objectWithoutProperties(_props, ['step', 'min', 'max', 'precision', 'parse', 'format', 'mobile', 'snap', 'value', 'type', 'style', 'defaultValue', 'onInvalid', 'onValid', 'strict']);

	            for (var x in NumericInput.style) {
	                css[x] = _extends({}, NumericInput.style[x], style ? style[x] || {} : {});
	            }

	            var hasFormControl = props.className && /\bform-control\b/.test(props.className);

	            if (mobile == 'auto') {
	                mobile = IS_BROWSER && 'ontouchstart' in document;
	            }

	            if (typeof mobile == "function") {
	                mobile = mobile.call(this);
	            }
	            mobile = !!mobile;

	            var attrs = {
	                wrap: {
	                    style: style === false ? null : css.wrap,
	                    className: 'react-numeric-input',
	                    ref: 'wrapper',
	                    onMouseUp: undefined,
	                    onMouseLeave: undefined
	                },
	                input: _extends({
	                    ref: 'input',
	                    type: 'text',
	                    style: style === false ? null : _extends({}, css.input, !hasFormControl ? css['input:not(.form-control)'] : {}, state.inputFocus ? css['input:focus'] : {})
	                }, rest),
	                btnUp: {
	                    onMouseEnter: undefined,
	                    onMouseDown: undefined,
	                    onMouseUp: undefined,
	                    onMouseLeave: undefined,
	                    onTouchStart: undefined,
	                    onTouchEnd: undefined,
	                    style: style === false ? null : _extends({}, css.btn, css.btnUp, props.disabled ? css['btn:disabled'] : state.btnUpActive ? css['btn:active'] : state.btnUpHover ? css['btn:hover'] : {})
	                },
	                btnDown: {
	                    onMouseEnter: undefined,
	                    onMouseDown: undefined,
	                    onMouseUp: undefined,
	                    onMouseLeave: undefined,
	                    onTouchStart: undefined,
	                    onTouchEnd: undefined,
	                    style: style === false ? null : _extends({}, css.btn, css.btnDown, props.disabled ? css['btn:disabled'] : state.btnDownActive ? css['btn:active'] : state.btnDownHover ? css['btn:hover'] : {})
	                }
	            };

	            var stringValue = String(state.stringValue || (state.value || state.value === 0 ? state.value : "") || "");

	            if (RE_INCOMPLETE_NUMBER.test(stringValue)) {
	                attrs.input.value = stringValue;
	            } else if (!this._isStrict && stringValue && !RE_NUMBER.test(stringValue)) {
	                    attrs.input.value = stringValue;
	                } else if (state.value || state.value === 0) {
	                        attrs.input.value = this._format(state.value);
	                    } else {
	                            attrs.input.value = "";
	                        }

	            if (hasFormControl && style !== false) {
	                _extends(attrs.wrap.style, css['wrap.hasFormControl']);
	            }

	            if (mobile && style !== false) {
	                _extends(attrs.input.style, css['input.mobile']);
	                _extends(attrs.btnUp.style, css['btnUp.mobile']);
	                _extends(attrs.btnDown.style, css['btnDown.mobile']);
	            }

	            if (!props.disabled) {
	                _extends(attrs.wrap, {
	                    onMouseUp: this.stop,
	                    onMouseLeave: this.stop
	                });

	                _extends(attrs.btnUp, {
	                    onTouchStart: this.onTouchStart.bind(this, 'up'),
	                    onTouchEnd: this.onTouchEnd,
	                    onMouseEnter: function onMouseEnter() {
	                        _this6.setState({
	                            btnUpHover: true
	                        });
	                    },
	                    onMouseLeave: function onMouseLeave() {
	                        _this6.stop();
	                        _this6.setState({
	                            btnUpHover: false,
	                            btnUpActive: false
	                        });
	                    },
	                    onMouseUp: function onMouseUp() {
	                        _this6.setState({
	                            btnUpHover: true,
	                            btnUpActive: false
	                        });
	                    },
	                    onMouseDown: function onMouseDown() {
	                        for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
	                            args[_key5] = arguments[_key5];
	                        }

	                        args[0].preventDefault();
	                        args[0].persist();
	                        _this6.setState({
	                            btnUpHover: true,
	                            btnUpActive: true,
	                            inputFocus: true
	                        }, function () {
	                            _this6._invokeEventCallback.apply(_this6, ["onFocus"].concat(args));
	                            _this6.onMouseDown('up');
	                        });
	                    }
	                });

	                _extends(attrs.btnDown, {
	                    onTouchStart: this.onTouchStart.bind(this, 'down'),
	                    onTouchEnd: this.onTouchEnd,
	                    onMouseEnter: function onMouseEnter() {
	                        _this6.setState({
	                            btnDownHover: true
	                        });
	                    },
	                    onMouseLeave: function onMouseLeave() {
	                        _this6.stop();
	                        _this6.setState({
	                            btnDownHover: false,
	                            btnDownActive: false
	                        });
	                    },
	                    onMouseUp: function onMouseUp() {
	                        _this6.setState({
	                            btnDownHover: true,
	                            btnDownActive: false
	                        });
	                    },
	                    onMouseDown: function onMouseDown() {
	                        for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
	                            args[_key6] = arguments[_key6];
	                        }

	                        args[0].preventDefault();
	                        args[0].persist();
	                        _this6.setState({
	                            btnDownHover: true,
	                            btnDownActive: true,
	                            inputFocus: true
	                        }, function () {
	                            _this6._invokeEventCallback.apply(_this6, ["onFocus"].concat(args));
	                            _this6.onMouseDown('down');
	                        });
	                    }
	                });

	                _extends(attrs.input, {
	                    onChange: function onChange(e) {
	                        var original = e.target.value;
	                        var val = _this6._parse(original);
	                        if (isNaN(val)) {
	                            val = null;
	                        }
	                        _this6.setState({
	                            value: _this6._isStrict ? _this6._toNumber(val) : val,
	                            stringValue: original
	                        });
	                    },
	                    onKeyDown: this._onKeyDown.bind(this),
	                    onInput: function onInput() {
	                        for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
	                            args[_key7] = arguments[_key7];
	                        }

	                        _this6.saveSelection();
	                        _this6._invokeEventCallback.apply(_this6, ["onInput"].concat(args));
	                    },
	                    onSelect: function onSelect() {
	                        for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
	                            args[_key8] = arguments[_key8];
	                        }

	                        _this6.saveSelection();
	                        _this6._invokeEventCallback.apply(_this6, ["onSelect"].concat(args));
	                    },
	                    onFocus: function onFocus() {
	                        for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
	                            args[_key9] = arguments[_key9];
	                        }

	                        args[0].persist();
	                        _this6.setState({ inputFocus: true }, function () {
	                            var val = _this6._parse(args[0].target.value);
	                            _this6.setState({
	                                value: val,
	                                stringValue: val || val === 0 ? val + "" : ""
	                            }, function () {
	                                _this6._invokeEventCallback.apply(_this6, ["onFocus"].concat(args));
	                            });
	                        });
	                    },
	                    onBlur: function onBlur() {
	                        for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
	                            args[_key10] = arguments[_key10];
	                        }

	                        var _isStrict = _this6._isStrict;
	                        _this6._isStrict = true;
	                        args[0].persist();
	                        _this6.setState({ inputFocus: false }, function () {
	                            var val = _this6._parse(args[0].target.value);
	                            _this6.setState({
	                                value: val
	                            }, function () {
	                                _this6._invokeEventCallback.apply(_this6, ["onBlur"].concat(args));
	                                _this6._isStrict = _isStrict;
	                            });
	                        });
	                    }
	                });
	            } else {
	                if (style !== false) {
	                    _extends(attrs.input.style, css['input:disabled']);
	                }
	            }

	            if (mobile) {
	                return _react2.default.createElement(
	                    'span',
	                    attrs.wrap,
	                    _react2.default.createElement('input', attrs.input),
	                    _react2.default.createElement(
	                        'b',
	                        attrs.btnUp,
	                        _react2.default.createElement('i', { style: style === false ? null : css.minus }),
	                        _react2.default.createElement('i', { style: style === false ? null : css.plus })
	                    ),
	                    _react2.default.createElement(
	                        'b',
	                        attrs.btnDown,
	                        _react2.default.createElement('i', { style: style === false ? null : css.minus })
	                    )
	                );
	            }

	            return _react2.default.createElement(
	                'span',
	                attrs.wrap,
	                _react2.default.createElement('input', attrs.input),
	                _react2.default.createElement(
	                    'b',
	                    attrs.btnUp,
	                    _react2.default.createElement('i', { style: style === false ? null : css.arrowUp })
	                ),
	                _react2.default.createElement(
	                    'b',
	                    attrs.btnDown,
	                    _react2.default.createElement('i', { style: style === false ? null : css.arrowDown })
	                )
	            );
	        }
	    }]);

	    return NumericInput;
	}(_react.Component);

	NumericInput.propTypes = {
	    step: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.func]),
	    min: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.func]),
	    max: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.func]),
	    precision: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.func]),
	    maxLength: _propTypes2.default.number,
	    parse: _propTypes2.default.func,
	    format: _propTypes2.default.func,
	    className: _propTypes2.default.string,
	    disabled: _propTypes2.default.bool,
	    readOnly: _propTypes2.default.bool,
	    required: _propTypes2.default.bool,
	    snap: _propTypes2.default.bool,
	    noValidate: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.string]),
	    style: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.bool]),
	    type: _propTypes2.default.string,
	    pattern: _propTypes2.default.string,
	    onFocus: _propTypes2.default.func,
	    onBlur: _propTypes2.default.func,
	    onKeyDown: _propTypes2.default.func,
	    onChange: _propTypes2.default.func,
	    onInvalid: _propTypes2.default.func,
	    onValid: _propTypes2.default.func,
	    onInput: _propTypes2.default.func,
	    onSelect: _propTypes2.default.func,
	    size: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
	    value: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
	    defaultValue: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
	    strict: _propTypes2.default.bool,
	    mobile: function mobile(props, propName) {
	        var prop = props[propName];
	        if (prop !== true && prop !== false && prop !== 'auto' && typeof prop != 'function') {
	            return new Error('The "mobile" prop must be true, false, "auto" or a function');
	        }
	    }
	};
	NumericInput.defaultProps = {
	    step: 1,
	    min: Number.MIN_SAFE_INTEGER || -9007199254740991,
	    max: Number.MAX_SAFE_INTEGER || 9007199254740991,
	    precision: null,
	    parse: null,
	    format: null,
	    mobile: 'auto',
	    strict: false,
	    style: {}
	};
	NumericInput.style = {
	    wrap: {
	        position: 'relative',
	        display: 'inline-block'
	    },

	    'wrap.hasFormControl': {
	        display: 'block'
	    },

	    arrowUp: {
	        position: 'absolute',
	        top: '50%',
	        left: '50%',
	        width: 0,
	        height: 0,
	        borderWidth: '0 0.6ex 0.6ex 0.6ex',
	        borderColor: 'transparent transparent rgba(0, 0, 0, 0.7)',
	        borderStyle: 'solid',
	        margin: '-0.3ex 0 0 -0.56ex'
	    },

	    arrowDown: {
	        position: 'absolute',
	        top: '50%',
	        left: '50%',
	        width: 0,
	        height: 0,
	        borderWidth: '0.6ex 0.6ex 0 0.6ex',
	        borderColor: 'rgba(0, 0, 0, 0.7) transparent transparent',
	        borderStyle: 'solid',
	        margin: '-0.3ex 0 0 -0.56ex'
	    },

	    plus: {
	        position: 'absolute',
	        top: '50%',
	        left: '50%',
	        width: 2,
	        height: 10,
	        background: 'rgba(0,0,0,.7)',
	        margin: '-5px 0 0 -1px'
	    },

	    minus: {
	        position: 'absolute',
	        top: '50%',
	        left: '50%',
	        width: 10,
	        height: 2,
	        background: 'rgba(0,0,0,.7)',
	        margin: '-1px 0 0 -5px'
	    },

	    btn: {
	        position: 'absolute',
	        right: 2,
	        width: '2.26ex',
	        borderColor: 'rgba(0,0,0,.1)',
	        borderStyle: 'solid',
	        textAlign: 'center',
	        cursor: 'default',
	        transition: 'all 0.1s',
	        background: 'rgba(0,0,0,.1)',
	        boxShadow: '-1px -1px 3px rgba(0,0,0,.1) inset,' + '1px 1px 3px rgba(255,255,255,.7) inset'
	    },

	    btnUp: {
	        top: 2,
	        bottom: '50%',
	        borderRadius: '2px 2px 0 0',
	        borderWidth: '1px 1px 0 1px'
	    },

	    'btnUp.mobile': {
	        width: '3.3ex',
	        bottom: 2,
	        boxShadow: 'none',
	        borderRadius: 2,
	        borderWidth: 1
	    },

	    btnDown: {
	        top: '50%',
	        bottom: 2,
	        borderRadius: '0 0 2px 2px',
	        borderWidth: '0 1px 1px 1px'
	    },

	    'btnDown.mobile': {
	        width: '3.3ex',
	        bottom: 2,
	        left: 2,
	        top: 2,
	        right: 'auto',
	        boxShadow: 'none',
	        borderRadius: 2,
	        borderWidth: 1
	    },

	    'btn:hover': {
	        background: 'rgba(0,0,0,.2)'
	    },

	    'btn:active': {
	        background: 'rgba(0,0,0,.3)',
	        boxShadow: '0 1px 3px rgba(0,0,0,.2) inset,' + '-1px -1px 4px rgba(255,255,255,.5) inset'
	    },

	    'btn:disabled': {
	        opacity: 0.5,
	        boxShadow: 'none',
	        cursor: 'not-allowed'
	    },

	    input: {
	        paddingRight: '3ex',
	        boxSizing: 'border-box'
	    },

	    'input:not(.form-control)': {
	        border: '1px solid #ccc',
	        borderRadius: 2,
	        paddingLeft: 4,
	        display: 'block',
	        WebkitAppearance: 'none',
	        lineHeight: 'normal'
	    },

	    'input.mobile': {
	        paddingLeft: ' 3.4ex',
	        paddingRight: '3.4ex',
	        textAlign: 'center'
	    },

	    'input:focus': {},

	    'input:disabled': {
	        color: 'rgba(0, 0, 0, 0.3)',
	        textShadow: '0 1px 0 rgba(255, 255, 255, 0.8)'
	    }
	};
	NumericInput.SPEED = 50;
	NumericInput.DELAY = 500;
	NumericInput.DIRECTION_UP = "up";
	NumericInput.DIRECTION_DOWN = "down";


	module.exports = NumericInput;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = require("react");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = require("prop-types");

/***/ })
/******/ ]);
},{"prop-types":12,"react":39}],15:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

/**
 * Escape and wrap key so it is safe to use as a reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */

function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = ('' + key).replace(escapeRegex, function (match) {
    return escaperLookup[match];
  });

  return '$' + escapedString;
}

/**
 * Unescape and unwrap key for human-readable display
 *
 * @param {string} key to unescape.
 * @return {string} the unescaped key.
 */
function unescape(key) {
  var unescapeRegex = /(=0|=2)/g;
  var unescaperLookup = {
    '=0': '=',
    '=2': ':'
  };
  var keySubstring = key[0] === '.' && key[1] === '$' ? key.substring(2) : key.substring(1);

  return ('' + keySubstring).replace(unescapeRegex, function (match) {
    return unescaperLookup[match];
  });
}

var KeyEscapeUtils = {
  escape: escape,
  unescape: unescape
};

module.exports = KeyEscapeUtils;
},{}],16:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var invariant = require('fbjs/lib/invariant');

/**
 * Static poolers. Several custom versions for each potential number of
 * arguments. A completely generic pooler is easy to implement, but would
 * require accessing the `arguments` object. In each of these, `this` refers to
 * the Class itself, not an instance. If any others are needed, simply add them
 * here, or in their own files.
 */
var oneArgumentPooler = function (copyFieldsFrom) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, copyFieldsFrom);
    return instance;
  } else {
    return new Klass(copyFieldsFrom);
  }
};

var twoArgumentPooler = function (a1, a2) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2);
    return instance;
  } else {
    return new Klass(a1, a2);
  }
};

var threeArgumentPooler = function (a1, a2, a3) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3);
    return instance;
  } else {
    return new Klass(a1, a2, a3);
  }
};

var fourArgumentPooler = function (a1, a2, a3, a4) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3, a4);
    return instance;
  } else {
    return new Klass(a1, a2, a3, a4);
  }
};

var standardReleaser = function (instance) {
  var Klass = this;
  !(instance instanceof Klass) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Trying to release an instance into a pool of a different type.') : _prodInvariant('25') : void 0;
  instance.destructor();
  if (Klass.instancePool.length < Klass.poolSize) {
    Klass.instancePool.push(instance);
  }
};

var DEFAULT_POOL_SIZE = 10;
var DEFAULT_POOLER = oneArgumentPooler;

/**
 * Augments `CopyConstructor` to be a poolable class, augmenting only the class
 * itself (statically) not adding any prototypical fields. Any CopyConstructor
 * you give this may have a `poolSize` property, and will look for a
 * prototypical `destructor` on instances.
 *
 * @param {Function} CopyConstructor Constructor that can be used to reset.
 * @param {Function} pooler Customizable pooler.
 */
var addPoolingTo = function (CopyConstructor, pooler) {
  // Casting as any so that flow ignores the actual implementation and trusts
  // it to match the type we declared
  var NewKlass = CopyConstructor;
  NewKlass.instancePool = [];
  NewKlass.getPooled = pooler || DEFAULT_POOLER;
  if (!NewKlass.poolSize) {
    NewKlass.poolSize = DEFAULT_POOL_SIZE;
  }
  NewKlass.release = standardReleaser;
  return NewKlass;
};

var PooledClass = {
  addPoolingTo: addPoolingTo,
  oneArgumentPooler: oneArgumentPooler,
  twoArgumentPooler: twoArgumentPooler,
  threeArgumentPooler: threeArgumentPooler,
  fourArgumentPooler: fourArgumentPooler
};

module.exports = PooledClass;
}).call(this,require('_process'))
},{"./reactProdInvariant":37,"_process":7,"fbjs/lib/invariant":4}],17:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _assign = require('object-assign');

var ReactBaseClasses = require('./ReactBaseClasses');
var ReactChildren = require('./ReactChildren');
var ReactDOMFactories = require('./ReactDOMFactories');
var ReactElement = require('./ReactElement');
var ReactPropTypes = require('./ReactPropTypes');
var ReactVersion = require('./ReactVersion');

var createReactClass = require('./createClass');
var onlyChild = require('./onlyChild');

var createElement = ReactElement.createElement;
var createFactory = ReactElement.createFactory;
var cloneElement = ReactElement.cloneElement;

if (process.env.NODE_ENV !== 'production') {
  var lowPriorityWarning = require('./lowPriorityWarning');
  var canDefineProperty = require('./canDefineProperty');
  var ReactElementValidator = require('./ReactElementValidator');
  var didWarnPropTypesDeprecated = false;
  createElement = ReactElementValidator.createElement;
  createFactory = ReactElementValidator.createFactory;
  cloneElement = ReactElementValidator.cloneElement;
}

var __spread = _assign;
var createMixin = function (mixin) {
  return mixin;
};

if (process.env.NODE_ENV !== 'production') {
  var warnedForSpread = false;
  var warnedForCreateMixin = false;
  __spread = function () {
    lowPriorityWarning(warnedForSpread, 'React.__spread is deprecated and should not be used. Use ' + 'Object.assign directly or another helper function with similar ' + 'semantics. You may be seeing this warning due to your compiler. ' + 'See https://fb.me/react-spread-deprecation for more details.');
    warnedForSpread = true;
    return _assign.apply(null, arguments);
  };

  createMixin = function (mixin) {
    lowPriorityWarning(warnedForCreateMixin, 'React.createMixin is deprecated and should not be used. ' + 'In React v16.0, it will be removed. ' + 'You can use this mixin directly instead. ' + 'See https://fb.me/createmixin-was-never-implemented for more info.');
    warnedForCreateMixin = true;
    return mixin;
  };
}

var React = {
  // Modern

  Children: {
    map: ReactChildren.map,
    forEach: ReactChildren.forEach,
    count: ReactChildren.count,
    toArray: ReactChildren.toArray,
    only: onlyChild
  },

  Component: ReactBaseClasses.Component,
  PureComponent: ReactBaseClasses.PureComponent,

  createElement: createElement,
  cloneElement: cloneElement,
  isValidElement: ReactElement.isValidElement,

  // Classic

  PropTypes: ReactPropTypes,
  createClass: createReactClass,
  createFactory: createFactory,
  createMixin: createMixin,

  // This looks DOM specific but these are actually isomorphic helpers
  // since they are just generating DOM strings.
  DOM: ReactDOMFactories,

  version: ReactVersion,

  // Deprecated hook for JSX spread, don't use this for anything.
  __spread: __spread
};

if (process.env.NODE_ENV !== 'production') {
  var warnedForCreateClass = false;
  if (canDefineProperty) {
    Object.defineProperty(React, 'PropTypes', {
      get: function () {
        lowPriorityWarning(didWarnPropTypesDeprecated, 'Accessing PropTypes via the main React package is deprecated,' + ' and will be removed in  React v16.0.' + ' Use the latest available v15.* prop-types package from npm instead.' + ' For info on usage, compatibility, migration and more, see ' + 'https://fb.me/prop-types-docs');
        didWarnPropTypesDeprecated = true;
        return ReactPropTypes;
      }
    });

    Object.defineProperty(React, 'createClass', {
      get: function () {
        lowPriorityWarning(warnedForCreateClass, 'Accessing createClass via the main React package is deprecated,' + ' and will be removed in React v16.0.' + " Use a plain JavaScript class instead. If you're not yet " + 'ready to migrate, create-react-class v15.* is available ' + 'on npm as a temporary, drop-in replacement. ' + 'For more info see https://fb.me/react-create-class');
        warnedForCreateClass = true;
        return createReactClass;
      }
    });
  }

  // React.DOM factories are deprecated. Wrap these methods so that
  // invocations of the React.DOM namespace and alert users to switch
  // to the `react-dom-factories` package.
  React.DOM = {};
  var warnedForFactories = false;
  Object.keys(ReactDOMFactories).forEach(function (factory) {
    React.DOM[factory] = function () {
      if (!warnedForFactories) {
        lowPriorityWarning(false, 'Accessing factories like React.DOM.%s has been deprecated ' + 'and will be removed in v16.0+. Use the ' + 'react-dom-factories package instead. ' + ' Version 1.0 provides a drop-in replacement.' + ' For more info, see https://fb.me/react-dom-factories', factory);
        warnedForFactories = true;
      }
      return ReactDOMFactories[factory].apply(ReactDOMFactories, arguments);
    };
  });
}

module.exports = React;
}).call(this,require('_process'))
},{"./ReactBaseClasses":18,"./ReactChildren":19,"./ReactDOMFactories":22,"./ReactElement":23,"./ReactElementValidator":25,"./ReactPropTypes":28,"./ReactVersion":30,"./canDefineProperty":31,"./createClass":33,"./lowPriorityWarning":35,"./onlyChild":36,"_process":7,"object-assign":6}],18:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant'),
    _assign = require('object-assign');

var ReactNoopUpdateQueue = require('./ReactNoopUpdateQueue');

var canDefineProperty = require('./canDefineProperty');
var emptyObject = require('fbjs/lib/emptyObject');
var invariant = require('fbjs/lib/invariant');
var lowPriorityWarning = require('./lowPriorityWarning');

/**
 * Base class helpers for the updating state of a component.
 */
function ReactComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

ReactComponent.prototype.isReactComponent = {};

/**
 * Sets a subset of the state. Always use this to mutate
 * state. You should treat `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously). It will be called with the up to date
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned to this.
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */
ReactComponent.prototype.setState = function (partialState, callback) {
  !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : _prodInvariant('85') : void 0;
  this.updater.enqueueSetState(this, partialState);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState');
  }
};

/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */
ReactComponent.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'forceUpdate');
  }
};

/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 */
if (process.env.NODE_ENV !== 'production') {
  var deprecatedAPIs = {
    isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
    replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
  };
  var defineDeprecationWarning = function (methodName, info) {
    if (canDefineProperty) {
      Object.defineProperty(ReactComponent.prototype, methodName, {
        get: function () {
          lowPriorityWarning(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);
          return undefined;
        }
      });
    }
  };
  for (var fnName in deprecatedAPIs) {
    if (deprecatedAPIs.hasOwnProperty(fnName)) {
      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    }
  }
}

/**
 * Base class helpers for the updating state of a component.
 */
function ReactPureComponent(props, context, updater) {
  // Duplicated from ReactComponent.
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

function ComponentDummy() {}
ComponentDummy.prototype = ReactComponent.prototype;
ReactPureComponent.prototype = new ComponentDummy();
ReactPureComponent.prototype.constructor = ReactPureComponent;
// Avoid an extra prototype jump for these methods.
_assign(ReactPureComponent.prototype, ReactComponent.prototype);
ReactPureComponent.prototype.isPureReactComponent = true;

module.exports = {
  Component: ReactComponent,
  PureComponent: ReactPureComponent
};
}).call(this,require('_process'))
},{"./ReactNoopUpdateQueue":26,"./canDefineProperty":31,"./lowPriorityWarning":35,"./reactProdInvariant":37,"_process":7,"fbjs/lib/emptyObject":3,"fbjs/lib/invariant":4,"object-assign":6}],19:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var PooledClass = require('./PooledClass');
var ReactElement = require('./ReactElement');

var emptyFunction = require('fbjs/lib/emptyFunction');
var traverseAllChildren = require('./traverseAllChildren');

var twoArgumentPooler = PooledClass.twoArgumentPooler;
var fourArgumentPooler = PooledClass.fourArgumentPooler;

var userProvidedKeyEscapeRegex = /\/+/g;
function escapeUserProvidedKey(text) {
  return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
}

/**
 * PooledClass representing the bookkeeping associated with performing a child
 * traversal. Allows avoiding binding callbacks.
 *
 * @constructor ForEachBookKeeping
 * @param {!function} forEachFunction Function to perform traversal with.
 * @param {?*} forEachContext Context to perform context with.
 */
function ForEachBookKeeping(forEachFunction, forEachContext) {
  this.func = forEachFunction;
  this.context = forEachContext;
  this.count = 0;
}
ForEachBookKeeping.prototype.destructor = function () {
  this.func = null;
  this.context = null;
  this.count = 0;
};
PooledClass.addPoolingTo(ForEachBookKeeping, twoArgumentPooler);

function forEachSingleChild(bookKeeping, child, name) {
  var func = bookKeeping.func,
      context = bookKeeping.context;

  func.call(context, child, bookKeeping.count++);
}

/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.foreach
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }
  var traverseContext = ForEachBookKeeping.getPooled(forEachFunc, forEachContext);
  traverseAllChildren(children, forEachSingleChild, traverseContext);
  ForEachBookKeeping.release(traverseContext);
}

/**
 * PooledClass representing the bookkeeping associated with performing a child
 * mapping. Allows avoiding binding callbacks.
 *
 * @constructor MapBookKeeping
 * @param {!*} mapResult Object containing the ordered map of results.
 * @param {!function} mapFunction Function to perform mapping with.
 * @param {?*} mapContext Context to perform mapping with.
 */
function MapBookKeeping(mapResult, keyPrefix, mapFunction, mapContext) {
  this.result = mapResult;
  this.keyPrefix = keyPrefix;
  this.func = mapFunction;
  this.context = mapContext;
  this.count = 0;
}
MapBookKeeping.prototype.destructor = function () {
  this.result = null;
  this.keyPrefix = null;
  this.func = null;
  this.context = null;
  this.count = 0;
};
PooledClass.addPoolingTo(MapBookKeeping, fourArgumentPooler);

function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  var result = bookKeeping.result,
      keyPrefix = bookKeeping.keyPrefix,
      func = bookKeeping.func,
      context = bookKeeping.context;


  var mappedChild = func.call(context, child, bookKeeping.count++);
  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, emptyFunction.thatReturnsArgument);
  } else if (mappedChild != null) {
    if (ReactElement.isValidElement(mappedChild)) {
      mappedChild = ReactElement.cloneAndReplaceKey(mappedChild,
      // Keep both the (mapped) and old keys if they differ, just as
      // traverseAllChildren used to do for objects as children
      keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
    }
    result.push(mappedChild);
  }
}

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  var escapedPrefix = '';
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  var traverseContext = MapBookKeeping.getPooled(array, escapedPrefix, func, context);
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  MapBookKeeping.release(traverseContext);
}

/**
 * Maps children that are typically specified as `props.children`.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.map
 *
 * The provided mapFunction(child, key, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}

function forEachSingleChildDummy(traverseContext, child, name) {
  return null;
}

/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.count
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */
function countChildren(children, context) {
  return traverseAllChildren(children, forEachSingleChildDummy, null);
}

/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.toarray
 */
function toArray(children) {
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, emptyFunction.thatReturnsArgument);
  return result;
}

var ReactChildren = {
  forEach: forEachChildren,
  map: mapChildren,
  mapIntoWithKeyPrefixInternal: mapIntoWithKeyPrefixInternal,
  count: countChildren,
  toArray: toArray
};

module.exports = ReactChildren;
},{"./PooledClass":16,"./ReactElement":23,"./traverseAllChildren":38,"fbjs/lib/emptyFunction":2}],20:[function(require,module,exports){
(function (process){
/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactCurrentOwner = require('./ReactCurrentOwner');

var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

function isNative(fn) {
  // Based on isNative() from Lodash
  var funcToString = Function.prototype.toString;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var reIsNative = RegExp('^' + funcToString
  // Take an example native function source for comparison
  .call(hasOwnProperty
  // Strip regex characters so we can use it for regex
  ).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&'
  // Remove hasOwnProperty from the template to make it generic
  ).replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
  try {
    var source = funcToString.call(fn);
    return reIsNative.test(source);
  } catch (err) {
    return false;
  }
}

var canUseCollections =
// Array.from
typeof Array.from === 'function' &&
// Map
typeof Map === 'function' && isNative(Map) &&
// Map.prototype.keys
Map.prototype != null && typeof Map.prototype.keys === 'function' && isNative(Map.prototype.keys) &&
// Set
typeof Set === 'function' && isNative(Set) &&
// Set.prototype.keys
Set.prototype != null && typeof Set.prototype.keys === 'function' && isNative(Set.prototype.keys);

var setItem;
var getItem;
var removeItem;
var getItemIDs;
var addRoot;
var removeRoot;
var getRootIDs;

if (canUseCollections) {
  var itemMap = new Map();
  var rootIDSet = new Set();

  setItem = function (id, item) {
    itemMap.set(id, item);
  };
  getItem = function (id) {
    return itemMap.get(id);
  };
  removeItem = function (id) {
    itemMap['delete'](id);
  };
  getItemIDs = function () {
    return Array.from(itemMap.keys());
  };

  addRoot = function (id) {
    rootIDSet.add(id);
  };
  removeRoot = function (id) {
    rootIDSet['delete'](id);
  };
  getRootIDs = function () {
    return Array.from(rootIDSet.keys());
  };
} else {
  var itemByKey = {};
  var rootByKey = {};

  // Use non-numeric keys to prevent V8 performance issues:
  // https://github.com/facebook/react/pull/7232
  var getKeyFromID = function (id) {
    return '.' + id;
  };
  var getIDFromKey = function (key) {
    return parseInt(key.substr(1), 10);
  };

  setItem = function (id, item) {
    var key = getKeyFromID(id);
    itemByKey[key] = item;
  };
  getItem = function (id) {
    var key = getKeyFromID(id);
    return itemByKey[key];
  };
  removeItem = function (id) {
    var key = getKeyFromID(id);
    delete itemByKey[key];
  };
  getItemIDs = function () {
    return Object.keys(itemByKey).map(getIDFromKey);
  };

  addRoot = function (id) {
    var key = getKeyFromID(id);
    rootByKey[key] = true;
  };
  removeRoot = function (id) {
    var key = getKeyFromID(id);
    delete rootByKey[key];
  };
  getRootIDs = function () {
    return Object.keys(rootByKey).map(getIDFromKey);
  };
}

var unmountedIDs = [];

function purgeDeep(id) {
  var item = getItem(id);
  if (item) {
    var childIDs = item.childIDs;

    removeItem(id);
    childIDs.forEach(purgeDeep);
  }
}

function describeComponentFrame(name, source, ownerName) {
  return '\n    in ' + (name || 'Unknown') + (source ? ' (at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + ')' : ownerName ? ' (created by ' + ownerName + ')' : '');
}

function getDisplayName(element) {
  if (element == null) {
    return '#empty';
  } else if (typeof element === 'string' || typeof element === 'number') {
    return '#text';
  } else if (typeof element.type === 'string') {
    return element.type;
  } else {
    return element.type.displayName || element.type.name || 'Unknown';
  }
}

function describeID(id) {
  var name = ReactComponentTreeHook.getDisplayName(id);
  var element = ReactComponentTreeHook.getElement(id);
  var ownerID = ReactComponentTreeHook.getOwnerID(id);
  var ownerName;
  if (ownerID) {
    ownerName = ReactComponentTreeHook.getDisplayName(ownerID);
  }
  process.env.NODE_ENV !== 'production' ? warning(element, 'ReactComponentTreeHook: Missing React element for debugID %s when ' + 'building stack', id) : void 0;
  return describeComponentFrame(name, element && element._source, ownerName);
}

var ReactComponentTreeHook = {
  onSetChildren: function (id, nextChildIDs) {
    var item = getItem(id);
    !item ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Item must have been set') : _prodInvariant('144') : void 0;
    item.childIDs = nextChildIDs;

    for (var i = 0; i < nextChildIDs.length; i++) {
      var nextChildID = nextChildIDs[i];
      var nextChild = getItem(nextChildID);
      !nextChild ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected hook events to fire for the child before its parent includes it in onSetChildren().') : _prodInvariant('140') : void 0;
      !(nextChild.childIDs != null || typeof nextChild.element !== 'object' || nextChild.element == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onSetChildren() to fire for a container child before its parent includes it in onSetChildren().') : _prodInvariant('141') : void 0;
      !nextChild.isMounted ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onMountComponent() to fire for the child before its parent includes it in onSetChildren().') : _prodInvariant('71') : void 0;
      if (nextChild.parentID == null) {
        nextChild.parentID = id;
        // TODO: This shouldn't be necessary but mounting a new root during in
        // componentWillMount currently causes not-yet-mounted components to
        // be purged from our tree data so their parent id is missing.
      }
      !(nextChild.parentID === id) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onBeforeMountComponent() parent and onSetChildren() to be consistent (%s has parents %s and %s).', nextChildID, nextChild.parentID, id) : _prodInvariant('142', nextChildID, nextChild.parentID, id) : void 0;
    }
  },
  onBeforeMountComponent: function (id, element, parentID) {
    var item = {
      element: element,
      parentID: parentID,
      text: null,
      childIDs: [],
      isMounted: false,
      updateCount: 0
    };
    setItem(id, item);
  },
  onBeforeUpdateComponent: function (id, element) {
    var item = getItem(id);
    if (!item || !item.isMounted) {
      // We may end up here as a result of setState() in componentWillUnmount().
      // In this case, ignore the element.
      return;
    }
    item.element = element;
  },
  onMountComponent: function (id) {
    var item = getItem(id);
    !item ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Item must have been set') : _prodInvariant('144') : void 0;
    item.isMounted = true;
    var isRoot = item.parentID === 0;
    if (isRoot) {
      addRoot(id);
    }
  },
  onUpdateComponent: function (id) {
    var item = getItem(id);
    if (!item || !item.isMounted) {
      // We may end up here as a result of setState() in componentWillUnmount().
      // In this case, ignore the element.
      return;
    }
    item.updateCount++;
  },
  onUnmountComponent: function (id) {
    var item = getItem(id);
    if (item) {
      // We need to check if it exists.
      // `item` might not exist if it is inside an error boundary, and a sibling
      // error boundary child threw while mounting. Then this instance never
      // got a chance to mount, but it still gets an unmounting event during
      // the error boundary cleanup.
      item.isMounted = false;
      var isRoot = item.parentID === 0;
      if (isRoot) {
        removeRoot(id);
      }
    }
    unmountedIDs.push(id);
  },
  purgeUnmountedComponents: function () {
    if (ReactComponentTreeHook._preventPurging) {
      // Should only be used for testing.
      return;
    }

    for (var i = 0; i < unmountedIDs.length; i++) {
      var id = unmountedIDs[i];
      purgeDeep(id);
    }
    unmountedIDs.length = 0;
  },
  isMounted: function (id) {
    var item = getItem(id);
    return item ? item.isMounted : false;
  },
  getCurrentStackAddendum: function (topElement) {
    var info = '';
    if (topElement) {
      var name = getDisplayName(topElement);
      var owner = topElement._owner;
      info += describeComponentFrame(name, topElement._source, owner && owner.getName());
    }

    var currentOwner = ReactCurrentOwner.current;
    var id = currentOwner && currentOwner._debugID;

    info += ReactComponentTreeHook.getStackAddendumByID(id);
    return info;
  },
  getStackAddendumByID: function (id) {
    var info = '';
    while (id) {
      info += describeID(id);
      id = ReactComponentTreeHook.getParentID(id);
    }
    return info;
  },
  getChildIDs: function (id) {
    var item = getItem(id);
    return item ? item.childIDs : [];
  },
  getDisplayName: function (id) {
    var element = ReactComponentTreeHook.getElement(id);
    if (!element) {
      return null;
    }
    return getDisplayName(element);
  },
  getElement: function (id) {
    var item = getItem(id);
    return item ? item.element : null;
  },
  getOwnerID: function (id) {
    var element = ReactComponentTreeHook.getElement(id);
    if (!element || !element._owner) {
      return null;
    }
    return element._owner._debugID;
  },
  getParentID: function (id) {
    var item = getItem(id);
    return item ? item.parentID : null;
  },
  getSource: function (id) {
    var item = getItem(id);
    var element = item ? item.element : null;
    var source = element != null ? element._source : null;
    return source;
  },
  getText: function (id) {
    var element = ReactComponentTreeHook.getElement(id);
    if (typeof element === 'string') {
      return element;
    } else if (typeof element === 'number') {
      return '' + element;
    } else {
      return null;
    }
  },
  getUpdateCount: function (id) {
    var item = getItem(id);
    return item ? item.updateCount : 0;
  },


  getRootIDs: getRootIDs,
  getRegisteredIDs: getItemIDs,

  pushNonStandardWarningStack: function (isCreatingElement, currentSource) {
    if (typeof console.reactStack !== 'function') {
      return;
    }

    var stack = [];
    var currentOwner = ReactCurrentOwner.current;
    var id = currentOwner && currentOwner._debugID;

    try {
      if (isCreatingElement) {
        stack.push({
          name: id ? ReactComponentTreeHook.getDisplayName(id) : null,
          fileName: currentSource ? currentSource.fileName : null,
          lineNumber: currentSource ? currentSource.lineNumber : null
        });
      }

      while (id) {
        var element = ReactComponentTreeHook.getElement(id);
        var parentID = ReactComponentTreeHook.getParentID(id);
        var ownerID = ReactComponentTreeHook.getOwnerID(id);
        var ownerName = ownerID ? ReactComponentTreeHook.getDisplayName(ownerID) : null;
        var source = element && element._source;
        stack.push({
          name: ownerName,
          fileName: source ? source.fileName : null,
          lineNumber: source ? source.lineNumber : null
        });
        id = parentID;
      }
    } catch (err) {
      // Internal state is messed up.
      // Stop building the stack (it's just a nice to have).
    }

    console.reactStack(stack);
  },
  popNonStandardWarningStack: function () {
    if (typeof console.reactStackEnd !== 'function') {
      return;
    }
    console.reactStackEnd();
  }
};

module.exports = ReactComponentTreeHook;
}).call(this,require('_process'))
},{"./ReactCurrentOwner":21,"./reactProdInvariant":37,"_process":7,"fbjs/lib/invariant":4,"fbjs/lib/warning":5}],21:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 */
var ReactCurrentOwner = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};

module.exports = ReactCurrentOwner;
},{}],22:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var ReactElement = require('./ReactElement');

/**
 * Create a factory that creates HTML tag elements.
 *
 * @private
 */
var createDOMFactory = ReactElement.createFactory;
if (process.env.NODE_ENV !== 'production') {
  var ReactElementValidator = require('./ReactElementValidator');
  createDOMFactory = ReactElementValidator.createFactory;
}

/**
 * Creates a mapping from supported HTML tags to `ReactDOMComponent` classes.
 *
 * @public
 */
var ReactDOMFactories = {
  a: createDOMFactory('a'),
  abbr: createDOMFactory('abbr'),
  address: createDOMFactory('address'),
  area: createDOMFactory('area'),
  article: createDOMFactory('article'),
  aside: createDOMFactory('aside'),
  audio: createDOMFactory('audio'),
  b: createDOMFactory('b'),
  base: createDOMFactory('base'),
  bdi: createDOMFactory('bdi'),
  bdo: createDOMFactory('bdo'),
  big: createDOMFactory('big'),
  blockquote: createDOMFactory('blockquote'),
  body: createDOMFactory('body'),
  br: createDOMFactory('br'),
  button: createDOMFactory('button'),
  canvas: createDOMFactory('canvas'),
  caption: createDOMFactory('caption'),
  cite: createDOMFactory('cite'),
  code: createDOMFactory('code'),
  col: createDOMFactory('col'),
  colgroup: createDOMFactory('colgroup'),
  data: createDOMFactory('data'),
  datalist: createDOMFactory('datalist'),
  dd: createDOMFactory('dd'),
  del: createDOMFactory('del'),
  details: createDOMFactory('details'),
  dfn: createDOMFactory('dfn'),
  dialog: createDOMFactory('dialog'),
  div: createDOMFactory('div'),
  dl: createDOMFactory('dl'),
  dt: createDOMFactory('dt'),
  em: createDOMFactory('em'),
  embed: createDOMFactory('embed'),
  fieldset: createDOMFactory('fieldset'),
  figcaption: createDOMFactory('figcaption'),
  figure: createDOMFactory('figure'),
  footer: createDOMFactory('footer'),
  form: createDOMFactory('form'),
  h1: createDOMFactory('h1'),
  h2: createDOMFactory('h2'),
  h3: createDOMFactory('h3'),
  h4: createDOMFactory('h4'),
  h5: createDOMFactory('h5'),
  h6: createDOMFactory('h6'),
  head: createDOMFactory('head'),
  header: createDOMFactory('header'),
  hgroup: createDOMFactory('hgroup'),
  hr: createDOMFactory('hr'),
  html: createDOMFactory('html'),
  i: createDOMFactory('i'),
  iframe: createDOMFactory('iframe'),
  img: createDOMFactory('img'),
  input: createDOMFactory('input'),
  ins: createDOMFactory('ins'),
  kbd: createDOMFactory('kbd'),
  keygen: createDOMFactory('keygen'),
  label: createDOMFactory('label'),
  legend: createDOMFactory('legend'),
  li: createDOMFactory('li'),
  link: createDOMFactory('link'),
  main: createDOMFactory('main'),
  map: createDOMFactory('map'),
  mark: createDOMFactory('mark'),
  menu: createDOMFactory('menu'),
  menuitem: createDOMFactory('menuitem'),
  meta: createDOMFactory('meta'),
  meter: createDOMFactory('meter'),
  nav: createDOMFactory('nav'),
  noscript: createDOMFactory('noscript'),
  object: createDOMFactory('object'),
  ol: createDOMFactory('ol'),
  optgroup: createDOMFactory('optgroup'),
  option: createDOMFactory('option'),
  output: createDOMFactory('output'),
  p: createDOMFactory('p'),
  param: createDOMFactory('param'),
  picture: createDOMFactory('picture'),
  pre: createDOMFactory('pre'),
  progress: createDOMFactory('progress'),
  q: createDOMFactory('q'),
  rp: createDOMFactory('rp'),
  rt: createDOMFactory('rt'),
  ruby: createDOMFactory('ruby'),
  s: createDOMFactory('s'),
  samp: createDOMFactory('samp'),
  script: createDOMFactory('script'),
  section: createDOMFactory('section'),
  select: createDOMFactory('select'),
  small: createDOMFactory('small'),
  source: createDOMFactory('source'),
  span: createDOMFactory('span'),
  strong: createDOMFactory('strong'),
  style: createDOMFactory('style'),
  sub: createDOMFactory('sub'),
  summary: createDOMFactory('summary'),
  sup: createDOMFactory('sup'),
  table: createDOMFactory('table'),
  tbody: createDOMFactory('tbody'),
  td: createDOMFactory('td'),
  textarea: createDOMFactory('textarea'),
  tfoot: createDOMFactory('tfoot'),
  th: createDOMFactory('th'),
  thead: createDOMFactory('thead'),
  time: createDOMFactory('time'),
  title: createDOMFactory('title'),
  tr: createDOMFactory('tr'),
  track: createDOMFactory('track'),
  u: createDOMFactory('u'),
  ul: createDOMFactory('ul'),
  'var': createDOMFactory('var'),
  video: createDOMFactory('video'),
  wbr: createDOMFactory('wbr'),

  // SVG
  circle: createDOMFactory('circle'),
  clipPath: createDOMFactory('clipPath'),
  defs: createDOMFactory('defs'),
  ellipse: createDOMFactory('ellipse'),
  g: createDOMFactory('g'),
  image: createDOMFactory('image'),
  line: createDOMFactory('line'),
  linearGradient: createDOMFactory('linearGradient'),
  mask: createDOMFactory('mask'),
  path: createDOMFactory('path'),
  pattern: createDOMFactory('pattern'),
  polygon: createDOMFactory('polygon'),
  polyline: createDOMFactory('polyline'),
  radialGradient: createDOMFactory('radialGradient'),
  rect: createDOMFactory('rect'),
  stop: createDOMFactory('stop'),
  svg: createDOMFactory('svg'),
  text: createDOMFactory('text'),
  tspan: createDOMFactory('tspan')
};

module.exports = ReactDOMFactories;
}).call(this,require('_process'))
},{"./ReactElement":23,"./ReactElementValidator":25,"_process":7}],23:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _assign = require('object-assign');

var ReactCurrentOwner = require('./ReactCurrentOwner');

var warning = require('fbjs/lib/warning');
var canDefineProperty = require('./canDefineProperty');
var hasOwnProperty = Object.prototype.hasOwnProperty;

var REACT_ELEMENT_TYPE = require('./ReactElementSymbol');

var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};

var specialPropKeyWarningShown, specialPropRefWarningShown;

function hasValidRef(config) {
  if (process.env.NODE_ENV !== 'production') {
    if (hasOwnProperty.call(config, 'ref')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.ref !== undefined;
}

function hasValidKey(config) {
  if (process.env.NODE_ENV !== 'production') {
    if (hasOwnProperty.call(config, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.key !== undefined;
}

function defineKeyPropWarningGetter(props, displayName) {
  var warnAboutAccessingKey = function () {
    if (!specialPropKeyWarningShown) {
      specialPropKeyWarningShown = true;
      process.env.NODE_ENV !== 'production' ? warning(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName) : void 0;
    }
  };
  warnAboutAccessingKey.isReactWarning = true;
  Object.defineProperty(props, 'key', {
    get: warnAboutAccessingKey,
    configurable: true
  });
}

function defineRefPropWarningGetter(props, displayName) {
  var warnAboutAccessingRef = function () {
    if (!specialPropRefWarningShown) {
      specialPropRefWarningShown = true;
      process.env.NODE_ENV !== 'production' ? warning(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName) : void 0;
    }
  };
  warnAboutAccessingRef.isReactWarning = true;
  Object.defineProperty(props, 'ref', {
    get: warnAboutAccessingRef,
    configurable: true
  });
}

/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, no instanceof check
 * will work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} key
 * @param {string|object} ref
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @param {*} owner
 * @param {*} props
 * @internal
 */
var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allow us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner
  };

  if (process.env.NODE_ENV !== 'production') {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {};

    // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.
    if (canDefineProperty) {
      Object.defineProperty(element._store, 'validated', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: false
      });
      // self and source are DEV only properties.
      Object.defineProperty(element, '_self', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: self
      });
      // Two elements created in two different places should be considered
      // equal for testing purposes and therefore we hide it from enumeration.
      Object.defineProperty(element, '_source', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: source
      });
    } else {
      element._store.validated = false;
      element._self = self;
      element._source = source;
    }
    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};

/**
 * Create and return a new ReactElement of the given type.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.createelement
 */
ReactElement.createElement = function (type, config, children) {
  var propName;

  // Reserved names are extracted
  var props = {};

  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    if (process.env.NODE_ENV !== 'production') {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  if (process.env.NODE_ENV !== 'production') {
    if (key || ref) {
      if (typeof props.$$typeof === 'undefined' || props.$$typeof !== REACT_ELEMENT_TYPE) {
        var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
        if (key) {
          defineKeyPropWarningGetter(props, displayName);
        }
        if (ref) {
          defineRefPropWarningGetter(props, displayName);
        }
      }
    }
  }
  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
};

/**
 * Return a function that produces ReactElements of a given type.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.createfactory
 */
ReactElement.createFactory = function (type) {
  var factory = ReactElement.createElement.bind(null, type);
  // Expose the type on the factory and the prototype so that it can be
  // easily accessed on elements. E.g. `<Foo />.type === Foo`.
  // This should not be named `constructor` since this may not be the function
  // that created the element, and it may not even be a constructor.
  // Legacy hook TODO: Warn if this is accessed
  factory.type = type;
  return factory;
};

ReactElement.cloneAndReplaceKey = function (oldElement, newKey) {
  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

  return newElement;
};

/**
 * Clone and return a new ReactElement using element as the starting point.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.cloneelement
 */
ReactElement.cloneElement = function (element, config, children) {
  var propName;

  // Original props are copied
  var props = _assign({}, element.props);

  // Reserved names are extracted
  var key = element.key;
  var ref = element.ref;
  // Self is preserved since the owner is preserved.
  var self = element._self;
  // Source is preserved since cloneElement is unlikely to be targeted by a
  // transpiler, and the original source is probably a better indicator of the
  // true owner.
  var source = element._source;

  // Owner will be preserved, unless ref is overridden
  var owner = element._owner;

  if (config != null) {
    if (hasValidRef(config)) {
      // Silently steal the ref from the parent.
      ref = config.ref;
      owner = ReactCurrentOwner.current;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    // Remaining properties override existing props
    var defaultProps;
    if (element.type && element.type.defaultProps) {
      defaultProps = element.type.defaultProps;
    }
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        if (config[propName] === undefined && defaultProps !== undefined) {
          // Resolve default props
          props[propName] = defaultProps[propName];
        } else {
          props[propName] = config[propName];
        }
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  return ReactElement(element.type, key, ref, self, source, owner, props);
};

/**
 * Verifies the object is a ReactElement.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a valid component.
 * @final
 */
ReactElement.isValidElement = function (object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
};

module.exports = ReactElement;
}).call(this,require('_process'))
},{"./ReactCurrentOwner":21,"./ReactElementSymbol":24,"./canDefineProperty":31,"_process":7,"fbjs/lib/warning":5,"object-assign":6}],24:[function(require,module,exports){
/**
 * Copyright 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

// The Symbol used to tag the ReactElement type. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.

var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.element') || 0xeac7;

module.exports = REACT_ELEMENT_TYPE;
},{}],25:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

/**
 * ReactElementValidator provides a wrapper around a element factory
 * which validates the props passed to the element. This is intended to be
 * used only in DEV and could be replaced by a static type checker for languages
 * that support it.
 */

'use strict';

var ReactCurrentOwner = require('./ReactCurrentOwner');
var ReactComponentTreeHook = require('./ReactComponentTreeHook');
var ReactElement = require('./ReactElement');

var checkReactTypeSpec = require('./checkReactTypeSpec');

var canDefineProperty = require('./canDefineProperty');
var getIteratorFn = require('./getIteratorFn');
var warning = require('fbjs/lib/warning');
var lowPriorityWarning = require('./lowPriorityWarning');

function getDeclarationErrorAddendum() {
  if (ReactCurrentOwner.current) {
    var name = ReactCurrentOwner.current.getName();
    if (name) {
      return ' Check the render method of `' + name + '`.';
    }
  }
  return '';
}

function getSourceInfoErrorAddendum(elementProps) {
  if (elementProps !== null && elementProps !== undefined && elementProps.__source !== undefined) {
    var source = elementProps.__source;
    var fileName = source.fileName.replace(/^.*[\\\/]/, '');
    var lineNumber = source.lineNumber;
    return ' Check your code at ' + fileName + ':' + lineNumber + '.';
  }
  return '';
}

/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */
var ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  var info = getDeclarationErrorAddendum();

  if (!info) {
    var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
    if (parentName) {
      info = ' Check the top-level render call using <' + parentName + '>.';
    }
  }
  return info;
}

/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */
function validateExplicitKey(element, parentType) {
  if (!element._store || element._store.validated || element.key != null) {
    return;
  }
  element._store.validated = true;

  var memoizer = ownerHasKeyUseWarning.uniqueKey || (ownerHasKeyUseWarning.uniqueKey = {});

  var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
  if (memoizer[currentComponentErrorInfo]) {
    return;
  }
  memoizer[currentComponentErrorInfo] = true;

  // Usually the current owner is the offender, but if it accepts children as a
  // property, it may be the creator of the child that's responsible for
  // assigning it a key.
  var childOwner = '';
  if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
    // Give the component that originally created this child.
    childOwner = ' It was passed a child from ' + element._owner.getName() + '.';
  }

  process.env.NODE_ENV !== 'production' ? warning(false, 'Each child in an array or iterator should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.%s', currentComponentErrorInfo, childOwner, ReactComponentTreeHook.getCurrentStackAddendum(element)) : void 0;
}

/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */
function validateChildKeys(node, parentType) {
  if (typeof node !== 'object') {
    return;
  }
  if (Array.isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      var child = node[i];
      if (ReactElement.isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (ReactElement.isValidElement(node)) {
    // This element was passed in a valid location.
    if (node._store) {
      node._store.validated = true;
    }
  } else if (node) {
    var iteratorFn = getIteratorFn(node);
    // Entry iterators provide implicit keys.
    if (iteratorFn) {
      if (iteratorFn !== node.entries) {
        var iterator = iteratorFn.call(node);
        var step;
        while (!(step = iterator.next()).done) {
          if (ReactElement.isValidElement(step.value)) {
            validateExplicitKey(step.value, parentType);
          }
        }
      }
    }
  }
}

/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */
function validatePropTypes(element) {
  var componentClass = element.type;
  if (typeof componentClass !== 'function') {
    return;
  }
  var name = componentClass.displayName || componentClass.name;
  if (componentClass.propTypes) {
    checkReactTypeSpec(componentClass.propTypes, element.props, 'prop', name, element, null);
  }
  if (typeof componentClass.getDefaultProps === 'function') {
    process.env.NODE_ENV !== 'production' ? warning(componentClass.getDefaultProps.isReactClassApproved, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : void 0;
  }
}

var ReactElementValidator = {
  createElement: function (type, props, children) {
    var validType = typeof type === 'string' || typeof type === 'function';
    // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.
    if (!validType) {
      if (typeof type !== 'function' && typeof type !== 'string') {
        var info = '';
        if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
          info += ' You likely forgot to export your component from the file ' + "it's defined in.";
        }

        var sourceInfo = getSourceInfoErrorAddendum(props);
        if (sourceInfo) {
          info += sourceInfo;
        } else {
          info += getDeclarationErrorAddendum();
        }

        info += ReactComponentTreeHook.getCurrentStackAddendum();

        var currentSource = props !== null && props !== undefined && props.__source !== undefined ? props.__source : null;
        ReactComponentTreeHook.pushNonStandardWarningStack(true, currentSource);
        process.env.NODE_ENV !== 'production' ? warning(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', type == null ? type : typeof type, info) : void 0;
        ReactComponentTreeHook.popNonStandardWarningStack();
      }
    }

    var element = ReactElement.createElement.apply(this, arguments);

    // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.
    if (element == null) {
      return element;
    }

    // Skip key warning if the type isn't valid since our key validation logic
    // doesn't expect a non-string/function type and can throw confusing errors.
    // We don't want exception behavior to differ between dev and prod.
    // (Rendering will throw with a helpful message and as soon as the type is
    // fixed, the key warnings will appear.)
    if (validType) {
      for (var i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], type);
      }
    }

    validatePropTypes(element);

    return element;
  },

  createFactory: function (type) {
    var validatedFactory = ReactElementValidator.createElement.bind(null, type);
    // Legacy hook TODO: Warn if this is accessed
    validatedFactory.type = type;

    if (process.env.NODE_ENV !== 'production') {
      if (canDefineProperty) {
        Object.defineProperty(validatedFactory, 'type', {
          enumerable: false,
          get: function () {
            lowPriorityWarning(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');
            Object.defineProperty(this, 'type', {
              value: type
            });
            return type;
          }
        });
      }
    }

    return validatedFactory;
  },

  cloneElement: function (element, props, children) {
    var newElement = ReactElement.cloneElement.apply(this, arguments);
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], newElement.type);
    }
    validatePropTypes(newElement);
    return newElement;
  }
};

module.exports = ReactElementValidator;
}).call(this,require('_process'))
},{"./ReactComponentTreeHook":20,"./ReactCurrentOwner":21,"./ReactElement":23,"./canDefineProperty":31,"./checkReactTypeSpec":32,"./getIteratorFn":34,"./lowPriorityWarning":35,"_process":7,"fbjs/lib/warning":5}],26:[function(require,module,exports){
(function (process){
/**
 * Copyright 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var warning = require('fbjs/lib/warning');

function warnNoop(publicInstance, callerName) {
  if (process.env.NODE_ENV !== 'production') {
    var constructor = publicInstance.constructor;
    process.env.NODE_ENV !== 'production' ? warning(false, '%s(...): Can only update a mounted or mounting component. ' + 'This usually means you called %s() on an unmounted component. ' + 'This is a no-op. Please check the code for the %s component.', callerName, callerName, constructor && (constructor.displayName || constructor.name) || 'ReactClass') : void 0;
  }
}

/**
 * This is the abstract API for an update queue.
 */
var ReactNoopUpdateQueue = {
  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function (publicInstance) {
    return false;
  },

  /**
   * Enqueue a callback that will be executed after all the pending updates
   * have processed.
   *
   * @param {ReactClass} publicInstance The instance to use as `this` context.
   * @param {?function} callback Called after state is updated.
   * @internal
   */
  enqueueCallback: function (publicInstance, callback) {},

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @internal
   */
  enqueueForceUpdate: function (publicInstance) {
    warnNoop(publicInstance, 'forceUpdate');
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @internal
   */
  enqueueReplaceState: function (publicInstance, completeState) {
    warnNoop(publicInstance, 'replaceState');
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @internal
   */
  enqueueSetState: function (publicInstance, partialState) {
    warnNoop(publicInstance, 'setState');
  }
};

module.exports = ReactNoopUpdateQueue;
}).call(this,require('_process'))
},{"_process":7,"fbjs/lib/warning":5}],27:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var ReactPropTypeLocationNames = {};

if (process.env.NODE_ENV !== 'production') {
  ReactPropTypeLocationNames = {
    prop: 'prop',
    context: 'context',
    childContext: 'child context'
  };
}

module.exports = ReactPropTypeLocationNames;
}).call(this,require('_process'))
},{"_process":7}],28:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _require = require('./ReactElement'),
    isValidElement = _require.isValidElement;

var factory = require('prop-types/factory');

module.exports = factory(isValidElement);
},{"./ReactElement":23,"prop-types/factory":9}],29:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;
},{}],30:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

module.exports = '15.6.1';
},{}],31:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var canDefineProperty = false;
if (process.env.NODE_ENV !== 'production') {
  try {
    // $FlowFixMe https://github.com/facebook/flow/issues/285
    Object.defineProperty({}, 'x', { get: function () {} });
    canDefineProperty = true;
  } catch (x) {
    // IE will fail on defineProperty
  }
}

module.exports = canDefineProperty;
}).call(this,require('_process'))
},{"_process":7}],32:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactPropTypeLocationNames = require('./ReactPropTypeLocationNames');
var ReactPropTypesSecret = require('./ReactPropTypesSecret');

var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

var ReactComponentTreeHook;

if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') {
  // Temporary hack.
  // Inline requires don't work well with Jest:
  // https://github.com/facebook/react/issues/7240
  // Remove the inline requires when we don't need them anymore:
  // https://github.com/facebook/react/pull/7178
  ReactComponentTreeHook = require('./ReactComponentTreeHook');
}

var loggedTypeFailures = {};

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?object} element The React element that is being type-checked
 * @param {?number} debugID The React component instance that is being type-checked
 * @private
 */
function checkReactTypeSpec(typeSpecs, values, location, componentName, element, debugID) {
  for (var typeSpecName in typeSpecs) {
    if (typeSpecs.hasOwnProperty(typeSpecName)) {
      var error;
      // Prop type validation may throw. In case they do, we don't want to
      // fail the render phase where it didn't fail before. So we log it.
      // After these have been cleaned up, we'll let them throw.
      try {
        // This is intentionally an invariant that gets caught. It's the same
        // behavior as without this statement except with a better message.
        !(typeof typeSpecs[typeSpecName] === 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s: %s type `%s` is invalid; it must be a function, usually from React.PropTypes.', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName) : _prodInvariant('84', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName) : void 0;
        error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
      } catch (ex) {
        error = ex;
      }
      process.env.NODE_ENV !== 'production' ? warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName, typeof error) : void 0;
      if (error instanceof Error && !(error.message in loggedTypeFailures)) {
        // Only monitor this failure once because there tends to be a lot of the
        // same error.
        loggedTypeFailures[error.message] = true;

        var componentStackInfo = '';

        if (process.env.NODE_ENV !== 'production') {
          if (!ReactComponentTreeHook) {
            ReactComponentTreeHook = require('./ReactComponentTreeHook');
          }
          if (debugID !== null) {
            componentStackInfo = ReactComponentTreeHook.getStackAddendumByID(debugID);
          } else if (element !== null) {
            componentStackInfo = ReactComponentTreeHook.getCurrentStackAddendum(element);
          }
        }

        process.env.NODE_ENV !== 'production' ? warning(false, 'Failed %s type: %s%s', location, error.message, componentStackInfo) : void 0;
      }
    }
  }
}

module.exports = checkReactTypeSpec;
}).call(this,require('_process'))
},{"./ReactComponentTreeHook":20,"./ReactPropTypeLocationNames":27,"./ReactPropTypesSecret":29,"./reactProdInvariant":37,"_process":7,"fbjs/lib/invariant":4,"fbjs/lib/warning":5}],33:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _require = require('./ReactBaseClasses'),
    Component = _require.Component;

var _require2 = require('./ReactElement'),
    isValidElement = _require2.isValidElement;

var ReactNoopUpdateQueue = require('./ReactNoopUpdateQueue');
var factory = require('create-react-class/factory');

module.exports = factory(Component, isValidElement, ReactNoopUpdateQueue);
},{"./ReactBaseClasses":18,"./ReactElement":23,"./ReactNoopUpdateQueue":26,"create-react-class/factory":1}],34:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

/* global Symbol */

var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

/**
 * Returns the iterator method function contained on the iterable object.
 *
 * Be sure to invoke the function with the iterable as context:
 *
 *     var iteratorFn = getIteratorFn(myIterable);
 *     if (iteratorFn) {
 *       var iterator = iteratorFn.call(myIterable);
 *       ...
 *     }
 *
 * @param {?object} maybeIterable
 * @return {?function}
 */
function getIteratorFn(maybeIterable) {
  var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
  if (typeof iteratorFn === 'function') {
    return iteratorFn;
  }
}

module.exports = getIteratorFn;
},{}],35:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

/**
 * Forked from fbjs/warning:
 * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
 *
 * Only change is we use console.warn instead of console.error,
 * and do nothing when 'console' is not supported.
 * This really simplifies the code.
 * ---
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var lowPriorityWarning = function () {};

if (process.env.NODE_ENV !== 'production') {
  var printWarning = function (format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.warn(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  lowPriorityWarning = function (condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }
    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

module.exports = lowPriorityWarning;
}).call(this,require('_process'))
},{"_process":7}],36:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */
'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactElement = require('./ReactElement');

var invariant = require('fbjs/lib/invariant');

/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.only
 *
 * The current implementation of this function assumes that a single child gets
 * passed without a wrapper, but the purpose of this helper function is to
 * abstract away the particular structure of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactElement} The first and only `ReactElement` contained in the
 * structure.
 */
function onlyChild(children) {
  !ReactElement.isValidElement(children) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'React.Children.only expected to receive a single React element child.') : _prodInvariant('143') : void 0;
  return children;
}

module.exports = onlyChild;
}).call(this,require('_process'))
},{"./ReactElement":23,"./reactProdInvariant":37,"_process":7,"fbjs/lib/invariant":4}],37:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */
'use strict';

/**
 * WARNING: DO NOT manually require this module.
 * This is a replacement for `invariant(...)` used by the error code system
 * and will _only_ be required by the corresponding babel pass.
 * It always throws.
 */

function reactProdInvariant(code) {
  var argCount = arguments.length - 1;

  var message = 'Minified React error #' + code + '; visit ' + 'http://facebook.github.io/react/docs/error-decoder.html?invariant=' + code;

  for (var argIdx = 0; argIdx < argCount; argIdx++) {
    message += '&args[]=' + encodeURIComponent(arguments[argIdx + 1]);
  }

  message += ' for the full message or use the non-minified dev environment' + ' for full errors and additional helpful warnings.';

  var error = new Error(message);
  error.name = 'Invariant Violation';
  error.framesToPop = 1; // we don't care about reactProdInvariant's own frame

  throw error;
}

module.exports = reactProdInvariant;
},{}],38:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactCurrentOwner = require('./ReactCurrentOwner');
var REACT_ELEMENT_TYPE = require('./ReactElementSymbol');

var getIteratorFn = require('./getIteratorFn');
var invariant = require('fbjs/lib/invariant');
var KeyEscapeUtils = require('./KeyEscapeUtils');
var warning = require('fbjs/lib/warning');

var SEPARATOR = '.';
var SUBSEPARATOR = ':';

/**
 * This is inlined from ReactElement since this file is shared between
 * isomorphic and renderers. We could extract this to a
 *
 */

/**
 * TODO: Test that a single child and an array with one item have the same key
 * pattern.
 */

var didWarnAboutMaps = false;

/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */
function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (component && typeof component === 'object' && component.key != null) {
    // Explicit key
    return KeyEscapeUtils.escape(component.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}

/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  if (children === null || type === 'string' || type === 'number' ||
  // The following is inlined from ReactElement. This means we can optimize
  // some checks. React Fiber also inlines this logic for similar purposes.
  type === 'object' && children.$$typeof === REACT_ELEMENT_TYPE) {
    callback(traverseContext, children,
    // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows.
    nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.
  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
    }
  } else {
    var iteratorFn = getIteratorFn(children);
    if (iteratorFn) {
      var iterator = iteratorFn.call(children);
      var step;
      if (iteratorFn !== children.entries) {
        var ii = 0;
        while (!(step = iterator.next()).done) {
          child = step.value;
          nextName = nextNamePrefix + getComponentKey(child, ii++);
          subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
        }
      } else {
        if (process.env.NODE_ENV !== 'production') {
          var mapsAsChildrenAddendum = '';
          if (ReactCurrentOwner.current) {
            var mapsAsChildrenOwnerName = ReactCurrentOwner.current.getName();
            if (mapsAsChildrenOwnerName) {
              mapsAsChildrenAddendum = ' Check the render method of `' + mapsAsChildrenOwnerName + '`.';
            }
          }
          process.env.NODE_ENV !== 'production' ? warning(didWarnAboutMaps, 'Using Maps as children is not yet fully supported. It is an ' + 'experimental feature that might be removed. Convert it to a ' + 'sequence / iterable of keyed ReactElements instead.%s', mapsAsChildrenAddendum) : void 0;
          didWarnAboutMaps = true;
        }
        // Iterator will provide entry [k,v] tuples rather than values.
        while (!(step = iterator.next()).done) {
          var entry = step.value;
          if (entry) {
            child = entry[1];
            nextName = nextNamePrefix + KeyEscapeUtils.escape(entry[0]) + SUBSEPARATOR + getComponentKey(child, 0);
            subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
          }
        }
      }
    } else if (type === 'object') {
      var addendum = '';
      if (process.env.NODE_ENV !== 'production') {
        addendum = ' If you meant to render a collection of children, use an array ' + 'instead or wrap the object using createFragment(object) from the ' + 'React add-ons.';
        if (children._isReactElement) {
          addendum = " It looks like you're using an element created by a different " + 'version of React. Make sure to use only one copy of React.';
        }
        if (ReactCurrentOwner.current) {
          var name = ReactCurrentOwner.current.getName();
          if (name) {
            addendum += ' Check the render method of `' + name + '`.';
          }
        }
      }
      var childrenString = String(children);
      !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum) : _prodInvariant('31', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum) : void 0;
    }
  }

  return subtreeCount;
}

/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}

module.exports = traverseAllChildren;
}).call(this,require('_process'))
},{"./KeyEscapeUtils":15,"./ReactCurrentOwner":21,"./ReactElementSymbol":24,"./getIteratorFn":34,"./reactProdInvariant":37,"_process":7,"fbjs/lib/invariant":4,"fbjs/lib/warning":5}],39:[function(require,module,exports){
'use strict';

module.exports = require('./lib/React');

},{"./lib/React":17}],40:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _reactNumericInput = require('react-numeric-input');

var _reactNumericInput2 = _interopRequireDefault(_reactNumericInput);

var _pipe_burst_questions = require('./pipe_burst_questions.js');

var _pipe_burst_questions2 = _interopRequireDefault(_pipe_burst_questions);

var _pipe_burst_data = require('./pipe_burst_data.js');

var _pipe_burst_data2 = _interopRequireDefault(_pipe_burst_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var tubingTables = {
    l80: ['api80'],
    l809: ['api80'],
    l8013: ['cra80'],
    cr13: ['cra80', 'cra95', 'cra110'],
    t95: ['api95'],
    p110: ['api110'],
    sCr13: ['cra80', 'cra95', 'cra110', 'cra125'],
    cr22: ['cra110', 'cra125', 'cra140'],
    cr25: ['cra80', 'cra110', 'cra125', 'cra140'],
    cr1: ['api90', 'api95'],
    cr9: ['api80'],
    cr3: ['api80', 'api95', 'api110'],
    cr5: ['api80', 'api95', 'api110'],
    j55: ['api55'],
    n80: ['api80'],
    c90: ['api90'],
    c95: ['api95'],
    q125: ['api125']
};

var tableShowName = {
    api55: 'API 55',
    api80: 'API 80',
    api90: 'API 90',
    api95: 'API 95',
    api110: 'API 110',
    api125: 'API 125',
    cra80: 'CRA 80',
    cra95: 'CRA 95',
    cra110: 'CRA 110',
    cra125: 'CRA 125',
    cra140: 'CRA 140'
};

var PipeMatrix = function (_Component) {
    _inherits(PipeMatrix, _Component);

    function PipeMatrix(props) {
        _classCallCheck(this, PipeMatrix);

        var _this = _possibleConstructorReturn(this, (PipeMatrix.__proto__ || Object.getPrototypeOf(PipeMatrix)).call(this, props));

        _this.state = {
            answers: {
                // 'hGasket': 9000,
                // 'hBrine': 3000,
                // 'tvd': 10000,
                // 'p': 10000,
                // 'rhoBrine': 12,
                // 'id': 3.958,
                // 'od': 4.5,
                // 'api': 28,
                // 'waterCut': 0.4,
                // 'rhoW': 8.33,
                // 'gasGradient': 28,
                'grade': props.grade || 'l80',
                'systemType': props.systemType || 'liq',
                'hGasket': null,
                'tvd': null,
                'p': null,
                'rhoBrine': null,
                'id': null,
                'od': null,
                'API': null,
                'W.C': null,
                'rhoWater': null
            },
            showProcedure: true

            // Bind `this` to methods
        };['renderQuestion', 'renderStep', 'handleAnswer', 'handleProcedureClick', 'processBase', 'processFullEvacuation'].forEach(function (fName) {
            return _this[fName] = _this[fName].bind(_this);
        });
        return _this;
    }

    _createClass(PipeMatrix, [{
        key: 'handleAnswer',
        value: function handleAnswer(question, answer) {
            this.setState(function (state) {
                state.answers[question.name] = answer;
                return state;
            });
        }
    }, {
        key: 'handleProcedureClick',
        value: function handleProcedureClick() {
            this.setState(function (state) {
                state.showProcedure = !state.showProcedure;
                return state;
            });
        }
    }, {
        key: 'renderQuestion',
        value: function renderQuestion(question, i) {
            var _this2 = this;

            if (question.type === 'multi') {
                var $opts = question.options.map(function (option, j) {
                    return _react2.default.createElement(
                        'option',
                        { value: option.name, key: j },
                        option.text
                    );
                });
                return _react2.default.createElement(
                    'div',
                    { className: 'my-form-group', key: i },
                    _react2.default.createElement(
                        'label',
                        { htmlFor: question.name },
                        question.text
                    ),
                    _react2.default.createElement(
                        'span',
                        null,
                        _react2.default.createElement(
                            'select',
                            {
                                id: question.name,
                                value: this.state.answers[question.name],
                                onChange: function onChange(ev) {
                                    return _this2.handleAnswer(question, ev.target.value);
                                } },
                            $opts
                        )
                    )
                );
            } else if (question.type === 'boolean') {
                return _react2.default.createElement(
                    'div',
                    { className: 'my-form-group', key: i },
                    _react2.default.createElement(
                        'span',
                        null,
                        _react2.default.createElement('input', {
                            type: 'checkbox',
                            id: question.name,
                            onChange: function onChange(ev) {
                                return _this2.handleAnswer(question, ev.target.checked);
                            }
                        })
                    ),
                    _react2.default.createElement(
                        'label',
                        { htmlFor: question.name },
                        question.text
                    )
                );
            } else if (question.type === 'numeric') {
                return _react2.default.createElement(
                    'div',
                    { className: 'my-form-group', key: i },
                    _react2.default.createElement(
                        'label',
                        { htmlFor: question.name },
                        question.text
                    ),
                    _react2.default.createElement(_reactNumericInput2.default, {
                        id: question.name,
                        precision: question.precision !== undefined ? question.precision : 2,
                        value: this.state.answers[question.name],
                        style: false,
                        onChange: function onChange(num) {
                            return _this2.handleAnswer(question, num);
                        } })
                );
            }
        }
    }, {
        key: 'renderStep',
        value: function renderStep(step, i) {
            if (typeof step.value === 'number' && isNaN(step.value)) return null;
            return _react2.default.createElement(
                'tr',
                { key: i },
                _react2.default.createElement(
                    'td',
                    null,
                    _react2.default.createElement(
                        'strong',
                        null,
                        step.showName,
                        ': '
                    )
                ),
                _react2.default.createElement(
                    'td',
                    null,
                    step.value
                )
            );
        }
    }, {
        key: 'findNearest',
        value: function findNearest(intermediate, grade, load, id, od) {
            var searchField = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'burst';
            var ratio = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 1.15;

            // Utility function
            var flatmap = function flatmap(arr, cb) {
                var _ref;

                return (_ref = []).concat.apply(_ref, _toConsumableArray(arr.map(cb)));
            };
            // Tables we need to compare against
            var tables = tubingTables[grade];
            // Unify all the tables but preserve the table name in all rows
            var masterTable = flatmap(tables, function (tName) {
                return _pipe_burst_data2.default[tName].map(function (row) {
                    row['tName'] = tName;
                    return row;
                });
            });
            // Filter all in which load/searchField is greater than ratio
            // Filter only the ones in which id and od matches
            var filtered = masterTable.filter(function (row) {
                return row[searchField] / load > ratio;
            }).filter(function (row) {
                return row.id === id && row.od === od;
            });
            // Return the best 2, with lowest searchField
            var ans = filtered.sort(function (a, b) {
                return a[searchField] - b[searchField];
            }).slice(0, 2);
            var ansName = 'Mejores valores de carga/' + (searchField === 'burst' ? 'P estallido' : 'P colapso');
            intermediate(ansName, JSON.stringify(ans.map(function (row) {
                return row[searchField] / load;
            }), null, 2));
            return ans;
        }
    }, {
        key: 'processBase',
        value: function processBase(_ref2) {
            var p = _ref2.p,
                tvd = _ref2.tvd,
                rhoW = _ref2.rhoW,
                waterCut = _ref2.waterCut,
                api = _ref2.api,
                hGasket = _ref2.hGasket,
                rhoBrine = _ref2.rhoBrine,
                grade = _ref2.grade,
                id = _ref2.id,
                od = _ref2.od;

            var intermediateSteps = [];
            var intermediate = function intermediate(showName, value) {
                var image = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

                intermediateSteps.push({
                    showName: showName,
                    value: value,
                    image: image
                });
            };

            var specificGravityO = 141.5 / (api + 131.5);
            intermediate('Gravedad Específica del Petróleo', specificGravityO);
            var rhoO = specificGravityO * rhoW;
            intermediate('Densidad del Petróleo (ppg)', rhoO);
            var p1in = p - 0.052 * tvd * (rhoW * waterCut + rhoO * (1 - waterCut));
            intermediate('Punto 1 - P in (psi)', p1in);
            var deltaP1 = p1in;
            intermediate('∆P1 (psi)', deltaP1);
            var p2in = p - 0.052 * (tvd - hGasket) * (rhoW * waterCut + rhoO * (1 - waterCut));
            intermediate('Punto 2 - P in (psi)', p2in);
            var p2out = 0.052 * rhoBrine * hGasket;
            intermediate('Punto 2 - P out (psi)', p2out);
            var deltaP2 = p2in - p2out;
            intermediate('∆P2 (psi)', deltaP2);
            var load = Math.max(deltaP1, deltaP2);
            intermediate('∆P máximo (psi)', load);

            var recommendations = this.findNearest(intermediate, grade, load, id, od);

            return { recommendations: recommendations, intermediateSteps: intermediateSteps };
        }
    }, {
        key: 'processFullEvacuation',
        value: function processFullEvacuation(_ref3) {
            var rhoBrine = _ref3.rhoBrine,
                hGasket = _ref3.hGasket,
                grade = _ref3.grade,
                id = _ref3.id,
                od = _ref3.od;

            var intermediateSteps = [];
            var intermediate = function intermediate(showName, value) {
                var image = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

                intermediateSteps.push({
                    showName: showName,
                    value: value,
                    image: image
                });
            };

            var deltaP1 = 0;
            intermediate('∆P1 (psi)', deltaP1);
            var p2out = 0.052 * rhoBrine * hGasket;
            intermediate('Punto 2 - P out (psi)', p2out);
            var deltaP2 = Math.abs(0 - p2out);
            intermediate('∆P2 (psi)', deltaP2);
            var load = Math.max(deltaP1, deltaP2);
            intermediate('∆P máximo (psi)', load);

            var recommendations = this.findNearest(intermediate, grade, load, id, od, 'collapse', 1.125);
            return { recommendations: recommendations, intermediateSteps: intermediateSteps };
        }
    }, {
        key: 'processGas',
        value: function processGas(_ref4) {
            var p = _ref4.p,
                gasGradient = _ref4.gasGradient,
                tvd = _ref4.tvd,
                hGasket = _ref4.hGasket,
                rhoBrine = _ref4.rhoBrine,
                grade = _ref4.grade,
                id = _ref4.id,
                od = _ref4.od;

            var intermediateSteps = [];
            var intermediate = function intermediate(showName, value) {
                var image = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

                intermediateSteps.push({
                    showName: showName,
                    value: value,
                    image: image
                });
            };

            var p1in = p - gasGradient * tvd;
            intermediate('Punto 1 - P in (psi)', p1in);
            var deltaP1 = Math.abs(p1in - 0);
            intermediate('∆P1 (psi)', deltaP1);
            var p2in = p - gasGradient * (tvd - hGasket);
            intermediate('Punto 2 - P in (psi)', p2in);
            var p2out = 0.052 * rhoBrine * (tvd - hGasket);
            intermediate('Punto 2 - P out (psi)', p2out);
            var deltaP2 = Math.abs(p2in - p2out);
            intermediate('∆P2 (psi)', deltaP2);
            var load = Math.max(deltaP1, deltaP2);
            intermediate('∆P máximo (psi)', load);

            var recommendations = this.findNearest(intermediate, grade, load, id, od);
            return { recommendations: recommendations, intermediateSteps: intermediateSteps };
        }
    }, {
        key: 'renderRecommendation',
        value: function renderRecommendation(rec, i) {
            var fix3 = function fix3(n) {
                return n.toFixed(3);
            };
            return _react2.default.createElement(
                'tr',
                { key: i },
                _react2.default.createElement(
                    'td',
                    null,
                    tableShowName[rec.tName]
                ),
                _react2.default.createElement(
                    'td',
                    null,
                    rec.name
                ),
                _react2.default.createElement(
                    'td',
                    null,
                    rec.name2
                ),
                _react2.default.createElement(
                    'td',
                    null,
                    rec.od
                ),
                _react2.default.createElement(
                    'td',
                    null,
                    fix3((rec.od - rec.id) / 2)
                ),
                _react2.default.createElement(
                    'td',
                    null,
                    rec.id
                ),
                _react2.default.createElement(
                    'td',
                    null,
                    rec.burst
                ),
                _react2.default.createElement(
                    'td',
                    null,
                    rec.collapse
                )
            );
        }

        // # Main render

    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var $questions = _pipe_burst_questions2.default.filter(function (q) {
                return q.show ? q.show(_this3.state) : true;
            }).map(this.renderQuestion);

            var gas = this.state.answers.systemType === 'gc';

            var _processBase = this.processBase(this.state.answers),
                baseRecommendations = _processBase.recommendations,
                baseSteps = _processBase.intermediateSteps;

            var _processFullEvacuatio = this.processFullEvacuation(this.state.answers),
                fullEvacRecommendations = _processFullEvacuatio.recommendations,
                fullEvacSteps = _processFullEvacuatio.intermediateSteps;

            var _processGas = this.processGas(this.state.answers),
                gasRecommendations = _processGas.recommendations,
                gasSteps = _processGas.intermediateSteps;

            var $baseRecommendations = baseRecommendations.map(this.renderRecommendation);
            var $fullEvacRecommendations = fullEvacRecommendations.map(this.renderRecommendation);
            var $gasRecommendations = gasRecommendations.map(this.renderRecommendation);

            var allSteps = gas ? baseSteps.concat(gasSteps) : baseSteps.concat(fullEvacSteps);

            var $steps = allSteps.map(this.renderStep);
            var makeTable = function makeTable($rec) {
                return _react2.default.createElement(
                    'table',
                    null,
                    _react2.default.createElement(
                        'thead',
                        null,
                        _react2.default.createElement(
                            'tr',
                            null,
                            _react2.default.createElement(
                                'th',
                                null,
                                'Tabla'
                            ),
                            _react2.default.createElement(
                                'th',
                                null,
                                'Etiqueta 1'
                            ),
                            _react2.default.createElement(
                                'th',
                                null,
                                'Etiqueta 2'
                            ),
                            _react2.default.createElement(
                                'th',
                                null,
                                'Diametro Externo (pulg)'
                            ),
                            _react2.default.createElement(
                                'th',
                                null,
                                'Espesor de Pared (pulg)'
                            ),
                            _react2.default.createElement(
                                'th',
                                null,
                                'Diametro Interno (pulg)'
                            ),
                            _react2.default.createElement(
                                'th',
                                null,
                                'Presi\xF3n de Estallido (psi)'
                            ),
                            _react2.default.createElement(
                                'th',
                                null,
                                'Presi\xF3n de Colapso (psi)'
                            )
                        )
                    ),
                    _react2.default.createElement(
                        'tbody',
                        null,
                        $rec
                    )
                );
            };

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'form',
                    { className: 'table-form' },
                    $questions
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'recommendations' },
                    _react2.default.createElement(
                        'h2',
                        null,
                        'Recomendaciones Caso Base'
                    ),
                    makeTable($baseRecommendations),
                    !gas && _react2.default.createElement(
                        'h2',
                        null,
                        'Recomendaciones Full Evacuation'
                    ),
                    !gas && makeTable($fullEvacRecommendations),
                    gas && _react2.default.createElement(
                        'h2',
                        null,
                        'Recomendaciones Gas Shut-In'
                    ),
                    gas && makeTable($gasRecommendations)
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'procedure' + (this.state.showProcedure ? ' shown' : '') },
                    _react2.default.createElement(
                        'h2',
                        { onClick: this.handleProcedureClick },
                        _react2.default.createElement('i', { className: 'rec-caret' }),
                        'C\xE1lculo'
                    ),
                    this.state.showProcedure && _react2.default.createElement(
                        'table',
                        null,
                        _react2.default.createElement(
                            'thead',
                            null,
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'th',
                                    null,
                                    'Par\xE1metro'
                                ),
                                _react2.default.createElement(
                                    'th',
                                    null,
                                    'Resultado'
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'tbody',
                            null,
                            $steps
                        )
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { style: { whiteSpace: 'pre', display: 'none' } },
                    'State:',
                    _react2.default.createElement('br', null),
                    JSON.stringify(this.state, null, 4),
                    _react2.default.createElement('br', null)
                )
            );
        }
    }]);

    return PipeMatrix;
}(_react.Component);

exports.default = PipeMatrix;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./pipe_burst_data.js":41,"./pipe_burst_questions.js":42,"react-numeric-input":14}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    'api55': [{ name: '1    ', od: 1.05, id: 0.824, burst: 10358.333, collapse: 10564.0907 }, { name: '1    ', od: 1.05, id: 0.742, burst: 14116.667, collapse: 13767.11111 }, { name: '1 1/3', od: 1.315, id: 1.049, burst: 9734.791, collapse: 10000.2371 }, { name: '1 1/3', od: 1.315, id: 0.957, burst: 13101.711, collapse: 12935.18195 }, { name: '1 2/3', od: 1.66, id: 1.41, burst: 7247.741, collapse: 7659.402671 }, { name: '1 2/3', od: 1.66, id: 1.38, burst: 8117.470, collapse: 8494.701698 }, { name: '1 2/3', od: 1.66, id: 1.278, burst: 11074.548, collapse: 11200.35201 }, { name: '1 8/9', od: 1.9, id: 1.65, burst: 6332.237, collapse: 6641.197368 }, { name: '1 8/9', od: 1.9, id: 1.61, burst: 7345.395, collapse: 7754.085873 }, { name: '1 8/9', od: 1.9, id: 1.5, burst: 10131.579, collapse: 10360.1108 }, { name: '1 8/9', od: 1.9, id: 1.4, burst: 12664.474, collapse: 12569.25208 }, { name: '1 8/9', od: 1.9, id: 1.3, burst: 15197.368, collapse: 14626.03878 }, { name: '2    ', od: 2.063, id: 1.715, burst: 7278.236, collapse: 7688.993975 }, { name: '2    ', od: 2.063, id: 1.613, burst: 10497.455, collapse: 10688.63519 }, { name: '2 3/8', od: 2.375, id: 2.041, burst: 6767.895, collapse: 7190.862715 }, { name: '2 3/8', od: 2.375, id: 1.995, burst: 7700.000, collapse: 8096 }, { name: '2 3/8', od: 2.375, id: 1.867, burst: 10293.684, collapse: 10506.05917 }, { name: '2 3/8', od: 2.375, id: 1.785, burst: 11955.263, collapse: 11966.04986 }, { name: '2 3/8', od: 2.375, id: 1.703, burst: 13616.842, collapse: 13360.4769 }, { name: '2 7/8', od: 2.875, id: 2.441, burst: 7264.783, collapse: 7675.942231 }, { name: '2 7/8', od: 2.875, id: 2.323, burst: 9240.000, collapse: 9546.24 }, { name: '2 7/8', od: 2.875, id: 2.259, burst: 10311.304, collapse: 10521.88552 }, { name: '2 7/8', od: 2.875, id: 2.195, burst: 11382.609, collapse: 11470.27599 }, { name: '2 7/8', od: 2.875, id: 2.091, burst: 13123.478, collapse: 12953.2806 }, { name: '2 7/8', od: 2.875, id: 1.995, burst: 14730.435, collapse: 14258.32892 }, { name: '3 1/2', od: 3.5, id: 3.068, burst: 5940.000, collapse: 5970.808571 }, { name: '3 1/2', od: 3.5, id: 2.992, burst: 6985.000, collapse: 7403.529796 }, { name: '3 1/2', od: 3.5, id: 2.922, burst: 7947.500, collapse: 8332.872653 }, { name: '3 1/2', od: 3.5, id: 2.75, burst: 10312.500, collapse: 10522.95918 }, { name: '3 1/2', od: 3.5, id: 2.64, burst: 11825.000, collapse: 11853.95918 }, { name: '3 1/2', od: 3.5, id: 2.548, burst: 13090.000, collapse: 12925.44 }, { name: '3 1/2', od: 3.5, id: 2.44, burst: 14575.000, collapse: 14134.77551 }, { name: '4    ', od: 4, id: 3.548, burst: 5438.125, collapse: 5113.0325 }, { name: '4    ', od: 4, id: 3.476, burst: 6304.375, collapse: 6593.5775 }, { name: '4    ', od: 4, id: 3.34, burst: 7940.625, collapse: 8326.3125 }, { name: '4    ', od: 4, id: 3.17, burst: 9985.938, collapse: 10228.45313 }, { name: '4    ', od: 4, id: 3, burst: 12031.250, collapse: 12031.25 }, { name: '4    ', od: 4, id: 2.78, burst: 14678.125, collapse: 14216.8125 }, { name: '4 1/2', od: 4.5, id: 3.958, burst: 5796.389, collapse: 5725.356667 }, { name: '4 1/2', od: 4.5, id: 3.826, burst: 7208.056, collapse: 7620.859753 }, { name: '4 1/2', od: 4.5, id: 3.74, burst: 8127.778, collapse: 8504.493827 }, { name: '4 1/2', od: 4.5, id: 3.64, burst: 9197.222, collapse: 9506.716049 }, { name: '4 1/2', od: 4.5, id: 3.5, burst: 10694.444, collapse: 10864.19753 }, { name: '4 1/2', od: 4.5, id: 3.38, burst: 11977.778, collapse: 11985.38272 }, { name: '4 1/2', od: 4.5, id: 3.24, burst: 13475.000, collapse: 13244 }],
    'api80': [{ name: '1', od: 1.05, id: 0.824, burst: 15066.667, collapse: 15365.95011 }, { name: '1', od: 1.05, id: 0.742, burst: 20533.333, collapse: 20024.88889 }, { name: '1 1/3', od: 1.315, id: 1.049, burst: 14159.696, collapse: 14545.79942 }, { name: '1 1/3', od: 1.315, id: 0.957, burst: 19057.034, collapse: 18814.8101 }, { name: '1 2/3', od: 1.66, id: 1.41, burst: 10542.169, collapse: 11140.94934 }, { name: '1 2/3', od: 1.66, id: 1.38, burst: 11807.229, collapse: 12355.92974 }, { name: '1 2/3', od: 1.66, id: 1.278, burst: 16108.434, collapse: 16291.42111 }, { name: '1 8/9', od: 1.9, id: 1.65, burst: 9210.526, collapse: 8872.157895 }, { name: '1 8/9', od: 1.9, id: 1.61, burst: 10684.211, collapse: 11278.67036 }, { name: '1 8/9', od: 1.9, id: 1.5, burst: 14736.842, collapse: 15069.25208 }, { name: '1 8/9', od: 1.9, id: 1.4, burst: 18421.053, collapse: 18282.54848 }, { name: '1 8/9', od: 1.9, id: 1.3, burst: 22105.263, collapse: 21274.23823 }, { name: '2', od: 2.063, id: 1.715, burst: 10586.524, collapse: 11183.99124 }, { name: '2', od: 2.063, id: 1.613, burst: 15269.026, collapse: 15547.10572 }, { name: '2 3/8', od: 2.375, id: 2.041, burst: 9844.211, collapse: 9984.183158 }, { name: '2 3/8', od: 2.375, id: 1.995, burst: 11200.000, collapse: 11776 }, { name: '2 3/8', od: 2.375, id: 1.867, burst: 14972.632, collapse: 15281.54061 }, { name: '2 3/8', od: 2.375, id: 1.785, burst: 17389.474, collapse: 17405.16343 }, { name: '2 3/8', od: 2.375, id: 1.703, burst: 19806.316, collapse: 19433.42094 }, { name: '2 7/8', od: 2.875, id: 2.441, burst: 10566.957, collapse: 11165.00688 }, { name: '2 7/8', od: 2.875, id: 2.323, burst: 13440.000, collapse: 13885.44 }, { name: '2 7/8', od: 2.875, id: 2.259, burst: 14998.261, collapse: 15304.56076 }, { name: '2 7/8', od: 2.875, id: 2.195, burst: 16556.522, collapse: 16684.03781 }, { name: '2 7/8', od: 2.875, id: 2.091, burst: 19088.696, collapse: 18841.13543 }, { name: '2 7/8', od: 2.875, id: 1.995, burst: 21426.087, collapse: 20739.38752 }, { name: '3 1/2', od: 3.5, id: 3.068, burst: 8640.000, collapse: 7870.965714 }, { name: '3 1/2', od: 3.5, id: 2.992, burst: 10160.000, collapse: 10538.34857 }, { name: '3 1/2', od: 3.5, id: 2.922, burst: 11560.000, collapse: 12120.54204 }, { name: '3 1/2', od: 3.5, id: 2.75, burst: 15000.000, collapse: 15306.12245 }, { name: '3 1/2', od: 3.5, id: 2.64, burst: 17200.000, collapse: 17242.12245 }, { name: '3 1/2', od: 3.5, id: 2.548, burst: 19040.000, collapse: 18800.64 }, { name: '3 1/2', od: 3.5, id: 2.44, burst: 21200.000, collapse: 20559.67347 }, { name: '4', od: 4, id: 3.548, burst: 7910.000, collapse: 6589.92 }, { name: '4', od: 4, id: 3.476, burst: 9170.000, collapse: 8801.04 }, { name: '4', od: 4, id: 3.34, burst: 11550.000, collapse: 12111 }, { name: '4', od: 4, id: 3.17, burst: 14525.000, collapse: 14877.75 }, { name: '4', od: 4, id: 3, burst: 17500.000, collapse: 17500 }, { name: '4', od: 4, id: 2.78, burst: 21350.000, collapse: 20679 }, { name: '4 1/2', od: 4.5, id: 3.958, burst: 8431.111, collapse: 7504.395556 }, { name: '4 1/2', od: 4.5, id: 3.826, burst: 10484.444, collapse: 11084.88691 }, { name: '4 1/2', od: 4.5, id: 3.74, burst: 11822.222, collapse: 12370.17284 }, { name: '4 1/2', od: 4.5, id: 3.64, burst: 13377.778, collapse: 13827.95062 }, { name: '4 1/2', od: 4.5, id: 3.5, burst: 15555.556, collapse: 15802.46914 }, { name: '4 1/2', od: 4.5, id: 3.38, burst: 17422.222, collapse: 17433.28395 }, { name: '4 1/2', od: 4.5, id: 3.24, burst: 19600.000, collapse: 19264 }],
    'api90': [{ name: '1    ', od: 1.05, id: 0.824, burst: 16950.000, collapse: 17286.69388 }, { name: '1    ', od: 1.05, id: 0.742, burst: 23100.000, collapse: 22528 }, { name: '1 1/3', od: 1.315, id: 1.049, burst: 15929.658, collapse: 16364.02435 }, { name: '1 1/3', od: 1.315, id: 0.957, burst: 21439.163, collapse: 21166.66137 }, { name: '1 2/3', od: 1.66, id: 1.41, burst: 11859.940, collapse: 12333.6988 }, { name: '1 2/3', od: 1.66, id: 1.38, burst: 13283.133, collapse: 13900.42096 }, { name: '1 2/3', od: 1.66, id: 1.278, burst: 18121.988, collapse: 18327.84874 }, { name: '1 8/9', od: 1.9, id: 1.65, burst: 10361.842, collapse: 9674.789474 }, { name: '1 8/9', od: 1.9, id: 1.61, burst: 12019.737, collapse: 12617.31579 }, { name: '1 8/9', od: 1.9, id: 1.5, burst: 16578.947, collapse: 16952.90859 }, { name: '1 8/9', od: 1.9, id: 1.4, burst: 20723.684, collapse: 20567.86704 }, { name: '1 8/9', od: 1.9, id: 1.3, burst: 24868.421, collapse: 23933.51801 }, { name: '2    ', od: 2.063, id: 1.715, burst: 11909.840, collapse: 12422.26466 }, { name: '2    ', od: 2.063, id: 1.613, burst: 17177.654, collapse: 17490.49394 }, { name: '2 3/8', od: 2.375, id: 2.041, burst: 11074.737, collapse: 10940.07579 }, { name: '2 3/8', od: 2.375, id: 1.995, burst: 12600.000, collapse: 13248 }, { name: '2 3/8', od: 2.375, id: 1.867, burst: 16844.211, collapse: 17191.73319 }, { name: '2 3/8', od: 2.375, id: 1.785, burst: 19563.158, collapse: 19580.80886 }, { name: '2 3/8', od: 2.375, id: 1.703, burst: 22282.105, collapse: 21862.59856 }, { name: '2 7/8', od: 2.875, id: 2.441, burst: 11887.826, collapse: 12383.19304 }, { name: '2 7/8', od: 2.875, id: 2.323, burst: 15120.000, collapse: 15621.12 }, { name: '2 7/8', od: 2.875, id: 2.259, burst: 16873.043, collapse: 17217.63085 }, { name: '2 7/8', od: 2.875, id: 2.195, burst: 18626.087, collapse: 18769.54253 }, { name: '2 7/8', od: 2.875, id: 2.091, burst: 21474.783, collapse: 21196.27735 }, { name: '2 7/8', od: 2.875, id: 1.995, burst: 24104.348, collapse: 23331.81096 }, { name: '3 1/2', od: 3.5, id: 3.068, burst: 9720.000, collapse: 8535.611429 }, { name: '3 1/2', od: 3.5, id: 2.992, burst: 11430.000, collapse: 11570.61714 }, { name: '3 1/2', od: 3.5, id: 2.922, burst: 13005.000, collapse: 13635.6098 }, { name: '3 1/2', od: 3.5, id: 2.75, burst: 16875.000, collapse: 17219.38776 }, { name: '3 1/2', od: 3.5, id: 2.64, burst: 19350.000, collapse: 19397.38776 }, { name: '3 1/2', od: 3.5, id: 2.548, burst: 21420.000, collapse: 21150.72 }, { name: '3 1/2', od: 3.5, id: 2.44, burst: 23850.000, collapse: 23129.63265 }, { name: '4    ', od: 4, id: 3.548, burst: 8898.750, collapse: 7078.01 }, { name: '4    ', od: 4, id: 3.476, burst: 10316.250, collapse: 9593.87 }, { name: '4    ', od: 4, id: 3.34, burst: 12993.750, collapse: 13624.875 }, { name: '4    ', od: 4, id: 3.17, burst: 16340.625, collapse: 16737.46875 }, { name: '4    ', od: 4, id: 3, burst: 19687.500, collapse: 19687.5 }, { name: '4    ', od: 4, id: 2.78, burst: 24018.750, collapse: 23263.875 }, { name: '4 1/2', od: 4.5, id: 3.958, burst: 9485.000, collapse: 8118.52 }, { name: '4 1/2', od: 4.5, id: 3.826, burst: 11795.000, collapse: 12218.44 }, { name: '4 1/2', od: 4.5, id: 3.74, burst: 13300.000, collapse: 13916.44444 }, { name: '4 1/2', od: 4.5, id: 3.64, burst: 15050.000, collapse: 15556.44444 }, { name: '4 1/2', od: 4.5, id: 3.5, burst: 17500.000, collapse: 17777.77778 }, { name: '4 1/2', od: 4.5, id: 3.38, burst: 19600.000, collapse: 19612.44444 }, { name: '4 1/2', od: 4.5, id: 3.24, burst: 22050.000, collapse: 21672 }],
    'api95': [{ name: '1    ', od: 1.05, id: 0.824, burst: 17891.667, collapse: 18247.06576 }, { name: '1    ', od: 1.05, id: 0.742, burst: 24383.333, collapse: 23779.55556 }, { name: '1 1/3', od: 1.315, id: 1.049, burst: 16814.639, collapse: 17273.13681 }, { name: '1 1/3', od: 1.315, id: 0.957, burst: 22630.228, collapse: 22342.587 }, { name: '1 2/3', od: 1.66, id: 1.41, burst: 12518.825, collapse: 12885.39157 }, { name: '1 2/3', od: 1.66, id: 1.38, burst: 14021.084, collapse: 14672.66657 }, { name: '1 2/3', od: 1.66, id: 1.278, burst: 19128.765, collapse: 19346.06256 }, { name: '1 8/9', od: 1.9, id: 1.65, burst: 10937.500, collapse: 10062.5 }, { name: '1 8/9', od: 1.9, id: 1.61, burst: 12687.500, collapse: 13186.5 }, { name: '1 8/9', od: 1.9, id: 1.5, burst: 17500.000, collapse: 17894.73684 }, { name: '1 8/9', od: 1.9, id: 1.4, burst: 21875.000, collapse: 21710.52632 }, { name: '1 8/9', od: 1.9, id: 1.3, burst: 26250.000, collapse: 25263.15789 }, { name: '2    ', od: 2.063, id: 1.715, burst: 12571.498, collapse: 12979.41953 }, { name: '2    ', od: 2.063, id: 1.613, burst: 18131.968, collapse: 18462.18805 }, { name: '2 3/8', od: 2.375, id: 2.041, burst: 11690.000, collapse: 11405.82 }, { name: '2 3/8', od: 2.375, id: 1.995, burst: 13300.000, collapse: 13984 }, { name: '2 3/8', od: 2.375, id: 1.867, burst: 17780.000, collapse: 18146.82947 }, { name: '2 3/8', od: 2.375, id: 1.785, burst: 20650.000, collapse: 20668.63158 }, { name: '2 3/8', od: 2.375, id: 1.703, burst: 23520.000, collapse: 23077.18737 }, { name: '2 7/8', od: 2.875, id: 2.441, burst: 12548.261, collapse: 12937.93826 }, { name: '2 7/8', od: 2.875, id: 2.323, burst: 15960.000, collapse: 16488.96 }, { name: '2 7/8', od: 2.875, id: 2.259, burst: 17810.435, collapse: 18174.1659 }, { name: '2 7/8', od: 2.875, id: 2.195, burst: 19660.870, collapse: 19812.2949 }, { name: '2 7/8', od: 2.875, id: 2.091, burst: 22667.826, collapse: 22373.84832 }, { name: '2 7/8', od: 2.875, id: 1.995, burst: 25443.478, collapse: 24628.02268 }, { name: '3 1/2', od: 3.5, id: 3.068, burst: 10260.000, collapse: 8853.065714 }, { name: '3 1/2', od: 3.5, id: 2.992, burst: 12065.000, collapse: 12075.24857 }, { name: '3 1/2', od: 3.5, id: 2.922, burst: 13727.500, collapse: 14393.14367 }, { name: '3 1/2', od: 3.5, id: 2.75, burst: 17812.500, collapse: 18176.02041 }, { name: '3 1/2', od: 3.5, id: 2.64, burst: 20425.000, collapse: 20475.02041 }, { name: '3 1/2', od: 3.5, id: 2.548, burst: 22610.000, collapse: 22325.76 }, { name: '3 1/2', od: 3.5, id: 2.44, burst: 25175.000, collapse: 24414.61224 }, { name: '4    ', od: 4, id: 3.548, burst: 9393.125, collapse: 7305.57 }, { name: '4    ', od: 4, id: 3.476, burst: 10889.375, collapse: 9976.59 }, { name: '4    ', od: 4, id: 3.34, burst: 13715.625, collapse: 14381.8125 }, { name: '4    ', od: 4, id: 3.17, burst: 17248.438, collapse: 17667.32813 }, { name: '4    ', od: 4, id: 3, burst: 20781.250, collapse: 20781.25 }, { name: '4    ', od: 4, id: 2.78, burst: 25353.125, collapse: 24556.3125 }, { name: '4 1/2', od: 4.5, id: 3.958, burst: 10011.944, collapse: 8410.251111 }, { name: '4 1/2', od: 4.5, id: 3.826, burst: 12450.278, collapse: 12763.02444 }, { name: '4 1/2', od: 4.5, id: 3.74, burst: 14038.889, collapse: 14689.58025 }, { name: '4 1/2', od: 4.5, id: 3.64, burst: 15886.111, collapse: 16420.69136 }, { name: '4 1/2', od: 4.5, id: 3.5, burst: 18472.222, collapse: 18765.4321 }, { name: '4 1/2', od: 4.5, id: 3.38, burst: 20688.889, collapse: 20702.02469 }, { name: '4 1/2', od: 4.5, id: 3.24, burst: 23275.000, collapse: 22876 }],
    'api110': [{ name: '1    ', od: 1.05, id: 0.824, burst: 20.717, collapse: 21.12818141 }, { name: '1    ', od: 1.05, id: 0.742, burst: 28.233, collapse: 27.53422222 }, { name: '1 1/3', od: 1.315, id: 1.049, burst: 19.470, collapse: 20.0004742 }, { name: '1 1/3', od: 1.315, id: 0.957, burst: 26.203, collapse: 25.87036389 }, { name: '1 2/3', od: 1.66, id: 1.41, burst: 14.495, collapse: -2834.660355 }, { name: '1 2/3', od: 1.66, id: 1.38, burst: 16.235, collapse: 16.9894034 }, { name: '1 2/3', od: 1.66, id: 1.278, burst: 22.149, collapse: 22.40070402 }, { name: '1 8/9', od: 1.9, id: 1.65, burst: 12.664, collapse: -2837.988605 }, { name: '1 8/9', od: 1.9, id: 1.61, burst: 14.691, collapse: -2834.305342 }, { name: '1 8/9', od: 1.9, id: 1.5, burst: 20.263, collapse: 20.72022161 }, { name: '1 8/9', od: 1.9, id: 1.4, burst: 25.329, collapse: 25.13850416 }, { name: '1 8/9', od: 1.9, id: 1.3, burst: 30.395, collapse: 29.25207756 }, { name: '2    ', od: 2.063, id: 1.715, burst: 14.556, collapse: -2834.549494 }, { name: '2    ', od: 2.063, id: 1.613, burst: 20.995, collapse: 21.37727037 }, { name: '2 3/8', od: 2.375, id: 2.041, burst: 13.536, collapse: -2836.404802 }, { name: '2 3/8', od: 2.375, id: 1.995, burst: 15.400, collapse: -2833.0162 }, { name: '2 3/8', od: 2.375, id: 1.867, burst: 20.587, collapse: 21.01211834 }, { name: '2 3/8', od: 2.375, id: 1.785, burst: 23.911, collapse: 23.93209972 }, { name: '2 3/8', od: 2.375, id: 1.703, burst: 27.234, collapse: 26.7209538 }, { name: '2 7/8', od: 2.875, id: 2.441, burst: 14.530, collapse: -2834.598402 }, { name: '2 7/8', od: 2.875, id: 2.323, burst: 18.480, collapse: 19.09248 }, { name: '2 7/8', od: 2.875, id: 2.259, burst: 20.623, collapse: 21.04377104 }, { name: '2 7/8', od: 2.875, id: 2.195, burst: 22.765, collapse: 22.94055198 }, { name: '2 7/8', od: 2.875, id: 2.091, burst: 26.247, collapse: 25.90656121 }, { name: '2 7/8', od: 2.875, id: 1.995, burst: 29.461, collapse: 28.51665784 }, { name: '3 1/2', od: 3.5, id: 3.068, burst: 11.880, collapse: -2839.414554 }, { name: '3 1/2', od: 3.5, id: 2.992, burst: 13.970, collapse: -2835.615531 }, { name: '3 1/2', od: 3.5, id: 2.922, burst: 15.895, collapse: 16.66574531 }, { name: '3 1/2', od: 3.5, id: 2.75, burst: 20.625, collapse: 21.04591837 }, { name: '3 1/2', od: 3.5, id: 2.64, burst: 23.650, collapse: 23.70791837 }, { name: '3 1/2', od: 3.5, id: 2.548, burst: 26.180, collapse: 25.85088 }, { name: '3 1/2', od: 3.5, id: 2.44, burst: 29.150, collapse: 28.26955102 }, { name: '4    ', od: 4, id: 3.548, burst: 10.876, collapse: -2841.239085 }, { name: '4    ', od: 4, id: 3.476, burst: 12.609, collapse: -2838.089895 }, { name: '4    ', od: 4, id: 3.34, burst: 15.881, collapse: 16.652625 }, { name: '4    ', od: 4, id: 3.17, burst: 19.972, collapse: 20.45690625 }, { name: '4    ', od: 4, id: 3, burst: 24.063, collapse: 24.0625 }, { name: '4    ', od: 4, id: 2.78, burst: 29.356, collapse: 28.433625 }, { name: '4 1/2', od: 4.5, id: 3.958, burst: 11.593, collapse: -2839.936642 }, { name: '4 1/2', od: 4.5, id: 3.826, burst: 14.416, collapse: -2834.804629 }, { name: '4 1/2', od: 4.5, id: 3.74, burst: 16.256, collapse: 17.00898765 }, { name: '4 1/2', od: 4.5, id: 3.64, burst: 18.394, collapse: 19.0134321 }, { name: '4 1/2', od: 4.5, id: 3.5, burst: 21.389, collapse: 21.72839506 }, { name: '4 1/2', od: 4.5, id: 3.38, burst: 23.956, collapse: 23.97076543 }, { name: '4 1/2', od: 4.5, id: 3.24, burst: 26.950, collapse: 26.488 }],
    'api125': [{ name: '1    ', od: 1.05, id: 0.824, burst: 23541.667, collapse: 24009.29705 }, { name: '1    ', od: 1.05, id: 0.742, burst: 32083.333, collapse: 31288.88889 }, { name: '1 1/3', od: 1.315, id: 1.049, burst: 22124.525, collapse: 22727.81159 }, { name: '1 1/3', od: 1.315, id: 0.957, burst: 29776.616, collapse: 29398.14079 }, { name: '1 2/3', od: 1.66, id: 1.41, burst: 16472.139, collapse: 15999.0753 }, { name: '1 2/3', od: 1.66, id: 1.38, burst: 18448.795, collapse: 19306.14022 }, { name: '1 2/3', od: 1.66, id: 1.278, burst: 25169.428, collapse: 25455.34548 }, { name: '1 8/9', od: 1.9, id: 1.65, burst: 14391.447, collapse: 12148.01316 }, { name: '1 8/9', od: 1.9, id: 1.61, burst: 16694.079, collapse: 16409.85526 }, { name: '1 8/9', od: 1.9, id: 1.5, burst: 23026.316, collapse: 23545.70637 }, { name: '1 8/9', od: 1.9, id: 1.4, burst: 28782.895, collapse: 28566.48199 }, { name: '1 8/9', od: 1.9, id: 1.3, burst: 34539.474, collapse: 33240.99723 }, { name: '2    ', od: 2.063, id: 1.715, burst: 16541.444, collapse: 16127.3507 }, { name: '2    ', od: 2.063, id: 1.613, burst: 23857.853, collapse: 24292.35269 }, { name: '2 3/8', od: 2.375, id: 2.041, burst: 15381.579, collapse: 13980.60526 }, { name: '2 3/8', od: 2.375, id: 1.995, burst: 17500.000, collapse: 17901.5 }, { name: '2 3/8', od: 2.375, id: 1.867, burst: 23394.737, collapse: 23877.4072 }, { name: '2 3/8', od: 2.375, id: 1.785, burst: 27171.053, collapse: 27195.56787 }, { name: '2 3/8', od: 2.375, id: 1.703, burst: 30947.368, collapse: 30364.72022 }, { name: '2 7/8', od: 2.875, id: 2.441, burst: 16510.870, collapse: 16070.76087 }, { name: '2 7/8', od: 2.875, id: 2.323, burst: 21000.000, collapse: 21696 }, { name: '2 7/8', od: 2.875, id: 2.259, burst: 23434.783, collapse: 23913.37618 }, { name: '2 7/8', od: 2.875, id: 2.195, burst: 25869.565, collapse: 26068.80907 }, { name: '2 7/8', od: 2.875, id: 2.091, burst: 29826.087, collapse: 29439.2741 }, { name: '2 7/8', od: 2.875, id: 1.995, burst: 33478.261, collapse: 32405.29301 }, { name: '3 1/2', od: 3.5, id: 3.068, burst: 13500.000, collapse: 10498.07143 }, { name: '3 1/2', od: 3.5, id: 2.992, burst: 15875.000, collapse: 14893.85714 }, { name: '3 1/2', od: 3.5, id: 2.922, burst: 18062.500, collapse: 18942.60714 }, { name: '3 1/2', od: 3.5, id: 2.75, burst: 23437.500, collapse: 23915.81633 }, { name: '3 1/2', od: 3.5, id: 2.64, burst: 26875.000, collapse: 26940.81633 }, { name: '3 1/2', od: 3.5, id: 2.548, burst: 29750.000, collapse: 29376 }, { name: '3 1/2', od: 3.5, id: 2.44, burst: 33125.000, collapse: 32124.4898 }, { name: '4    ', od: 4, id: 3.548, burst: 12359.375, collapse: 8386.9375 }, { name: '4    ', od: 4, id: 3.476, burst: 14328.125, collapse: 12030.8125 }, { name: '4    ', od: 4, id: 3.34, burst: 18046.875, collapse: 18913.6875 }, { name: '4    ', od: 4, id: 3.17, burst: 22695.313, collapse: 23246.48438 }, { name: '4    ', od: 4, id: 3, burst: 27343.750, collapse: 27343.75 }, { name: '4    ', od: 4, id: 2.78, burst: 33359.375, collapse: 32310.9375 }, { name: '4 1/2', od: 4.5, id: 3.958, burst: 13173.611, collapse: 9893.972222 }, { name: '4 1/2', od: 4.5, id: 3.826, burst: 16381.944, collapse: 15832.13889 }, { name: '4 1/2', od: 4.5, id: 3.74, burst: 18472.222, collapse: 19328.39506 }, { name: '4 1/2', od: 4.5, id: 3.64, burst: 20902.778, collapse: 21606.17284 }, { name: '4 1/2', od: 4.5, id: 3.5, burst: 24305.556, collapse: 24691.35802 }, { name: '4 1/2', od: 4.5, id: 3.38, burst: 27222.222, collapse: 27239.50617 }, { name: '4 1/2', od: 4.5, id: 3.24, burst: 30625.000, collapse: 30100 }],
    'cra80': [{ name: '1    ', name2: '1.140', od: 1.05, id: 0.824, burst: 17733.333, collapse: 17699.55556 }, { name: '1    ', name2: '1.480', od: 1.05, id: 0.742, burst: 20533.333, collapse: 20024.88889 }, { name: '1 1/3', name2: '1.700', od: 1.315, id: 1.049, burst: 14159.696, collapse: 14545.79942 }, { name: '1 1/3', name2: '2.190', od: 1.315, id: 0.957, burst: 19057.034, collapse: 18814.8101 }, { name: '1 2/3', name2: '2.090', od: 1.66, id: 1.41, burst: 10542.169, collapse: 11140.94934 }, { name: '1 2/3', name2: '2.300', od: 1.66, id: 1.36, burst: 11807.229, collapse: 12355.92974 }, { name: '1 2/3', name2: '3.030', od: 1.66, id: 1.278, burst: 16108.434, collapse: 16291.42111 }, { name: '1 8/9', name2: '2.400', od: 1.9, id: 1.65, burst: 9210.526, collapse: 8872.157895 }, { name: '1 8/9', name2: '2.750', od: 1.9, id: 1.61, burst: 10684.211, collapse: 11278.67036 }, { name: '1 8/9', name2: '3.650', od: 1.9, id: 1.5, burst: 14736.842, collapse: 15069.25208 }, { name: '1 8/9', name2: '4.420', od: 1.9, id: 1.4, burst: 18421.053, collapse: 18282.54848 }, { name: '1 8/9', name2: '5.150', od: 1.9, id: 1.3, burst: 22105.263, collapse: 21274.23823 }, { name: '2 3/8', name2: '4.000', od: 2.375, id: 2.041, burst: 9844.211, collapse: 9984.183158 }, { name: '2 3/8', name2: '4.600', od: 2.375, id: 1.996, burst: 11200.000, collapse: 11776 }, { name: '2 3/8', name2: '5.800', od: 2.375, id: 1.867, burst: 14972.632, collapse: 15281.54061 }, { name: '2 3/8', name2: '6.600', od: 2.375, id: 1.785, burst: 17389.474, collapse: 17405.16343 }, { name: '2 3/8', name2: '7.350', od: 2.375, id: 1.703, burst: 19806.316, collapse: 19433.42094 }, { name: '2 7/8', name2: '6.400', od: 2.875, id: 2.441, burst: 10566.957, collapse: 11165.00688 }, { name: '2 7/8', name2: '7.800', od: 2.875, id: 2.323, burst: 13440.000, collapse: 13885.44 }, { name: '2 7/8', name2: '8.600', od: 2.875, id: 2.259, burst: 14998.261, collapse: 15304.56076 }, { name: '2 7/8', name2: '9.350', od: 2.875, id: 2.195, burst: 16556.522, collapse: 16684.03781 }, { name: '2 7/8', name2: '10.500', od: 2.875, id: 2.091, burst: 19088.696, collapse: 18841.13543 }, { name: '2 7/8', name2: '11.500', od: 2.875, id: 1.995, burst: 21426.087, collapse: 20739.38752 }, { name: '3 1/2', name2: '7.700', od: 3.5, id: 3.062, burst: 8640.000, collapse: 7870.965714 }, { name: '3 1/2', name2: '9.200', od: 3.5, id: 2.992, burst: 10160.000, collapse: 10538.34857 }, { name: '3 1/2', name2: '10.200', od: 3.5, id: 2.922, burst: 11560.000, collapse: 12120.54204 }, { name: '3 1/2', name2: '12.700', od: 3.5, id: 2.75, burst: 15000.000, collapse: 15306.12245 }, { name: '3 1/2', name2: '14.300', od: 3.5, id: 2.64, burst: 17200.000, collapse: 17242.12245 }, { name: '3 1/2', name2: '15.500', od: 3.5, id: 2.548, burst: 18400.000, collapse: 18264.81633 }, { name: '3 1/2', name2: '17.000', od: 3.5, id: 2.44, burst: 21200.000, collapse: 20559.67347 }, { name: '4    ', name2: '9.500', od: 4, id: 3.548, burst: 7910.000, collapse: 6589.92 }, { name: '4    ', name2: '10.700', od: 4, id: 3.478, burst: 9170.000, collapse: 8801.04 }, { name: '4    ', name2: '13.200', od: 4, id: 3.34, burst: 11550.000, collapse: 12111 }, { name: '4    ', name2: '16.100', od: 4, id: 3.17, burst: 14525.000, collapse: 14877.75 }, { name: '4    ', name2: '18.900', od: 4, id: 3, burst: 17500.000, collapse: 17500 }, { name: '4    ', name2: '22.200', od: 4, id: 2.78, burst: 21350.000, collapse: 20679 }, { name: '4 1/2', name2: '9.500', od: 4.5, id: 4.09, burst: 6377.778, collapse: 3901.088889 }, { name: '4 1/2', name2: '10.500', od: 4.5, id: 4.052, burst: 6968.889, collapse: 4938.404444 }, { name: '4 1/2', name2: '11.600', od: 4.5, id: 4, burst: 7777.778, collapse: 6357.888889 }, { name: '4 1/2', name2: '12.600', od: 4.5, id: 3.958, burst: 8431.111, collapse: 7504.395556 }, { name: '4 1/2', name2: '13.500', od: 4.5, id: 3.92, burst: 9022.222, collapse: 8541.711111 }, { name: '4 1/2', name2: '15.100', od: 4.5, id: 3.826, burst: 10484.444, collapse: 11084.88691 }, { name: '4 1/2', name2: '17.000', od: 4.5, id: 3.74, burst: 11822.222, collapse: 12370.17284 }, { name: '4 1/2', name2: '18.900', od: 4.5, id: 3.64, burst: 13377.778, collapse: 13827.95062 }, { name: '4 1/2', name2: '21.500', od: 4.5, id: 3.5, burst: 15555.556, collapse: 15802.46914 }, { name: '4 1/2', name2: '23.700', od: 4.5, id: 3.8, burst: 17422.222, collapse: 17433.28395 }, { name: '4 1/2', name2: '26.100', od: 4.5, id: 3.24, burst: 19600.000, collapse: 19264 }],
    'cra95': [{ name: '1    ', name2: '1.140', od: 1.05, id: 0.824, burst: 19950.000, collapse: 19912 }, { name: '1    ', name2: '1.480', od: 1.05, id: 0.742, burst: 23100.000, collapse: 22528 }, { name: '1 1/3', name2: '1.700', od: 1.315, id: 1.049, burst: 15929.658, collapse: 16364.02435 }, { name: '1 1/3', name2: '2.190', od: 1.315, id: 0.957, burst: 21439.163, collapse: 21166.66137 }, { name: '1 2/3', name2: '2.090', od: 1.66, id: 1.41, burst: 11859.940, collapse: 12080.68675 }, { name: '1 2/3', name2: '2.300', od: 1.66, id: 1.36, burst: 13283.133, collapse: 13900.42096 }, { name: '1 2/3', name2: '3.030', od: 1.66, id: 1.278, burst: 18121.988, collapse: 18327.84874 }, { name: '1 8/9', name2: '2.400', od: 1.9, id: 1.65, burst: 10361.842, collapse: 9406.368421 }, { name: '1 8/9', name2: '2.750', od: 1.9, id: 1.61, burst: 12019.737, collapse: 12365.94737 }, { name: '1 8/9', name2: '3.650', od: 1.9, id: 1.5, burst: 16578.947, collapse: 16952.90859 }, { name: '1 8/9', name2: '4.420', od: 1.9, id: 1.4, burst: 20723.684, collapse: 20567.86704 }, { name: '1 8/9', name2: '5.150', od: 1.9, id: 1.3, burst: 24868.421, collapse: 23933.51801 }, { name: '2 3/8', name2: '4.000', od: 2.375, id: 2.041, burst: 11074.737, collapse: 10678.98737 }, { name: '2 3/8', name2: '4.600', od: 2.375, id: 1.996, burst: 12600.000, collapse: 13248 }, { name: '2 3/8', name2: '5.800', od: 2.375, id: 1.867, burst: 16844.211, collapse: 17191.73319 }, { name: '2 3/8', name2: '6.600', od: 2.375, id: 1.785, burst: 19563.158, collapse: 19580.80886 }, { name: '2 3/8', name2: '7.350', od: 2.375, id: 1.703, burst: 22282.105, collapse: 21862.59856 }, { name: '2 7/8', name2: '6.400', od: 2.875, id: 2.441, burst: 11887.826, collapse: 12130.46783 }, { name: '2 7/8', name2: '7.800', od: 2.875, id: 2.323, burst: 15120.000, collapse: 15621.12 }, { name: '2 7/8', name2: '8.600', od: 2.875, id: 2.259, burst: 16873.043, collapse: 17217.63085 }, { name: '2 7/8', name2: '9.350', od: 2.875, id: 2.195, burst: 18626.087, collapse: 18769.54253 }, { name: '2 7/8', name2: '10.500', od: 2.875, id: 2.091, burst: 21474.783, collapse: 21196.27735 }, { name: '2 7/8', name2: '11.500', od: 2.875, id: 1.995, burst: 24104.348, collapse: 23331.81096 }, { name: '3 1/2', name2: '7.700', od: 3.5, id: 3.062, burst: 9720.000, collapse: 8260.588571 }, { name: '3 1/2', name2: '9.200', od: 3.5, id: 2.992, burst: 11430.000, collapse: 11313.18286 }, { name: '3 1/2', name2: '10.200', od: 3.5, id: 2.922, burst: 13005.000, collapse: 13635.6098 }, { name: '3 1/2', name2: '12.700', od: 3.5, id: 2.75, burst: 16875.000, collapse: 17219.38776 }, { name: '3 1/2', name2: '14.300', od: 3.5, id: 2.64, burst: 19350.000, collapse: 19397.38776 }, { name: '3 1/2', name2: '15.500', od: 3.5, id: 2.548, burst: 20700.000, collapse: 20547.91837 }, { name: '3 1/2', name2: '17.000', od: 3.5, id: 2.44, burst: 23850.000, collapse: 23129.63265 }, { name: '4    ', name2: '9.500', od: 4, id: 3.548, burst: 8898.750, collapse: 6794.54 }, { name: '4    ', name2: '10.700', od: 4, id: 3.478, burst: 10316.250, collapse: 9324.98 }, { name: '4    ', name2: '13.200', od: 4, id: 3.34, burst: 12993.750, collapse: 13624.875 }, { name: '4    ', name2: '16.100', od: 4, id: 3.17, burst: 16340.625, collapse: 16737.46875 }, { name: '4    ', name2: '18.900', od: 4, id: 3, burst: 19687.500, collapse: 19687.5 }, { name: '4    ', name2: '22.200', od: 4, id: 2.78, burst: 24018.750, collapse: 23263.875 }, { name: '4 1/2', name2: '9.500', od: 4.5, id: 4.09, burst: 7175.000, collapse: 8482.8518 }, { name: '4 1/2', name2: '10.500', od: 4.5, id: 4.052, burst: 7840.000, collapse: 4904.52 }, { name: '4 1/2', name2: '11.600', od: 4.5, id: 4, burst: 8750.000, collapse: 6529 }, { name: '4 1/2', name2: '12.600', od: 4.5, id: 3.958, burst: 9485.000, collapse: 7841.08 }, { name: '4 1/2', name2: '13.500', od: 4.5, id: 3.92, burst: 10150.000, collapse: 9028.2 }, { name: '4 1/2', name2: '15.100', od: 4.5, id: 3.826, burst: 11795.000, collapse: 11964.76 }, { name: '4 1/2', name2: '17.000', od: 4.5, id: 3.74, burst: 13300.000, collapse: 13916.44444 }, { name: '4 1/2', name2: '18.900', od: 4.5, id: 3.64, burst: 15050.000, collapse: 15556.44444 }, { name: '4 1/2', name2: '21.500', od: 4.5, id: 3.5, burst: 17500.000, collapse: 17777.77778 }, { name: '4 1/2', name2: '23.700', od: 4.5, id: 3.8, burst: 19600.000, collapse: 19612.44444 }, { name: '4 1/2', name2: '26.100', od: 4.5, id: 3.24, burst: 22050.000, collapse: 21672 }],
    'cra110': [{ name: '1    ', name2: '1.140', od: 1.05, id: 0.824, burst: 24383.333, collapse: 24336.88889 }, { name: '1    ', name2: '1.480', od: 1.05, id: 0.742, burst: 28233.333, collapse: 27534.22222 }, { name: '1 1/3', name2: '1.700', od: 1.315, id: 1.049, burst: 19469.582, collapse: 20000.4742 }, { name: '1 1/3', name2: '2.190', od: 1.315, id: 0.957, burst: 26203.422, collapse: 25870.36389 }, { name: '1 2/3', name2: '2.090', od: 1.66, id: 1.41, burst: 14495.482, collapse: 14487.64458 }, { name: '1 2/3', name2: '2.300', od: 1.66, id: 1.36, burst: 16234.940, collapse: 16989.4034 }, { name: '1 2/3', name2: '3.030', od: 1.66, id: 1.278, burst: 22149.096, collapse: 22400.70402 }, { name: '1 8/9', name2: '2.400', od: 1.9, id: 1.65, burst: 12664.474, collapse: 11159.39474 }, { name: '1 8/9', name2: '2.750', od: 1.9, id: 1.61, burst: 14690.789, collapse: 14842.65789 }, { name: '1 8/9', name2: '3.650', od: 1.9, id: 1.5, burst: 20263.158, collapse: 20720.22161 }, { name: '1 8/9', name2: '4.420', od: 1.9, id: 1.4, burst: 25328.947, collapse: 25138.50416 }, { name: '1 8/9', name2: '5.150', od: 1.9, id: 1.3, burst: 30394.737, collapse: 29252.07756 }, { name: '2 3/8', name2: '4.000', od: 2.375, id: 2.041, burst: 13535.789, collapse: 12743.19789 }, { name: '2 3/8', name2: '4.600', od: 2.375, id: 1.996, burst: 15400.000, collapse: 16131.8 }, { name: '2 3/8', name2: '5.800', od: 2.375, id: 1.867, burst: 20587.368, collapse: 21012.11834 }, { name: '2 3/8', name2: '6.600', od: 2.375, id: 1.785, burst: 23910.526, collapse: 23932.09972 }, { name: '2 3/8', name2: '7.350', od: 2.375, id: 1.703, burst: 27233.684, collapse: 26720.9538 }, { name: '2 7/8', name2: '6.400', od: 2.875, id: 2.441, burst: 14529.565, collapse: 14549.59826 }, { name: '2 7/8', name2: '7.800', od: 2.875, id: 2.323, burst: 18480.000, collapse: 19092.48 }, { name: '2 7/8', name2: '8.600', od: 2.875, id: 2.259, burst: 20622.609, collapse: 21043.77104 }, { name: '2 7/8', name2: '9.350', od: 2.875, id: 2.195, burst: 22765.217, collapse: 22940.55198 }, { name: '2 7/8', name2: '10.500', od: 2.875, id: 2.091, burst: 26246.957, collapse: 25906.56121 }, { name: '2 7/8', name2: '11.500', od: 2.875, id: 1.995, burst: 29460.870, collapse: 28516.65784 }, { name: '3 1/2', name2: '7.700', od: 3.5, id: 3.062, burst: 11880.000, collapse: 9733.445714 }, { name: '3 1/2', name2: '9.200', od: 3.5, id: 2.992, burst: 13970.000, collapse: 13532.46857 }, { name: '3 1/2', name2: '10.200', od: 3.5, id: 2.922, burst: 15895.000, collapse: 16665.74531 }, { name: '3 1/2', name2: '12.700', od: 3.5, id: 2.75, burst: 20625.000, collapse: 21045.91837 }, { name: '3 1/2', name2: '14.300', od: 3.5, id: 2.64, burst: 23650.000, collapse: 23707.91837 }, { name: '3 1/2', name2: '15.500', od: 3.5, id: 2.548, burst: 25300.000, collapse: 25114.12245 }, { name: '3 1/2', name2: '17.000', od: 3.5, id: 2.44, burst: 29150.000, collapse: 28269.55102 }, { name: '4    ', name2: '9.500', od: 4, id: 3.548, burst: 10876.250, collapse: 7908.915 }, { name: '4    ', name2: '10.700', od: 4, id: 3.478, burst: 12608.750, collapse: 11058.105 }, { name: '4    ', name2: '13.200', od: 4, id: 3.34, burst: 15881.250, collapse: 16652.625 }, { name: '4    ', name2: '16.100', od: 4, id: 3.17, burst: 19971.875, collapse: 20456.90625 }, { name: '4    ', name2: '18.900', od: 4, id: 3, burst: 24062.500, collapse: 24062.5 }, { name: '4    ', name2: '22.200', od: 4, id: 2.78, burst: 29356.250, collapse: 28433.625 }, { name: '4 1/2', name2: '9.500', od: 4.5, id: 4.09, burst: 8769.444, collapse: 10287.75961 }, { name: '4 1/2', name2: '10.500', od: 4.5, id: 4.052, burst: 9582.222, collapse: 5556.742222 }, { name: '4 1/2', name2: '11.600', od: 4.5, id: 4, burst: 10694.444, collapse: 7578.444444 }, { name: '4 1/2', name2: '12.600', od: 4.5, id: 3.958, burst: 11592.778, collapse: 9211.357778 }, { name: '4 1/2', name2: '13.500', od: 4.5, id: 3.92, burst: 12405.556, collapse: 10688.75556 }, { name: '4 1/2', name2: '15.100', od: 4.5, id: 3.826, burst: 14416.111, collapse: 14343.37111 }, { name: '4 1/2', name2: '17.000', od: 4.5, id: 3.74, burst: 16255.556, collapse: 17008.98765 }, { name: '4 1/2', name2: '18.900', od: 4.5, id: 3.64, burst: 18394.444, collapse: 19013.4321 }, { name: '4 1/2', name2: '21.500', od: 4.5, id: 3.5, burst: 21388.889, collapse: 21728.39506 }, { name: '4 1/2', name2: '23.700', od: 4.5, id: 3.8, burst: 23955.556, collapse: 23970.76543 }, { name: '4 1/2', name2: '26.100', od: 4.5, id: 3.24, burst: 26950.000, collapse: 26488 }],
    'cra125': [{ name: '1    ', name2: '1.140', od: 1.05, id: 0.824, burst: 27708.333, collapse: 27655.55556 }, { name: '1    ', name2: '1.480', od: 1.05, id: 0.742, burst: 32083.333, collapse: 31288.88889 }, { name: '1 1/3', name2: '1.700', od: 1.315, id: 1.049, burst: 22124.525, collapse: 22727.81159 }, { name: '1 1/3', name2: '2.190', od: 1.315, id: 0.957, burst: 29776.616, collapse: 29398.14079 }, { name: '1 2/3', name2: '2.090', od: 1.66, id: 1.41, burst: 16472.139, collapse: 15999.0753 }, { name: '1 2/3', name2: '2.300', od: 1.66, id: 1.36, burst: 18448.795, collapse: 19306.14022 }, { name: '1 2/3', name2: '3.030', od: 1.66, id: 1.278, burst: 25169.428, collapse: 25455.34548 }, { name: '1 8/9', name2: '2.400', od: 1.9, id: 1.65, burst: 14391.447, collapse: 12148.01316 }, { name: '1 8/9', name2: '2.750', od: 1.9, id: 1.61, burst: 16694.079, collapse: 16409.85526 }, { name: '1 8/9', name2: '3.650', od: 1.9, id: 1.5, burst: 23026.316, collapse: 23545.70637 }, { name: '1 8/9', name2: '4.420', od: 1.9, id: 1.4, burst: 28782.895, collapse: 28566.48199 }, { name: '1 8/9', name2: '5.150', od: 1.9, id: 1.3, burst: 34539.474, collapse: 33240.99723 }, { name: '2 3/8', name2: '4.000', od: 2.375, id: 2.041, burst: 15381.579, collapse: 13980.60526 }, { name: '2 3/8', name2: '4.600', od: 2.375, id: 1.996, burst: 17500.000, collapse: 17901.5 }, { name: '2 3/8', name2: '5.800', od: 2.375, id: 1.867, burst: 23394.737, collapse: 23877.4072 }, { name: '2 3/8', name2: '6.600', od: 2.375, id: 1.785, burst: 27171.053, collapse: 27195.56787 }, { name: '2 3/8', name2: '7.350', od: 2.375, id: 1.703, burst: 30947.368, collapse: 30364.72022 }, { name: '2 7/8', name2: '6.400', od: 2.875, id: 2.441, burst: 16510.870, collapse: 16070.76087 }, { name: '2 7/8', name2: '7.800', od: 2.875, id: 2.323, burst: 21000.000, collapse: 21696 }, { name: '2 7/8', name2: '8.600', od: 2.875, id: 2.259, burst: 23434.783, collapse: 23913.37618 }, { name: '2 7/8', name2: '9.350', od: 2.875, id: 2.195, burst: 25869.565, collapse: 26068.80907 }, { name: '2 7/8', name2: '10.500', od: 2.875, id: 2.091, burst: 29826.087, collapse: 29439.2741 }, { name: '2 7/8', name2: '11.500', od: 2.875, id: 1.995, burst: 33478.261, collapse: 32405.29301 }, { name: '3 1/2', name2: '7.700', od: 3.5, id: 3.062, burst: 13500.000, collapse: 10498.07143 }, { name: '3 1/2', name2: '9.200', od: 3.5, id: 2.992, burst: 15875.000, collapse: 14893.85714 }, { name: '3 1/2', name2: '10.200', od: 3.5, id: 2.922, burst: 18062.500, collapse: 18942.60714 }, { name: '3 1/2', name2: '12.700', od: 3.5, id: 2.75, burst: 23437.500, collapse: 23915.81633 }, { name: '3 1/2', name2: '14.300', od: 3.5, id: 2.64, burst: 26875.000, collapse: 26940.81633 }, { name: '3 1/2', name2: '15.500', od: 3.5, id: 2.548, burst: 28750.000, collapse: 28538.77551 }, { name: '3 1/2', name2: '17.000', od: 3.5, id: 2.44, burst: 33125.000, collapse: 32124.4898 }, { name: '4    ', name2: '9.500', od: 4, id: 3.548, burst: 12359.375, collapse: 8386.9375 }, { name: '4    ', name2: '10.700', od: 4, id: 3.478, burst: 14328.125, collapse: 12030.8125 }, { name: '4    ', name2: '13.200', od: 4, id: 3.34, burst: 18046.875, collapse: 18913.6875 }, { name: '4    ', name2: '16.100', od: 4, id: 3.17, burst: 22695.313, collapse: 23246.48438 }, { name: '4    ', name2: '18.900', od: 4, id: 3, burst: 27343.750, collapse: 27343.75 }, { name: '4    ', name2: '22.200', od: 4, id: 2.78, burst: 33359.375, collapse: 32310.9375 }, { name: '4 1/2', name2: '9.500', od: 4.5, id: 4.09, burst: 9965.278, collapse: 11992.4418 }, { name: '4 1/2', name2: '10.500', od: 4.5, id: 4.052, burst: 10888.889, collapse: 13103.9418 }, { name: '4 1/2', name2: '11.600', od: 4.5, id: 4, burst: 12152.778, collapse: 8004.555556 }, { name: '4 1/2', name2: '12.600', od: 4.5, id: 3.958, burst: 13173.611, collapse: 9893.972222 }, { name: '4 1/2', name2: '13.500', od: 4.5, id: 3.92, burst: 14097.222, collapse: 11603.44444 }, { name: '4 1/2', name2: '15.100', od: 4.5, id: 3.826, burst: 16381.944, collapse: 15832.13889 }, { name: '4 1/2', name2: '17.000', od: 4.5, id: 3.74, burst: 18472.222, collapse: 19328.39506 }, { name: '4 1/2', name2: '18.900', od: 4.5, id: 3.64, burst: 20902.778, collapse: 21606.17284 }, { name: '4 1/2', name2: '21.500', od: 4.5, id: 3.5, burst: 24305.556, collapse: 24691.35802 }, { name: '4 1/2', name2: '23.700', od: 4.5, id: 3.8, burst: 27222.222, collapse: 27239.50617 }, { name: '4 1/2', name2: '26.100', od: 4.5, id: 3.24, burst: 30625.000, collapse: 30100 }],
    'cra140': [{ name: '1    ', name2: '1.140', od: 1.05, id: 0.824, burst: 31033.333, collapse: 30974.22222 }, { name: '1    ', name2: '1.480', od: 1.05, id: 0.742, burst: 35933.333, collapse: 35043.55556 }, { name: '1 1/3', name2: '1.700', od: 1.315, id: 1.049, burst: 24779.468, collapse: 25455.14898 }, { name: '1 1/3', name2: '2.190', od: 1.315, id: 0.957, burst: 33349.810, collapse: 32925.91768 }, { name: '1 2/3', name2: '2.090', od: 1.66, id: 1.41, burst: 18448.795, collapse: 17412.53012 }, { name: '1 2/3', name2: '2.300', od: 1.66, id: 1.36, burst: 20662.651, collapse: 21583.43373 }, { name: '1 2/3', name2: '3.030', od: 1.66, id: 1.278, burst: 28189.759, collapse: 28509.98694 }, { name: '1 8/9', name2: '2.400', od: 1.9, id: 1.65, burst: 16118.421, collapse: 13022.10526 }, { name: '1 8/9', name2: '2.750', od: 1.9, id: 1.61, burst: 18697.368, collapse: 17880.84211 }, { name: '1 8/9', name2: '3.650', od: 1.9, id: 1.5, burst: 25789.474, collapse: 26371.19114 }, { name: '1 8/9', name2: '4.420', od: 1.9, id: 1.4, burst: 32236.842, collapse: 31994.45983 }, { name: '1 8/9', name2: '5.150', od: 1.9, id: 1.3, burst: 38684.211, collapse: 37229.9169 }, { name: '2 3/8', name2: '4.000', od: 2.375, id: 2.041, burst: 17227.368, collapse: 15111.36211 }, { name: '2 3/8', name2: '4.600', od: 2.375, id: 1.996, burst: 19600.000, collapse: 19581.4 }, { name: '2 3/8', name2: '5.800', od: 2.375, id: 1.867, burst: 26202.105, collapse: 26742.69607 }, { name: '2 3/8', name2: '6.600', od: 2.375, id: 1.785, burst: 30431.579, collapse: 30459.03601 }, { name: '2 3/8', name2: '7.350', od: 2.375, id: 1.703, burst: 34661.053, collapse: 34008.48665 }, { name: '2 7/8', name2: '6.400', od: 2.875, id: 2.441, burst: 18492.174, collapse: 17494.25565 }, { name: '2 7/8', name2: '7.800', od: 2.875, id: 2.323, burst: 23520.000, collapse: 24299.52 }, { name: '2 7/8', name2: '8.600', od: 2.875, id: 2.259, burst: 26246.957, collapse: 26782.98132 }, { name: '2 7/8', name2: '9.350', od: 2.875, id: 2.195, burst: 28973.913, collapse: 29197.06616 }, { name: '2 7/8', name2: '10.500', od: 2.875, id: 2.091, burst: 33405.217, collapse: 32971.98699 }, { name: '2 7/8', name2: '11.500', od: 2.875, id: 1.995, burst: 37495.652, collapse: 36293.92817 }, { name: '3 1/2', name2: '7.700', od: 3.5, id: 3.062, burst: 15120.000, collapse: 11141.08 }, { name: '3 1/2', name2: '9.200', od: 3.5, id: 2.992, burst: 17780.000, collapse: 16152.52 }, { name: '3 1/2', name2: '10.200', od: 3.5, id: 2.922, burst: 20230.000, collapse: 20768.32 }, { name: '3 1/2', name2: '12.700', od: 3.5, id: 2.75, burst: 26250.000, collapse: 26785.71429 }, { name: '3 1/2', name2: '14.300', od: 3.5, id: 2.64, burst: 30100.000, collapse: 30173.71429 }, { name: '3 1/2', name2: '15.500', od: 3.5, id: 2.548, burst: 32200.000, collapse: 31963.42857 }, { name: '3 1/2', name2: '17.000', od: 3.5, id: 2.44, burst: 37100.000, collapse: 35979.42857 }, { name: '4    ', name2: '9.500', od: 4, id: 3.548, burst: 13842.500, collapse: 8734.27 }, { name: '4    ', name2: '10.700', od: 4, id: 3.478, burst: 16047.500, collapse: 12888.49 }, { name: '4    ', name2: '13.200', od: 4, id: 3.34, burst: 20212.500, collapse: 20735.35 }, { name: '4    ', name2: '16.100', od: 4, id: 3.17, burst: 25418.750, collapse: 26036.0625 }, { name: '4    ', name2: '18.900', od: 4, id: 3, burst: 30625.000, collapse: 30625 }, { name: '4    ', name2: '22.200', od: 4, id: 2.78, burst: 37362.500, collapse: 36188.25 }, { name: '4 1/2', name2: '9.500', od: 4.5, id: 4.09, burst: 11161.111, collapse: 13686.64791 }, { name: '4 1/2', name2: '10.500', od: 4.5, id: 4.052, burst: 12195.556, collapse: 14955.17236 }, { name: '4 1/2', name2: '11.600', od: 4.5, id: 4, burst: 13611.111, collapse: 8298.333333 }, { name: '4 1/2', name2: '12.600', od: 4.5, id: 3.958, burst: 14754.444, collapse: 10452.37333 }, { name: '4 1/2', name2: '13.500', od: 4.5, id: 3.92, burst: 15788.889, collapse: 12401.26667 }, { name: '4 1/2', name2: '15.100', od: 4.5, id: 3.826, burst: 18347.778, collapse: 17222.21333 }, { name: '4 1/2', name2: '17.000', od: 4.5, id: 3.74, burst: 20688.889, collapse: 21632.86667 }, { name: '4 1/2', name2: '18.900', od: 4.5, id: 3.64, burst: 23411.111, collapse: 24198.91358 }, { name: '4 1/2', name2: '21.500', od: 4.5, id: 3.5, burst: 27222.222, collapse: 27654.32099 }, { name: '4 1/2', name2: '23.700', od: 4.5, id: 3.8, burst: 30488.889, collapse: 30508.24691 }, { name: '4 1/2', name2: '26.100', od: 4.5, id: 3.24, burst: 34300.000, collapse: 33712 }]
};

},{}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var gradeQuestion = {
    name: 'grade',
    text: 'Grado de Tubería',
    type: 'multi',
    options: [{ name: 'l80', text: 'L80' }, { name: 'l809', text: 'L80 9' }, { name: 'l8013', text: 'L80 13' }, { name: 'cr13', text: '13% Cr' }, { name: 't95', text: 'T95' }, { name: 'p110', text: 'P110' }, { name: 'sCr13', text: 'S 13% Cr' }, { name: 'cr22', text: '22% Cr' }, { name: 'cr25', text: '25% Cr' }, { name: 'cr1', text: '1% Cr' }, { name: 'cr9', text: '9% Cr' }, { name: 'cr3', text: '3% Cr' }, { name: 'cr5', text: '5% Cr' }, { name: 'j55', text: 'J55' }, { name: 'n80', text: 'N80' }, { name: 'c90', text: 'C90' }, { name: 'c95', text: 'C95' }, { name: 'q125', text: 'Q125' }]
};

exports.default = [gradeQuestion, {
    name: 'systemType',
    text: 'Tipo de Sistema',
    type: 'multi',
    options: [{
        name: 'gc',
        text: 'Gas Condensado'
    }, {
        name: 'liq',
        text: 'Líquido'
    }]
}, {
    name: 'gasGradient',
    text: 'Gradiente de gas (psi/ft)',
    type: 'numeric',
    show: function show(state) {
        return state.answers.systemType === 'gc';
    }
}, {
    name: 'hGasket',
    text: 'Altura Empaque (ft)',
    type: 'numeric'
}, {
    name: 'tvd',
    text: 'TVD (ft)',
    type: 'numeric'
}, {
    name: 'p',
    text: 'Presión estática (psi)',
    type: 'numeric'
}, {
    name: 'rhoBrine',
    text: 'Densidad de la Salmuera (ppg)',
    type: 'numeric'
}, {
    name: 'id',
    text: 'ID tubing (in)',
    type: 'numeric',
    precision: 3
}, {
    name: 'od',
    text: 'OD tubing (in)',
    type: 'numeric',
    precision: 3
}, {
    name: 'api',
    text: 'Gravedad API',
    type: 'numeric'
}, {
    name: 'waterCut',
    text: 'Corte de Agua (fracción)',
    type: 'numeric'
}, {
    name: 'rhoW',
    text: 'Densidad del Agua (ppg)',
    type: 'numeric'
}];

},{}],43:[function(require,module,exports){
(function (global){
'use strict';

var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

$('.success-panel, .error-panel').addClass('alert fade in');
$().alert();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],44:[function(require,module,exports){
(function (global){
'use strict';

require('./app');

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _reactDom = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _PipeBurst = require('./Components/PipeBurst.jsx');

var _PipeBurst2 = _interopRequireDefault(_PipeBurst);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $app = document.getElementById('app');

function getQueryParams(qs) {
    var normalized = qs.replace(/\+/g, ' ');

    var params = {},
        re = /[?&]?([^=]+)=([^&]*)/g;
    var tokens = void 0;
    while ((tokens = re.exec(normalized)) !== null) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }return params;
}

var _getQueryParams = getQueryParams(document.location.search),
    grado = _getQueryParams.grado,
    sistema = _getQueryParams.sistema;

_reactDom2.default.render(_react2.default.createElement(_PipeBurst2.default, { grade: grado, systemType: sistema }), $app);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Components/PipeBurst.jsx":40,"./app":43}]},{},[44]);

//# sourceMappingURL=pipe_burst.js.map
