(function (root, Backbone, _, Handlebars) {

  "use strict";

  // Top-level namespace.
  var Zeppelin;

  if (typeof exports !== 'undefined') {
    Zeppelin = exports;
  } else {
    Zeppelin = root.Zeppelin = {};
  }

  // Get the DOM manipulator for later use.
  Zeppelin.$ = Backbone.$;

  // Current Version of the library.
  Zeppelin.VERSION = '0.0.1-alpha';

  Zeppelin.error = function (message, name) {
    var error = new Error(message);
    error.name = name || 'Error';
    throw error;
  };

  // Borrow the Backbone `extend` method.
  Zeppelin.extend = Backbone.Model.extend;

  // Returns true if the element passed is a textfield.
  Zeppelin.isTextfield = function (element) {
    var $element = Zeppelin.$(element);
    return $element.is('input, textarea') && $element.is(':radio, :checkbox');
  };

  // Returns true if the element passed is a form element.
  Zeppelin.isFormField = function (element) {
    return Zeppelin.$(element).is('input, textarea, select');
  };

  // Returns true if the object passed is a jQuery object.
  Zeppelin.isJqueryObject = function (obj) {
    return obj instanceof jQuery;
  };

  // Capitalizes the first letter of the passed string.
  Zeppelin.capitalizeFirst = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Returns an object with URL query parameters given a string.
  Zeppelin.parseQueryString = function (str) {
    str = str.trim().replace(/^\?/, '');

    if (!str) return false;

    _.reduce(str.trim().split('&'), function (obj, param) {
      var parts = param.replace(/\+/g, ' ').split('=');
      obj[parts[0]] = parts[1] ? decodeURIComponent(parts[1]) : null;
      return obj;
    });
  };

  // Used by handlebars.JavaScriptCompiler.prototype.nameLookup to get
  // properties from the template's context.
  Zeppelin.getHandlebarsAttribute = function (obj, key) {
    var obj = obj.context ? obj.context() : obj;

    if (/^[0-9]+$/.test(key)) {
      return obj[_.parseInt(key)];
    } else {
      if (obj.moduleName === 'model') {
        return obj.get(key) || _.result(obj, key);
      } else {
        return _.result(obj, key);
      }
    }
  };

  // Translates hash arguments given by Handlebars to usable HTML attributes.
  Zeppelin.parseHandlebarsHash = function (context, hash) {
    return _.map(_.keys(hash), function (name) {
      var value = _.result(hash, name);

      value = value.replace(/\{\{(.*?)\}\}/g, function (m, s) {
        return Zeppelin.getHandlebarsAttribute(context, s);
      });

      if (value) return name + '="' + value + '"';
      return '';
    });
  };

  // Use `Zeppelin.Router` to navigate when clicking an `<a>` element with `[data-route=true]`.
  Zeppelin.$(document).on('click', '[data-route=true]', function (event) {
    // If the link was clicked while holding ctrl/command key let the browser handle it.
    if (!event.metaKey) {
      event.preventDefault();
      Zeppelin.Mediator.trigger('router:redirect', Zeppelin.$(this).attr('href'));
    }
  });

  // Extends Backbone.sync to handle multiple requests on a single model. If a model or collection
  // fires two or more requests at a time only the last one will be fired.
  var sync = Backbone.sync;

  Backbone.sync = function (method, model, options) {
    var lastXHR = model._lastXHR && model._lastXHR[method];

    if ((lastXHR && lastXHR.readyState !== 4) && (options && options.safe !== false)) {
      lastXHR.abort('stale');
    }

    if (!model._lastXHR) model._lastXHR = {};
    model._lastXHR[method] = sync.apply(this, arguments);
  };

  // Initializes and inserts a subview into the template. In Zeppelin, Handlebars templates use
  // views as it's main context. This makes it possible for Handlebars helpers to execute view
  // methods. The `{{view}}` helper initializes a subview by looking for a view with the name of
  // the fist parameter. Any other parameter will be passed to the subview as a property.
  // E.g `{{view "Dropdown" model="User"}}` will initialize a subview who's model property is
  // 'models/User'.
  Handlebars.registerHelper('view', function (path, options) {
    var model, instance, collection, containerMarkup;
    var view = require(path);
    var attributes = [];
    var viewOptions = {};

    if (options.hash.model) {
      model = Zeppelin.Data[options.hash.model];
      if (model) viewOptions.model = model;
    }

    if (options.hash.collection) {
      collection = Zeppelin.Data[options.hash.collection];
      if (collection) viewOptions.collection = collection;
    }

    instance = Zeppelin.View.prototype.initializeSubView.call(this, view, viewOptions);

    delete options.hash.model;
    delete options.hash.collection;

    attributes = Zeppelin.parseHandlebarsHash(this, options.hash);
    containerMarkup = '<div data-container-for=' + instance.cid + ' ' + attributes.join(' ') + '></div>';
    return new Handlebars.SafeString(containerMarkup);
  });

  // Zeppelin.Mediator
  // -----------------
  //
  // Application-wide pubSub.
  Zeppelin.Mediator = _.clone(Backbone.Events);

  // Zeppelin.Events
  // ---------------
  //
  // Adds Application-wide pubSub via Zeppelin.Mediator
  Zeppelin.Events = {
    registerSubscriptions: function (events) {
      var _this = this;
      events = events || this.subscriptions || {};

      _.forOwn(events, function (callback, eventName) {
        callback = _.isFunction(callback) ? callback : _this[callback];
        _this.subscribe(eventName, callback);
      });

      return this;
    },

    publish: function () {
      var args = arguments.length >= 2 ? [].slice.call(arguments, 1) : [];
      var event = arguments[0];
      Zeppelin.Mediator.trigger.apply(Zeppelin.Mediator, [event].concat([].slice.call(args)));
      return this;
    },

    subscribe: function (eventName, callback) {
      this.listenTo(Zeppelin.Mediator, eventName, callback);
      return this;
    },

    subscribeToOnce: function (eventName, callback) {
      this.listenToOnce(Zeppelin.Mediator, eventName, callback);
      return this;
    },

    unsubscribe: function (eventName) {
      this.stopListening(Zeppelin.Mediator, eventName);
      return this;
    },

    unsubscribeAll: function () {
      this.stopListening(Zeppelin.Mediator);
      return this;
    }
  };

  // Zeppelin.Validations
  // --------------------
  //
  // Generic validations.
  Zeppelin.Validations = {
    required: function (value) {
      return value && !_.isEmpty(value) && Zeppelin.$.trim(value) !== '';
    },

    min: function (value, min) {
      return value && _.isNumber(value) && _.isNumber(min) && value >= min;
    },

    max: function (value, max) {
      return value && _.isNumber(value) && _.isNumber(max) && value <= max;
    },

    range: function (value, range) {
      if (value && _.isNumber(value) && _.isArray(range)) {
        var min = _.first(range);
        var max = _.last(range);
        return value >= min && value <= max;
      } else {
        return false;
      }
    },

    length: function (value, length) {
      if (value && _.isNumber(value) && _.isNumber(length)) {
        return value === length;
      } else if (value && _.isString(value) && _.isNumber(length)) {
        return value.length === length;
      } else {
        return false;
      }
    },

    minLength: function (value, min) {
      return value && _.isNumber(min) && value.length >= min;
    },

    maxLength: function (value, max) {
      return value && _.isNumber(max) && value.length <= max;
    },

    rangeLength: function (value, range) {
      if (value && _.isArray(range)) {
        var min = _.first(range);
        var max = _.last(range);
        return value.length >= min && value.length <= max;
      } else {
        return false;
      }
    },

    regexp: function (value, rexexp) {
      return value && _.isRegExp(regexp) && regexp.test(value);
    },

    isEqual: function (value, test) {
      return value && _.isEqual(value, test);
    },

    notEqual: function (value, test) {
      return value && !_.isEqual(value, test);
    },

    oneOf: function (value, types) {
      return value && _.isArray(types) && _.find(types, value);
    },

    isBoolean: function (value) {
      return value && _.isBoolean(value);
    },

    isDate: function (value) {
      return value && _.isDate(new Date(value));
    },

    isArray: function (value) {
      return value && _.isArray(value);
    },

    isString: function (value) {
      return value && _.isString(value);
    },

    isNumber: function (value) {
      return value && _.isNumber(value);
    },

    isEmpty: function (value) {
      return _.isEmpty(value);
    },

    isObject: function (value) {
      return value && _.isObject(value);
    },

    isPlainObject: function (value) {
      return value && _.isPlainObject(value);
    },

    isDigit: function (value) {
      return value && /^\d+$/.test(value);
    },

    isEmail: function (value) {
      return value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },

    isUrl: function (value) {
      return value && /^(ftp|http|https):\/\/[^ "]+$/.test(value);
    },

    isAlphanumeric: function (value) {
      return value && /^\w+$/.test(value);
    },

    isPhone: function (value) {
      return value && /^(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value);
    },

    isDateISO: function (value) {
      return value && /^(\d{4})\D?(0[1-9]|1[0-2])\D?([12]\d|0[1-9]|3[01])$/.test(value);
    }
  };

  // Zeppelin.Storage
  // ----------------
  //
  // localStorage/sessionStorage wrapper.
  Zeppelin.Storage = function (options) {
    options = options || {};
    // `options.store` could be localStorage or sessionStorage.
    this.store = options.store || localStorage;
    this.namespace = options.namespace || _.uniqueId('storage');
  };

  Zeppelin.Storage.prototype.setAll = function (value) {
    this.store.setItem(this.namespace, JSON.stringify(value));
    return this;
  };

  Zeppelin.Storage.prototype.set = function (key, value) {
    var data = this.getAll();

    if (_.isPlainObject(key)) {
      data = _.extend(data, key);
    } else {
      data[key] = value;
    }

    this.setAll(data);
    return this;
  };

  Zeppelin.Storage.prototype.getAll = function () {
    return JSON.parse(this.store.getItem(this.namespace)) || {};
  };

  Zeppelin.Storage.prototype.get = function (key) {
    return this.getAll()[key];
  };

  Zeppelin.Storage.prototype.clearAll = function () {
    this.store.removeItem(this.namespace);
    return this;
  };

  Zeppelin.Storage.prototype.clear = function (key) {
    var data = this.getAll();
    delete data[key];
    this.setAll(data);
    return this;
  };

  Zeppelin.Storage.prototype.isEmpty = function () {
    return _.isEmpty(this.getAll());
  };

  // Zeppelin.Module
  // ---------------
  //
  // Provides privacy, encapsulation and pubSub.
  Zeppelin.Module = function (options) {
    options = options || {};
    _.extend(this, options);
    this.cid = _.uniqueId(options.moduleName || 'module');
    this.initialize.apply(this, arguments);
  };

  // Add custom event binding and triggering.
  _.extend(Zeppelin.Module.prototype, Backbone.Events);

  // Add global pubSub.
  _.extend(Zeppelin.Module.prototype, Zeppelin.Events);

  // Set up all inheritable `Zeppelin.Model` properties and methods.
  _.extend(Zeppelin.Module.prototype, {
    // Adds allowed options to a module and the rest to the `options` property.
    configure: function (options, allowed) {
      if (allowed) {
        _.extend(this, _.pick(options, allowed));

        if (this.options) {
          _.extend(this.options, _.omit(options, allowed));
        } else {
          this.options = _.omit(options, allowed);
        }
      } else {
        if (this.options) {
          _.extend(this.options, options);
        } else {
          this.options = options;
        }
      }
    },

    initialize: function () {}
  });

  Zeppelin.Module.extend = Zeppelin.extend;


  // Zeppelin.Dispatcher
  // -------------------
  //
  // Listens to the `Zeppelin.Router` for url changes and initializes the required controller
  // for the current url.
  Zeppelin.Dispatcher = Zeppelin.Module.extend({
    moduleName: 'dispatcher',

    initialize: function () {
      this.registerSubscriptions();
    },

    subscriptions: {
      'router:route': 'dispatch'
    },

    // Initializes a controller based on the current `route` and executes it's specified `action`.
    dispatch: function (route, controller, action, data) {
      var Controller;
      var controllerName = Zeppelin.capitalizeFirst(controller);

      if (this.current && this.current.name !== controllerName) {
        this.current.dispose();
      }

      Controller = require('controllers/' + controllerName);
      this.current = new Controller();
      this.current.insert('#application');

      if (action) this.current[action](data);
    }
  });

  // Zeppelin.Router
  // ---------------
  //
  // Extends `Backbone.Router` and adds convenience methods for interacting with `Backbone.history.
  Zeppelin.Router = Backbone.Router.extend({
    constructor: function (options) {
      options = options || {};
      if (options.routes) this.routes = options.routes;
      this.cid = _.uniqueId('router');
      this.moduleName = 'router';
      this.registerSubscriptions();
      this.registerRoutes();
      this.initialize.apply(this, arguments);
    },

    subscriptions: {
      'router:redirect': 'goTo'
    },

    // Executes `Backbone.history.start` with the given options.
    start: function (options) {
      options = options || {};
      if (!Backbone.history.started) Backbone.history.start(options);
    },

    // Executes `Backbone.history.stop`.
    stop: function () {
      if (Backbone.history.started) Backbone.history.stop();
    },

    // Reloads the browser.
    reload: function () {
      window.location.reload();
    },

    // Navigates to the given url and triggers a route.
    goTo: function (url) {
      if (url !== this.url().hash) this.navigate(url, {
        trigger: true
      });
    },

    // Returns information about the current url.
    url: function () {
      var urlAttributes = ['hash', 'host', 'hostname', 'href', 'search', 'origin', 'pathname', 'port', 'protocol'];

      return _.pick(window.location, urlAttributes);
    },

    // Goes through the `this.routes` hash and binds them to `Backbone.history`
    // using the `this.route` method. When a route is matched, the callback
    // function will fire a `router:route` event that is listened by
    // `Zeppelin.Dispatcher`. The dispatcher will initialize the controller
    // for the current route.
    //
    // `this.routes` is a hash that maps urls to controller actions:
    //
    // Example:
    //
    //  {
    //    'posts': 'posts',
    //    'posts/:id': 'posts#showPost',
    //    'posts/:id/edit': 'posts#editPost'
    //  }
    registerRoutes: function () {
      if (!this.routes) return false;

      var _this = this;

      _.forEach(_.keys(this.routes).reverse(), function (key) {
        var routeSplit = _this.routes[key].split('#');
        var controllerName = routeSplit[0];
        var controllerAction = routeSplit[1];

        _this.route(key, controllerName, function () {
          var data = arguments;
          var route = {};
          var dataObj = {};
          var fragment = Backbone.history.getFragment();

          _.forEach(_this.routes, function (handler, url) {
            var dataKeys;
            var handlerSplit = handler.split('#');

            if (_this._routeToRegExp(url).test(fragment)) {
              route[url] = handler;
              controllerName = handlerSplit[0];
              controllerAction = handlerSplit[1];

              // Prepare the data as an object. So instead of defining
              // controller actions like:
              //
              //   showUser: function(name, age, gender) {
              //       console.log(name, age, gender);
              //   }
              //
              // you define them like:
              //
              //   showUser: function(data) {
              //       console.log(data.name, data.age, data.gender);
              //   }
              dataKeys = _.map(url.match(/(\(\?)?:\w+/g), function (match) {
                return match.replace(':', '');
              });

              _.forEach(data, function (argument, index) {
                dataObj[dataKeys[index]] = argument;
              });

              return false;
            }
          });

          _this.publish('router:route', route, controllerName, controllerAction, dataObj);
        });
      });
    }
  });

  _.extend(Zeppelin.Router.prototype, Zeppelin.Module.prototype);

  // Zeppelin.Application
  // --------------------
  //
  // Takes care of initializing `Zeppelin.Dispatcher` and `Zeppelin.Router`. It also loads helpers
  // and configurations specific to your application.
  Zeppelin.Application = Zeppelin.Module.extend({
    constructor: function (options) {
      options = options || {};
      options.routes = options.routes || {};

      // Use this namespace to store collections and models you want to persist through
      // different controllers.
      Zeppelin.Data = {};
      Zeppelin.Dispatcher = new Zeppelin.Dispatcher();
      Zeppelin.Router = new Zeppelin.Router({
        routes: options.routes
      });

      Zeppelin.Module.prototype.constructor.apply(this, arguments);
    },

    start: function () {
      Zeppelin.Router.start();
    }
  });

  // Zeppelin.Model
  // --------------
  //
  // Extends `Backbone.Model` and adds caching models to `localStorage`/`sessionStorage`
  // and attribute validations.
  // Model options that are merged as properties.
  // Other options passed to the view are stored in `this.options`.
  var modelOptions = ['name', 'cache', 'fetchData', 'autoFetch', 'validations', 'localAttributes', 'afterInitialized', 'beforeInitialized'];

  var isDeepAttribute = /\./g;

  Zeppelin.Model = Backbone.Model.extend({
    constructor: function (attributes, options) {
      options = options || {};
      this.cid = _.uniqueId('model');
      this.name = options.name || this.name || this.cid;
      this.moduleName = 'model';
      this.hasFetched = false;
      this.isFetching = false;

      this.storage = new Zeppelin.Storage({
        store: options.store,
        namespace: this.name
      });

      this.configure(options, modelOptions);
      this.registerSubscriptions();
      this.beforeInitialized();
      Backbone.Model.prototype.constructor.apply(this, arguments);
      if (this.autoFetch) this.fetch();
      this.afterInitialized();
    },

    // Empty function by default, override it with your own logic to run before the model is initialized.
    beforeInitialized: function () {

    },

    // Empty function by default, override it with your own logic to run after the model is initialized.
    afterInitialized: function () {

    },

    // `localAttributes` are attributes that you don't want to be sent to the server when calling `save`.
    localAttributes: [],

    // Returns attributes defined in `localAttributes`.
    getlocalAttributes: function () {
      return _.pick(this.attributes, this.localAttributes);
    },

    // Return a shallow copy of the model's attributes for JSON stringification omitting `localAttributes`.
    toJSON: function () {
      return _.omit(this.attributes, this.localAttributes);
    },

    // If true, the model will fetch when initialized.
    autoFetch: false,

    // If true, the model will be cached to `storage` when fetching for the first time.
    // After the model is cached, `fetch` will use `storage` to fetch the model.
    cache: false,

    // Used as `options.data` when calling the `fetch` method. Good for when `autoFetch` is true
    // and you can't pass `options.data`. Can be defined as a function.
    fetchData: {},

    // Fetches the model from the server. If `cache` is true and the model is cached in `storage`
    // the model will fetch it's attributes from `storage`. While the model is fetching, you can
    // use the `isFetching` and `hasFetched` flags to know the state of the model.
    fetch: function (options) {
      options = options || {};
      options.fromCache = options.fromCache || false;
      this.hasFetched = false;
      this.isFetching = true;
      var $d = Zeppelin.$.Deffered();
      var _this = this;

      // If `cache` is true and the model is cached in `storage` get the attributes
      // from `storage`. Fetching from `storage` will behave as an `async` method so
      // doing something like `model.fetch().done(callback)` on a cached model will work.
      if (options.fromCache && (this.cache && !this.storage.isEmpty())) {
        this.trigger('request');
        options.parse = options.parse || false;
        _.extend(this.attributes, this.storage.getAll());
        this.trigger('sync', this, $d, options);
        this.hasFetched = true;
        this.isFetching = false;
        $d.resolve(this.attributes);
      } else {
        var data = _.result(this, 'fetchData');
        if (_.size(data)) options.data = data;

        this.once('sync', function () {
          _this.hasFetched = true;
          _this.isFetching = false;
          if (_this.cache) _this.storage.setAll(_this.attributes);
          $d.resolved(_this.attributes);
        });

        Backbone.Model.prototype.fetch.apply(this, arguments);
      }

      return $d.promise();
    },

    // Returns a deep attribute. E.g `this.getDeepAttribute('name.last')` will return the value of
    // `this.attributes.name.last`.
    getDeepAttribute: function (attribute) {
      if (isDeepAttribute.test(attribute)) {
        var first = this.get(attributes.split('.')[0]);
        var rest = attributes.slice(1).join('.');
        var func = 'try{return first.' + rest + ';}catch(e){return undefined;}';
        if (first) return new Function('first', func)(first);
      }
    },

    // Sets a deep attribute. E.g `this.setDeepAttribute('name.last', 'Rodriguez')` is the equivalent
    // of `this.set({name: {last: 'Rodriguez'}})` and will trigger a `change:name.last` event.
    setDeepAttribute: function (attribute, value, options) {
      if (isDeepAttribute.test(attribute)) {
        options = options || {};
        var obj = '{';
        var attributes = attribute.split('.').slice(1);

        _.forEach(attributes, function (attr, index) {
          obj += '"' + attr + '":';

          if ((index + 1) === attributes.length) {
            obj += /^\d+$/.test(value) ? value : '"' + value + '"';
            _.times(attributes.length, function () {
              obj += '}';
            });
          } else {
            obj += '{';
          }
        });

        obj = JSON.parse(obj);
        this.set(attribute.split('.')[0], obj, options);
        this.trigger('change:' + attribute, this, obj, options);
      }
    },

    // Shortcut for `this.set({attributeName: 'value'}, {silent: true})`).
    setSilent: function (attributeName, value, options) {
      var attributes;

      if (_.isPlainObject(attributeName)) {
        attributes = attributeName;
        options = value;
      } else {
        (attributes = {})[attributeName] = value;
      }

      options = options || {};
      options.silent = true;
      this.set(attributes, options);
    },

    // Shortcut for `this.set({attributeName: 'value'}, {validate: true})`).
    setValidate: function (attributeName, value, options) {
      var attributes;

      if (_.isPlainObject(attributeName)) {
        attributes = attributeName;
        options = value;
      } else {
        (attributes = {})[attributeName] = value;
      }

      options = options || {};
      options.validate = true;
      this.set(attributes, options);
    },

    // Validates given attributes based on the `validations` hash:
    //
    // *{ 'attributeName': validations }*
    //
    // Example:
    //
    //     {
    //         title: [{
    //             required: true,
    //             message: 'A title is required.'
    //         },{
    //             maxLength: 80,
    //             message: 'The title must be less than 80 characters long.'
    //         }],
    //
    //         description: {
    //             maxLength: 140,
    //             message: 'The description must be less than 140 characters long.'
    //        }
    //     }
    //
    // All validation rules are defined in `Zeppelin.Validations`.
    validate: function (attributes) {
      var _this = this;
      var errors = {};
      var isNotValid = false;
      var validAttributes = {};

      _.forOwn(_this.validations, function (validations, attribute) {
        if (_.isFunction(validations)) {
          errors = validations(attributes[attribute]);
        } else {
          var isRequired = _.find(_this.validations[attribute], function (validation) {
            return _.indexOf(_.keys(validation), 'required') !== -1;
          });

          if (!_.isArray(validations)) validations = [validations];
          if (!isRequired && !attributes[attribute]) return false;

          _.forEach(validations, function (validation) {
            _.forOwn(validation, function (value, key) {
              if (!errors[attribute]) {
                if (_.indexOf(_.keys(Zeppelin.Validations), key) !== -1) {
                  if (_.isBoolean(value)) {
                    isNotValid = !Zeppelin.Validations[key](attributes[attribute], value);
                  } else {
                    isNotValid = !Zeppelin.Validations[key](attributes[attribute], value);
                  }

                  if (isNotValid) {
                    errors[attribute] = validation.message || attribute + ' is not valid.';
                  } else if (validation === _.last(validations)) {
                    validAttributes[attribute] = attributes[attribute];
                    _this.trigger('valid', _this, validAttributes);
                    _this.trigger('valid:' + attribute, _this, attribute, attributes[attribute]);
                  }
                }
              }
            });
          });
        }
      });

      if (_.size(errors)) return errors;
    }
  });

  // Add Application-wide pubSub.
  _.extend(Zeppelin.Model.prototype, Zeppelin.Module.prototype);

  // Zeppelin.Collection
  // -------------------
  //
  // Extends `Backbone.Collection` and adds caching models to `localStorage`/`sessionStorage`.
  // Collection options that are merged as properties.
  // Other options passed to the view are stored in `this.options`.
  var collectionOptions = ['name', 'cache', 'autoFetch', 'fetchData', 'afterInitialized', 'beforeInitialized'];

  Zeppelin.Collection = Backbone.Collection.extend({
    constructor: function (attributes, options) {
      options = options || {};
      this.cid = _.uniqueId('collection');
      this.name = options.name || this.name || this.cid;
      this.moduleName = 'collection';
      this.hasFetched = false;
      this.isFetching = false;

      this.storage = new Zeppelin.Storage({
        store: options.store,
        namespace: this.name
      });

      this.configure(options, modelOptions);
      this.registerSubscriptions();
      this.beforeInitialized();
      Backbone.Collection.prototype.constructor.apply(this, arguments);
      if (this.autoFetch) this.fetch();
      this.afterInitialized();
    },

    // Empty function by default, override it with your own logic to run before the collection is initialized.
    beforeInitialized: function () {

    },

    // Empty function by default, override it with your own logic to run after the collection is initialized.
    afterInitialized: function () {

    },

    // If true, the collection will fetch when initialized.
    autoFetch: false,

    // If true, the collection will be cached to `storage` when fetching for the first time.
    // After the collection is cached, `fetch` will use `storage` to fetch the collection.
    cache: false,

    // Used as `options.data` when calling the `fetch` method. Good for when `autoFetch` is true
    // and you can't pass `options.data`. Can be defined as a function.
    fetchData: {},

    // Fetches the collection from the server. If `cache` is true and the collection is cached in
    // `storage` the collection will fetch it's models from `storage`. While the collection is fetching,
    // you can use the `isFetching` and `hasFetched` flags to know the state of the collection.
    fetch: function (options) {
      options = options || {};
      options.fromCache = options.fromCache || false;
      this.hasFetched = false;
      this.isFetching = true;
      var $d = Zeppelin.$.Deffered();
      var _this = this;

      // If `cache` is true and the collection is cached in `storage` get the models
      // from `storage`. Fetching from `storage` will behave as an `async` method so
      // doing something like `collection.fetch().done(callback)` on a cached collection will work.
      if (options.fromCache && (this.cache && !this.storage.isEmpty())) {
        this.trigger('request');
        options.parse = options.parse || false;
        this[options.update ? 'update' : 'reset'](this.storage.getAll(), options);
        this.hasFetched = true;
        this.isFetching = false;
        this.trigger('sync', this, $d, options);
        $d.resolve(this.models);
      } else {
        var data = options.data || _.result(this, 'fetchData');
        if (_.size(data)) options.data = data;

        this.once('sync', function () {
          _this.hasFetching = true;
          _this.isFetching = false;
          if (_this.cache) _this.storage.setAll(_this.toJSON());
          $d.resolve(_this.models);
        });

        Backbone.Collection.prototype.fetch.apply(this, arguments);
      }

      return $d.promise();
    }
  });

  // Add Application-wide pubSub.
  _.extend(Zeppelin.Collection.prototype, Zeppelin.Module.prototype);

  // Zeppelin.View
  // -------------
  //
  // Extends `Backbone.View` and adds features like cached elements, automatic rendering,
  // view extendability and memory management.
  // View options that are merged as properties.
  // Other options passed to the view are stored in `this.options`.
  var viewOptions = ['el', 'id', 'name', 'model', 'events', 'render', 'tagName', 'context', 'elements', 'template', 'container', 'className', 'initialize', 'attributes', 'collection', 'keepElement', 'subscriptions', 'afterRendered', 'afterInserted', 'afterUnplugged', 'beforeRendered', 'beforeInserted', 'beforeDisposed', 'beforeUnplugged', 'containerMethod', 'afterInitialized', 'beforeInitialized', 'afterInsertingSubViews', 'beforeInsertingSubViews'];

  Zeppelin.View = Backbone.View.extend({
    constructor: function (options) {
      options = options || {};
      this.cid = _.uniqueId('view');
      this.name = options.name || this.name || this.cid;
      this.state = 'idle';
      this.subviews = {};
      this.moduleName = 'view';
      this.isRendered = false;
      this.isInserted = false;
      this.firstRender = true;
      this.elementsCached = false;

      this.configure(options, viewOptions);
      this.registerSubscriptions();
      this._ensureElement();
      if (this.model) this.setModel(this.model);

      this.state = 'initialized';
      this.beforeInitialized();
      this.initialize.apply(this, arguments);
      this.afterInitialized();

      this.delegateEvents();
    },

    // Empty function by default, override it with your own logic to run before the view is initialized.
    beforeInitialized: function () {

    },

    // Empty function by default, override it with your own logic to run after the view is initialized.
    afterInitialized: function () {

    },

    // If true, the element won't be removed from the `document` when disposing the view.
    keepElement: false,

    // Extends the original `Backbone.View.setElement` to call the `setContainer` and `cacheElements`
    // methods after setting an element for the View.
    setElement: function () {
      Backbone.View.prototype.setElement.apply(this, arguments);
      this.setContainer();
      this.cacheElements();
    },

    // Caches all elements where `elements` is a hash of:
    //
    // *{ 'elementName': 'elementSelector' }*
    //
    //  Example:
    //
    //  {
    //      'header': 'div.header',
    //      'saveBtn': 'button[data-action=save]',
    //      'mainContent': '#content'
    //  }
    cacheElements: function (elements) {
      var _this = this;

      // Add new elements hash to the view's elements hash so that if `cacheElements` is called again
      // the new elements get cached again.
      if (elements && this.elements) _.defaults(this.elements, elements);

      elements = elements || this.elements;

      if (_.size(elements)) {
        _.forOwn(elements, function (selector, name) {
          this.cacheElement(name, selector);
        });

        this.elementsCached = true;
      }

      return this;
    },

    // Caches a single element to `this.$[elementName]`.
    cacheElement: function (name, selector) {
      if (name !== 'el') {
        this['$' + name] = this.$el.find(selector);
        this.elements[name] = selector;
        return this['$' + name];
      }
    },

    // Delegates events where `events` is a hash of:
    //
    // *{ 'event selector': 'callback' }*
    //
    // Example:
    //
    //     {
    //         'click .open': function(e) { ... },
    //         'click .button': 'save',
    //         'mousedown .title': 'edit'
    //     }
    //
    // It uses the same logic as `delegateEvents` but it lets you delegate events at
    // any point in your View's lifetime whereas `Backbone.View.delegateEvents` only delegates events
    // in the `events` hash and calls `undelegateEvents` which is not practical when delegating
    // events "after the fact". All event handlers delegated with the `delegate` method are removed
    // when `undelegateEvents` is called.
    delegate: function (events) {
      if (events && _.size(events)) {
        var _this = this;

        _.forOwn(events, function (callback, eventSelector) {
          var method = _.isFunction(callback) ? callback : _this[callback];
          if (!method) return false;
          method = _.bind(method, _this);

          var eventSelectorSplit = eventSelector.split(' ');
          var eventName = eventSelectorSplit[0];
          var selector = eventSelectorSplit[1];
          eventName += '.delegateEvents' + _this.cid;

          if (selector) {
            _this.$el.on(eventName, selector, method);
          } else {
            _this.$el.on(eventName, methods);
          }

          _this.events[eventSelector] = callback;
        });
      }

      return this;
    },

    // Removes any event handler attached by either `delegate` or `delegateEvents`.
    undelegate: function (event, selector) {
      if (selector) {
        this.$el.off(event + '.delegateEvents' + this.cid, selector);
      } else {
        this.$el.off(event + '.delegateEvents' + this.cid);
      }

      return this;
    },

    // Returns the context used on the template. By default, the template's `context` is `options`.
    // If the view has a model or collection then it's used as it's template's `context`.
    // You can override this method to return any `object` to be used as the template's `context`.
    context: function () {
      return this.model || this.collection || this.options || {};
    },

    // Creates or uses a model for the view.
    setModel: function (model) {
      this.model = model || this.model || Zeppelin.Model;
      if (_.isFunction(this.model)) this.model = new this.model();
      return this.model;
    },

    // Checks if the method passed is a valid method for inserting the view into the `document`.
    _isValidContainerMethod: function (method) {
      return method && (method === 'html' || method === 'append' || method === 'prepend');
    },

    // Sets the `container` for the view. The `container` is the element where the `template` is
    // going to be rendered. If you assign an element to a view using `setElement` or in it's
    // constructor and you only want to change a specific element within `$el`, you can specify
    // a container. `$el` is the `container` by default.
    //
    // Example:
    //     <div class="content">
    //         <!-- Will not change. -->
    //         <h1>The title</h1>
    //
    //         <div class="content-inside">
    //             <!-- Will change. -->
    //             <p>The content</p>
    //         </div>
    //     </div>
    //
    //     view.setElement 'div.content'
    //     view.setContainer 'div.content-inside'
    //     view.render() # Will change the contents of `div.content-inside` not `div.content`.
    setContainer: function (container) {
      var $container = this.$el.find(container);
      this.container = $container.length ? $container : this.$el;
      if (!this._isValidContainerMethod(this.containerMethod)) this.containerMethod = 'html';
      return this.container;
    },

    // Renders the given `template` to the `container`. If no template is passed, then it
    // renders the view's `template`.
    renderToContainer: function (template) {
      this.container[this.containerMethod](this.renderTemplate(template || this.template));
      return this;
    },

    // Renders the given `template` to the `container`. If no template is passed, then it
    // renders the view's `template`.
    renderTemplate: function (template) {
      template = template || this.template;
      return template(this);
    },

    // Empty function by default, override it with your own logic to run before the view is rendered.
    beforeRendered: function () {

    },

    // Empty function by default, override it with your own logic to run after the view is rendered.
    afterRendered: function () {

    },

    // Render the `View`, cache elements and insert `subviews`. Rendering the `View` will not
    // insert `@el` into the `document`. If the `View` was generated via the `{{view}}` helper or if
    // it wasn't given an `el` property when instantiating, it will not be inserted into the
    // `document` by default.
    render: function (template) {
      this.state = 'rendered';
      this.beforeRendered();
      this.renderToContainer(template || this.template);
      this.cacheElements();
      this.isRendered = true;
      this.firstRender = false;
      this.afterRendered();
      if (this.isInserted) this.insertSubViews();
      return this;
    },

    // Empty function by default, override it with your own logic to run before the view is inserted.
    beforeInserted: function () {

    },

    // Empty function by default, override it with your own logic to run after the view is inserted.
    afterInserted: function () {

    },

    // Inserts the `View` to the given element using `append`, `prepend` or `html` if a `method` is
    // passed (`html` is the default insert method). If the `View` isn't rendered it will be rendered
    // before inserting it. After inserting the view all of it's `subviews` are inserted (this
    // will cascade down to the last subview).
    insert: function (target, method) {
      this.state = 'inserted';
      this.beforeInserted();
      var $target = Zeppelin.isJqueryObject(target) ? target : Zeppelin.$(target);
      if (!this._isValidContainerMethod(method)) method = 'html';
      if (!this.isRendered) this.render();
      $target[method](this.el);
      this.isInserted = true;
      this.afterInserted();
      this.insertSubViews();
      return this;
    },

    // Empty function by default, override it with your own logic to run before the view is unplugged.
    beforeUnplugged: function () {

    },

    // Empty function by default, override it with your own logic to run after the view is unplugged.
    afterUnplugged: function () {

    },

    // Removes all event handlers from the view without removing it from the `document`. It will
    // remove every event handler added via `delegateEvents` and `delegate` and any other event
    // handlers added to `elements` at any point in your view (e.g `this.$btn.on('click', this.onClick)`).
    // It will also remove any event handlers added via `on`, `once`, `listenTo`, `listenToOnce`,
    // `subscribe` and `subscribeToOnce` as well as all event handlers of it's subviews.
    unplug: function () {
      this.state = 'unplugged';
      this.beforeUnplugged();
      this.stopListening();
      this.off();
      this.undelegateEvents();
      this.$el.off();

      _.forOwn(this.elements, function (element) {
        element.off();
      });

      this.unplugSubViews();
      this.afterUnplugged();
      return this;
    },

    // Empty function by default, override it with your own logic to run before the view is disposed.
    beforeDisposed: function () {

    },

    // Disposes a view and all of it's subviews. It will unplug it and remove all properties from
    // the instance before freezing it. You can keep the element by adding the `keepElement`
    // flag, otherwise the element will be removed from the `document`. Once a view is disposed, the
    // instance becomes immutable and it's no longer in memory (assuming you are not
    // referencing it in other views).
    dispose: function () {
      var _this = this;
      this.state = 'disposed';
      this.beforeDisposed();
      this.unplug();
      this.disposeSubViews();
      if (!this.keepElement) this.$el.remove();

      _.forEach(viewOptions, function (property) {
        delete _this[property];
      });

      Object.freeze(this);
    },

    // Subviews
    // --------
    //
    // The concept of subviews is simple; any view can contain another view. Subviews are a
    // great way of splitting functionality for readability and reusability. The lifetime of a
    // subview depends on it's parent so if a parent view is rendered, inserted, unplugged or
    // disposed those changes will cascade down to every subview.
    // Initializes a subview passing the given data (if any).
    initializeSubView: function (View, data) {
      if (!_.isFunction(View)) Zeppelin.error('The first argument must a function.', 'Zeppelin.View.initializeSubView');
      var subview = new View(data || {});
      subview.parent = this;
      this.subviews[subview.cid] = subview;
      return subview;
    },

    // Inserts a subview into the given element.
    insertSubView: function (subview, target, method) {
      // When a subview is initialized via the `{{view}}` helper an element with a
      // `[data-container-for]` attribute is created to know where to insert the subview.
      // If `target` is undefined look for `[data-container-for]` by default.
      if (!target) {
        target = this.$el.find('[data-container-for=' + subview.cid + ']');
        if (!target.length) {
          target = this.container;
          method = 'append';
        }
      }

      subview.insert(target, method);
      return subview;
    },

    // Empty function by default, override it with your own logic to run before the
    // subviews are inserted into the `document`.
    beforeInsertingSubViews: function () {

    },

    // Empty function by default, override it with your own logic to run after the
    // subviews are inserted into the `document`.
    afterInsertingSubViews: function () {

    },

    // Inserts every subview. This method is used by the `render` and `insert` methods to
    // insert subviews initialized by the `{{view}}` template helper.
    insertSubViews: function () {
      var _this = this;
      this.beforeInsertingSubViews();
      this.forEachSubView(this.insertSubView);
      this.afterInsertingSubViews();
      return this;
    },

    // Run a function for every subview. The callback function will have the subview as an
    // argument.
    forEachSubView: function (callback) {
      var _this = this;

      if (callback && _.isFunction(callback)) {
        _.forOwn(this.subviews, function (subview) {
          callback.call(_this, subview);
        });
      }

      return this;
    },

    //Gets a subview given a cid.
    getSubViewByCid: function (cid) {
      return _.find(this.subviews, function (subview) {
        return subview.cid === cid;
      });
    },

    //Gets a subview given a name.
    getSubViewByName: function (name) {
      return _.find(this.subviews, function (subview) {
        return subview.name === name;
      });
    },

    // Unplugs every subview (will cascade down to every subview).
    unplugSubViews: function () {
      this.forEachSubView(function (subview) {
        subview.unplug();
      });

      return this;
    },

    // Disposes a subview. Use this method instead of subview.dispose() to remove it's reference
    // from `subviews`.
    disposeSubView: function (subview) {
      var cid = subview.cid;
      subview.dispose();
      delete this.subviews[cid];
    },

    // Disposes every subview (will cascade down to every subview).
    disposeSubViews: function () {
      this.forEachSubView(this.disposeSubView);
      this.subviews = {};
    }
  });

  // Add Application-wide pubSub.
  _.extend(Zeppelin.View.prototype, Zeppelin.Module.prototype);

  // Zeppelin.Controller
  // -------------------
  //
  // Initializes views required to render a page. It also fetches and persists data required by it's
  // subviews. It's the equivalent of an `AppView`:
  // (e.g [https://gist.github.com/derickbailey/1182708#file-1-appview-js](),
  // [http://addyosmani.github.io/backbone-fundamentals/#application-view]()).
  // CollectionView options that are merged as properties.
  // Other options passed to the view are stored in `this.options`.
  var controllerOptions = ['title'];

  Zeppelin.Controller = Zeppelin.View.extend({
    constructor: function (options) {
      options = options || {};
      Zeppelin.View.prototype.constructor.apply(this, arguments);
      this.configure(options, controllerOptions);
      this.cid = _.uniqueId('controller');
      this.data = {};
      this.title = this.title || this.name;
      this.moduleName = 'controller';
      this.setTitle();
    },

    // Sets the title for the `document`. The title can be set by overriding `title` or
    // passing a string to a `setTitle`.
    setTitle: function (title) {
      title = title || this.title;
      document.title = title;
      return this;
    },

    // Redirects the browser to the given `route` or url.
    redirect: function (route) {
      this.publish('zeppelin:router:redirect', route);
      return this;
    },

    // Initializes models and collections and persists them in `Zeppelin.Data`.
    persistData: function (source) {
      if (_.isFunction(source)) source = new source();
      if (Zeppelin.Data[source.name]) return false;
      Zeppelin.Data[source.name] = source;
      this[source.name] = source;
      return this;
    }
  });

  // Zeppelin.FormView
  // -----------------
  //
  // A `Zeppelin.View` that binds a form to a model. Every time you submit a FormView,
  // the model associated with the form will be validated and if valid, the model will be saved.
  // FormView options that are merged as properties.
  // Other options passed to the view are stored in `this.options`.
  var formViewOptions = ['form', 'errorClass', 'saveOnSubmit', 'onSaveModelError', 'autoBindModel', 'onSubmitError', 'onSaveModelSuccess', 'afterFormSubmit', 'onSubmitSuccess', 'beforeFormSubmit', 'onValidationError', 'afterSettingAttributes', 'beforeSettingAttributes'];

  Zeppelin.FormView = Zeppelin.View.extend({
    constructor: function (options) {
      options = options || {};
      Zeppelin.View.prototype.constructor.apply(this, arguments);
      this.configure(options, formViewOptions);
      this.cid = _.uniqueId('formView');
      this.moduleName = 'formView';
      this.modelIsBinded = false;
    },

    // If true, the `model.save` will be called when the form is successfully validated and submitted.
    saveOnSubmit: true,

    // The name of the class to be applied to `[data-model-attribute-error]` when an attribute
    // doesn't pass a validation.
    errorClass: 'state-error',

    // Override `Zeppelin.View.setModel` to listen to model events after setting the view's model.
    setModel: function () {
      Zeppelin.View.prototype.setModel.apply(this, arguments);
      this.listenTo(this.model, 'valid', this.onValidationSuccess);
      this.listenTo(this.model, 'change', this.restoreForm);
      this.listenTo(this.model, 'invalid', this.onValidationError);
      return this;
    },

    // Override `Zeppelin.View.render` to set the form element and bind the model to it if
    // `autoBindModel` is true.
    render: function () {
      Zeppelin.View.prototype.render.apply(this, arguments);
      this.setForm();
      if (this.modelIsBinded) this.bindModel();
      return this;
    },

    // Override `Zeppelin.View.dispose` to unbind the model before disposing the view.
    dispose: function () {
      this.unbindModel();
      Zeppelin.View.prototype.dispose.apply(this, arguments);
    },

    // Sets the form the view will use to bind the model. The form element will be cached to
    // `$form` and the view will react to the `submit` event.
    setForm: function (element) {
      var _this = this;
      if (element && Zeppelin.isJqueryObject(element)) element = element[0];
      this.form = element || this.form || this.el;
      var $form = this.$el.find(this.form);
      this.$form = $form.length ? $form : this.$el;

      this.$form.on('submit', function (event) {
        _this.onSubmit(event);
      });

      return this.$form;
    },

    // Empty function by default, override it with your own logic to run before the form is submitted.
    beforeFormSubmit: function () {

    },

    // Empty function by default, override it with your own logic to run after the form is submitted.
    afterFormSubmit: function () {

    },

    // Intercepts the `submit` event to validate and sync the model.
    onSubmit: function (event) {
      var promise;
      event.preventDefault();

      this.beforeFormSubmit();
      this.setAttributes();

      if (!this.model.validationError) {
        if (this.saveOnSubmit) promise = this.saveModel();
      }

      this.afterFormSubmit();
      if (promise) return promise;
    },

    // Options to be passed to the model when saving.
    modelSaveOptions: {},

    // Empty function by default, override it with your own logic to run when saving the model fails.
    onSaveModelError: function () {

    },

    // Empty function by default, override it with your own logic to run after the model is saved.
    onSaveModelSuccess: function () {

    },

    // Saves the model using `onSaveModelError` and `onSaveModelSuccess` as success and error callbacks.
    saveModel: function () {
      var promise = this.model.save(this.modelSaveOptions);
      promise.fail(this.onSaveModelError);
      promise.done(this.onSaveModelSuccess);
      return promise;
    },

    // Gets the value of a `$form` element based on the given attribute name.
    getAttribute: function (name) {
      return this.$form.find('[data-model-attribute=' + name + ']').val();
    },

    // Sets the value of a `$form` element based on the given attribute name.
    setAttribute: function (name, value) {
      this.$form.find('[data-model-attribute=' + name + ']').val(value);
      return this;
    },

    // Empty function by default, override it with your own logic to run before the values from
    // `$form` are set as model attributes.
    beforeSettingAttributes: function () {

    },

    // Empty function by default, override it with your own logic to run after the values from
    // `$form` are set as model attributes.
    afterSettingAttributes: function () {

    },

    // Iterates through all elements in `$form` that are associated with a model attribute and
    // sets the value of the element as a model attribute. This will trigger a validation on the
    // model for each attribute value found in `$form`.
    setAttributes: function () {
      var attributes = {};

      this.beforeSettingAttributes();

      this.$form.find('[data-model-attribute]').each(function (index, element) {
        var value;
        var $element = Zeppelin.$(element);
        var attribute = $element.data('modelAttribute');

        if (Zeppelin.isFormField($element)) {
          if ($element.is('select')) {
            value = Zeppelin.$.trim($element.find('option').filter(':selected').val());
          } else if ($element.is(':radio, :checkbox')) {
            value = Zeppelin.$.trim($element.filter(':checked').val());
          } else {
            value = Zeppelin.$.trim($element.val());
          }

          // If the attribute is something like `'some.thing.else'`
          // then convert it to an object like `{some: {thing: {else: value}}}`.
          if (/\./g.test(attribute)) {
            var obj = '{';
            var rest = attribute.split('.').slice(1);

            _.each(rest, function (attr, index) {
              obj += '"' + attr + '":';

              if ((index + 1) === rest.length) {
                obj += /^\d+$/.test(value) ? value : '"' + value + '"';
                _.times(rest.length, function () {
                  obj += '}';
                });
              } else {
                obj += '{';
              }
            });

            attributes[attribute.split('.')[0]] = JSON.parse(obj);
          } else {
            attributes[attribute] = value;
          }
        }
      });

      this.model.setValidate(attributes);
      this.afterSettingAttributes();
      return this;
    },

    // Validates and sets model attributes automatically on `keyup` and `change` events.
    // If the element is `input[type=radio]`, `input[type=checkbox]` or `select`
    // the attribute associated to it will be validated and set on the model on `change`. If it's
    // a input[type=text], textarea or any other form element that holds text, the attribute will be
    // validated and set on `keyup`. This method namespace the events to avoid collisions with
    // other event handlers attached to the elements.
    bindModel: function () {
      this.$form.find('[data-model-attribute]').each(function (index, element) {
        var value;
        var $element = Zeppelin.$(element);
        var domEvent = Zeppelin.isTextfield($element) ? 'keyup' : 'change';
        var modelAttribute = $element.data('modelAttribute');

        if (!Zeppelin.isFormField($element)) return false;

        domEvent += '.' + modelAttribute;

        $element.on(domEvent, function (event) {
          if ($element.is('select')) {
            value = Zeppelin.$.trim($element.find('option').filter(':selected').val());
          } else if ($element.is(':radio, :checkbox')) {
            value = Zeppelin.$.trim($element.filter(':checked').val());
          } else {
            value = $element.val();
          }

          this.model.setValidate(modelAttribute, value);
        });
      });

      this.modelIsBinded = true;
      return this;
    },

    // Removes namespaced `keyup` and `change` event handlers defined by `bindModel`.
    unbindModel: function () {
      this.$form.find('[data-model-attribute]').each(function (index, element) {
        var $element = Zeppelin.$(element);
        var domEvent = Zeppelin.isTextfield($element) ? 'keyup' : 'change';

        if (!Zeppelin.isFormField($element)) return false;

        $element.off(domEvent + '.' + $element.data('modelAttribute'));
      });

      this.modelIsBinded = false;
      return this;
    },

    // Executed when an attribute validation fails. By default, the `errorClass` will be added to
    // the element associated with the attribute and the error message will be displayed on an
    // element that matches the `[data-model-attribute-error]` selector
    // (e.g span[data-model-attribute-error=title], div[data-model-attribute-error=email]).
    onValidationError: function (model, error) {
      var _this = this;
      _.forOwn(error, function (message, attribute) {
        _this.$form.find('[data-model-attribute=' + attribute + ']').addClass(_this.errorClass);
        _this.$form.find('[data-model-attribute-error=' + attribute + ']').show().text(message);
      });
      return this;
    },

    // Executed when an attribute has been successfully validated. By default, the `errorClass` will
    // be removed from the element associated with the attribute and the error message will be hidden.
    onValidationSuccess: function (model, attributes) {
      var _this = this;
      _.forOwn(attributes, function (value, attribute) {
        _this.$form.find('[data-model-attribute=' + attribute + ']').removeClass(_this.errorClass);
        _this.$form.find('[data-model-attribute-error=' + attribute + ']').text('').hide();
      });
      return this;
    },

    // Removes `errorClass` from all `[data-model-attribute]` elements and hides all error messages.
    restoreForm: function () {
      this.$form.find('[data-model-attribute]').removeClass(this.errorClass);
      this.$form.find('[data-model-attribute-error]').text('').hide();
      return this.$form;
    }
  });

  // Zeppelin.CollectionView
  // -----------------------
  //
  // Extends `Zeppelin.View` to automate rendering collections.
  // CollectionView options that are merged as properties.
  // Other options passed to the view are stored in `this.options`.
  var collectionViewOptions = ['list', 'itemView', 'collection', 'autoUpdate', 'insertMethod', 'afterItemRenders', 'afterItemsRender', 'beforeItemsRender', 'beforeItemRenders'];

  Zeppelin.CollectionView = Zeppelin.View.extend({
    constructor: function (options) {
      options = options || {};
      Zeppelin.View.prototype.constructor.apply(this, arguments);
      this.configure(options, formViewOptions);
      this.cid = _.uniqueId('collectionView');
      this.moduleName = 'collectionView';

      this.setItem();
      this.setCollection();
    },

    // If `autoUpdate` is true, every time `collection` fires an `add` event the model
    // added to the `collection` will be automatically rendered.
    autoUpdate: false,

    // The default method used to add items to the `$list` element.
    insertMethod: 'append',

    // Creates or uses a collection for the view and sets it as it's `context`.
    setCollection: function (collection) {
      this.collection = collection || this.collection || Zeppelin.Collection;
      if (_.isFunction(this.collection)) this.collection = new this.collection();
      return this.collection;
    },

    // Sets the view that all models in the collection will use to render.
    setItemView: function (view) {
      this.itemView = view || this.itemView || Zeppelin.View;
      return this.itemView;
    },

    // Sets the element used to insert item views. If not specified in `list`, all item views
    // will be inserted in `$el`.
    setList: function (element) {
      if (element && Zeppelin.isJqueryObject(element)) element = element[0];
      this.list = element || this.list || this.el;
      var $list = this.$el.find(this.list);
      this.$list = $list.length ? $list : this.$el;
      return this.$list;
    },

    // Empty function by default, override it with your own logic to run before items are rendered.
    beforeItemsRender: function () {

    },

    // Empty function by default, override it with your own logic to run after items are rendered.
    afterItemsRender: function () {

    },

    // Renders the collection to `$list`.
    renderItemsToList: function () {
      if (this.collection.isEmpty) return false;
      this.beforeItemsRender();
      this.fragment = document.createDocumentFragment();
      this.collection.each(this.renderItem);
      this.itemsRendered = true;
      if (this.firstRender) this.$list.html(this.fragment);
      this.afterItemsRender();
      return this;
    },

    // Empty function by default, override it with your own logic to run before an item is rendered.
    beforeItemRenders: function (item) {

    },

    // Empty function by default, override it with your own logic to run after an item is rendered.
    afterItemRenders: function (item) {

    },

    // Renders a single model to `$list`.
    renderItem: function (item) {
      var subview;
      this.beforeItemRenders(item);
      subview = this.initializeSubView(this.itemView, {
        model: item
      });
      subview.render();

      // The first time the collection is rendered, a `DocumentFragment` will be used
      // to minimize browser reflows.
      if (this.isRendered) {
        subview.insert(this.$list, this.insertMethod);
      } else {
        this.fragment.appendChild(subview.el);
      }

      this.afterItemRenders(item);
      return subview;
    },

    // Extends `Zeppelin.View.render` to render the collection when the view is rendered.
    render: function (template) {
      var _this = this;
      this.state = 'rendered';
      this.beforeRendered();
      this.renderToContainer(template || this.template);
      this.setList();
      this.renderItemsToList();
      this.cacheElements();
      this.isRendered = true;
      this.firstRender = false;
      this.afterRendered();

      if (this.autoUpdate && this.itemsRendered) this.listenTo(this.collection, 'add', this.renderItem);
      if (this.collection.isFetching) this.listenToOnce(this.collection, 'sync', function () {
        _this.render();
      });

      return this;
    },

    // Iterates over the elements of `$list`, executing the `callback` for each element.
    forEachItemElement: function (callback) {
      if (!callback || !_.isFunction(callback)) return false;

      callback = _.bind(callback, this);

      this.$list.children().each(function (index, element) {
        callback(index, $(element));
      });

      return this;
    }
  });

  // Zeppelin.WidgetView
  // -------------------
  //
  // Extends `Zeppelin.View` to provides methods to create widgets
  // (e.g modals, dropdowns, popups, etc.).
  var widgetViewOptions = ['afterOpening', 'afterClosing', 'startsHidden', 'beforeOpening', 'beforeClosing', 'disposeOnClose', 'toggler', 'closeOnClickOutside'];

  Zeppelin.WidgetView = Zeppelin.View.extend({
    constructor: function (options) {
      options = options || {};
      Zeppelin.View.prototype.constructor.apply(this, arguments);
      this.configure(options, widgetViewOptions);
      this.cid = _.uniqueId('widgetView');
      this.moduleName = 'widgetView';
    },

    // If true, the element will be hidden when inserted into the `document`.
    startsHidden: true,

    // If true, the element will be hidden when clicking outside of it.
    closeOnClickOutside: true,

    // If true, the widget will be disposed when closed.
    disposeOnClose: false,

    // Override `Zeppelin.View.insert` to set the toggleable element and hide it if
    // `startsHidden` is true.
    insert: function () {
      Zeppelin.View.prototype.insert.apply(this, arguments);
      this.setToggler();
      if (this.startsHidden) this.$toggler.hide();
      this.delegate({
        'click [data-action=close]': 'close'
      });
      return this;
    },

    // Override `Zeppelin.View.dispose` to remove the body click event handler.
    dispose: function () {
      this.unbindOnBodyClick();
      Zeppelin.View.prototype.dispose.apply(this, arguments);
    },

    // Sets the element that will be toggleable. Good for modals, popups, tooltips, menus, etc.
    setToggler: function (element) {
      if (element && Zeppelin.isJqueryObject(element)) element = element[0];
      this.toggler = element || this.toggler || this.el;
      var $toggler = this.$el.find(this.toggler);
      this.$toggler = $toggler.length ? $toggler : this.$el;
      return this.$toggler;
    },

    // Empty function by default, override it with your own logic to run before the toggler
    // element is opened.
    beforeOpening: function () {

    },

    // Empty function by default, override it with your own logic to run after the toggler
    // element is opened.
    afterOpening: function () {

    },

    // Shows the toggler element and sets an event handler to close the element when clicking
    // outside if `closeOnClickOutside` is true.
    open: function () {
      this.state = 'opened';
      this.beforeOpening();
      this.toggler.show();
      if (this.closeOnClickOutside) this.closeOnBodyClick();
      this.afterOpening();
      return this;
    },

    // Empty function by default, override it with your own logic to run before the toggler
    // element is closed.
    beforeClosing: function () {

    },

    // Empty function by default, override it with your own logic to run after the toggler
    // element is closed.
    afterClosing: function () {

    },

    // Hides the toggler element, removes the event handler to close the element when clicking
    // outside if `closeOnClickOutside` is true and disposes the view if `disposeOnClose` is true.
    close: function () {
      this.state = 'closed';
      this.beforeClosing();
      this.$toggler.hide();
      if (this.closeOnClickOutside) this.unbindOnBodyClick();
      if (this.disposeOnClose) this.dispose();
      this.afterClosing();
      return this;
    },

    // Toggles the toggler element.
    toggle: function () {
      if (this.$toggler.is(':visible')) {
        this.close();
      } else {
        this.open();
      }

      return this;
    },

    // Attaches an event handler to the body to close the widget on click.
    closeOnBodyClick: function () {
      var _this = this;

      wait(10, function () {
        Zeppelin.$('body').on('click.' + _this.cid, function (event) {
          var $target = Zeppelin.$(event.target);
          if (!$target.is(_this.$toggler) || !_this.$el.find($target).length) _this.close();
        });
      });

      return this;
    },

    // Removes the event handler to the body to close the widget on click.
    unbindOnBodyClick: function () {
      Zeppelin.$('body').off('click.' + this.cid);
      return this;
    }
  });

  return Zeppelin;
})(this, Backbone, _, Handlebars);
