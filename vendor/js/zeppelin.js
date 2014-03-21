(function (root, Backbone, _) {
  var Zeppelin, Z;

  if (typeof exports !== 'undefined') {
    Zeppelin = exports;
  } else {
    root.Zeppelin = root.Z = Zeppelin = Z = {};
  }

  Zeppelin.VERSION = '0.0.1-alpha';

  Zeppelin.Util = {};

  Zeppelin.Util.isView = function (value) {
    var toString;

    if (!value) return false;

    toString = _.isFunction(value) ? value.prototype.toString() : value.toString();

    return toString === '[object View]';
  };


  Zeppelin.Util.isModel = function (value) {
    var toString;

    if (!value) return false;

    toString = _.isFunction(value) ? value.prototype.toString() : value.toString();

    return toString === '[object Model]';
  };

  Zeppelin.Util.isCollection = function (value) {
    var toString;

    if (!value) return false;

    toString = _.isFunction(value) ? value.prototype.toString() : value.toString();

    return toString === '[object Collection]';
  };

  Zeppelin.Util.is$ = function (value) {
    return value instanceof jQuery;
  };

  Zeppelin.Validations = {
    exists: function (value) {
      if (value === undefined) {
        return false;
      } else if (value === null) {
        return false;
      } else if (_.isNaN(value)) {
        return false;
      } else if (value === Infinity) {
        return false;
      } else {
        return true;
      }
    },

    matchesRegExp: function (value, regexp) {
      if (this.isString(value) && this.isRegExp(regexp)) {
        return regexp.test(value);
      } else {
        return false;
      }
    },

    isEmpty: function (value) {
      if (this.exists(value)) {
        return _.isEmpty(value);
      } else {
        return true;
      }
    },

    isEqual: function (a, b) {
      if (this.exists(a)) {
        return _.isEqual(a, b);
      } else {
        return false;
      }
    },

    isRegExp: function (value) {
      if (this.exists(value)) {
        return _.isRegExp(value);
      } else {
        return false;
      }
    },

    isBoolean: function (value) {
      if (this.exists(value)) {
        return _.isBoolean(value);
      } else {
        return false;
      }
    },

    isObject: function (value) {
      if (this.exists(value)) {
        return _.isObject(value);
      } else {
        return false;
      }
    },

    isPlainObject: function (value) {
      if (this.exists(value)) {
        return _.isPlainObject(value);
      } else {
        return false;
      }
    },

    isArray: function (value) {
      if (this.exists(value)) {
        return _.isArray(value);
      } else {
        return false;
      }
    },

    isString: function (value) {
      if (this.exists(value)) {
        return _.isString(value);
      } else {
        return false;
      }
    },

    isNumber: function (value) {
      if (this.exists(value)) {
        return _.isNumber(value);
      } else {
        return false;
      }
    },

    isOneOf: function (value, types) {
      if (this.exists(value) && this.isArray(types)) {
        return _.indexOf(types, value) !== -1;
      } else {
        return false;
      }
    },

    isDate: function (value) {
      var date;

      if (this.exists(value)) {
        date = new Date(value);
        return date.toString() !== 'Invalid Date' && _.isDate(date);
      } else {
        return false;
      }
    },

    isDateISO: function (value) {
      if (this.isString(value)) {
        return /^(\d{4})\D?(0[1-9]|1[0-2])\D?([12]\d|0[1-9]|3[01])$/.test(value);
      } else {
        return false;
      }
    },

    isDigit: function (value) {
      if (this.isString(value)) {
        return /^-?\d+\.?\d*$/.test(value);
      } else {
        return false;
      }
    },

    isEmail: function (value) {
      if (this.isString(value)) {
        return /^[\+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value);
      } else {
        return false;
      }
    },

    isUrl: function (value) {
      if (this.isString(value)) {
        return /^(ftp|http|https):\/\/[^ "]+$/.test(value);
      } else {
        return false;
      }
    },

    isDomainName: function (value) {
      if (this.isString(value)) {
        return /^(?!:\/\/)([a-zA-Z0-9]+\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,6}?$/.test(value);
      } else {
        return false;
      }
    },

    isAlphanumeric: function (value) {
      if (this.isString(value)) {
        return /^\w+$/.test(value);
      } else {
        return false;
      }
    },

    isPhone: function (value) {
      if (this.isString(value)) {
        return /^(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value);
      } else {
        return false;
      }
    },

    isMinimum: function (value, minimum) {
      if (this.isNumber(value) && this.isNumber(minimum)) {
        return value >= minimum;
      } else {
        return false;
      }
    },

    isMaximum: function (value, maximum) {
      if (this.isNumber(value) && this.isNumber(maximum)) {
        return value <= maximum;
      } else {
        return false;
      }
    },

    isInRange: function (value, range) {
      var minimum, maximum;

      if (this.isNumber(value) && this.isArray(range)) {
        minimum = range[0];
        maximum = _.last(range);

        if (this.isNumber(minimum) && this.isNumber(maximum)) {
          return value >= minimum && value <= maximum;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },

    isOfLength: function (value, length) {
      if (this.exists(value) && value.length !== undefined && this.isNumber(length)) {
        return value.length === length;
      } else {
        return false;
      }
    },

    isOfMinimumLength: function (value, minimum) {
      if (this.exists(value) && value.length !== undefined && this.isNumber(minimum)) {
        return value.length >= minimum;
      } else {
        return false;
      }
    },

    isOfMaximumLength: function (value, maximum) {
      if (this.exists(value) && value.length !== undefined && this.isNumber(maximum)) {
        return value.length <= maximum;
      } else {
        return false;
      }
    },

    isLengthInRange: function (value, range) {
      var minimum, maximum;

      if (this.exists(value) && value.length !== undefined && this.isArray(range)) {
        minimum = range[0];
        maximum = _.last(range);

        if (this.isNumber(minimum) && this.isNumber(maximum)) {
          return value.length >= minimum && value.length <= maximum;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  };

  Zeppelin.Events = {
    registerSubscriptions: function (subscriptions) {
      subscriptions = subscriptions || this.subscriptions;

      if (_.size(subscriptions)) {
        _.forOwn(subscriptions, function (callback, eventName) {
          this.subscribe(eventName, callback);
        }, this);
      }

      return this;
    },

    subscribe: function (eventName, callback) {
      if (!eventName || !callback) return this;
      if (!_.isFunction(callback)) callback = this[callback];
      this.listenTo(Backbone.Events, eventName, callback);
      this.subscriptions[eventName] = callback;

      return this;
    },

    subscribeToOnce: function (eventName, callback) {
      if (!eventName || !callback) return this;
      if (!_.isFunction(callback)) callback = this[callback];
      this.listenToOnce(Backbone.Events, eventName, callback);
      this.subscriptions[eventName] = callback;

      return this;
    },

    publish: function () {
      if (arguments.length) {
        Backbone.Events.trigger.apply(this, arguments);
        Backbone.Events.trigger.apply(Backbone.Events, arguments);
      }

      return this;
    },

    unsubscribe: function (eventName) {
      if (eventName && this.subscriptions[eventName]) {
        this.stopListening(Backbone.Events, eventName);
      } else if (!eventName) {
        this.stopListening(Backbone.Events);
        this.subscriptions = {};
      }

      return this;
    }
  };

  Zeppelin.Storage = function (options) {
    options = options || {};

    this.type = 'localStorage';
    this.store = localStorage;

    if (options.type) {
      if (options.type === 'localStorage') {
        this.type = 'localStorage';
        this.store = localStorage;
      } else if (options.type === 'sessionStorage') {
        this.type = 'sessionStorage';
        this.store = sessionStorage;
      }
    }

    this.namespace = options.namespace || _.uniqueId('storage');
  };

  _.extend(Zeppelin.Storage.prototype, {
    set: function (key, value) {
      var data = this.getAll();

      if (_.isPlainObject(key)) {
        this.setAll(_.extend(data, key));
      } else if (_.isString(key)) {
        data[key] = value;
        this.setAll(data);
      }

      return this;
    },

    setAll: function (data) {
      this.store.setItem(this.namespace, JSON.stringify(data));
      return this;
    },

    get: function (key) {
      return this.getAll()[key];
    },

    getAll: function () {
      return JSON.parse(this.store.getItem(this.namespace)) || {};
    },

    has: function (key) {
      if (this.get(key)) {
        return true;
      } else {
        return false;
      }
    },

    clear: function (key) {
      var data = this.getAll();

      if (_.isString(key)) {
        delete data[key];
        this.setAll(data);
      }

      return this;
    },

    clearAll: function () {
      this.store.removeItem(this.namespace);
      return this;
    },

    length: function () {
      return _.size(this.getAll());
    },

    isEmpty: function () {
      return this.length() === 0;
    }
  });

  Zeppelin.Model = Backbone.Model.extend({
    constructor: function (attributes, options) {
      options = options || {};

      this.name = this.name || _.uniqueId('M');
      this.isUnplugged = false;

      if (!this.presenters) this.presenters = [];
      if (!this.validations) this.validations = {};
      if (!this.subscriptions) this.subscriptions = {};
      if (!this.localAttributes) this.localAttributes = [];

      this._views = [];

      _.union(this.presenters, options.presenters);
      _.extend(this.validations, options.validations);
      _.extend(this.subscriptions, options.subscriptions);
      _.union(this.localAttributes, options.localAttributes);

      this.registerSubscriptions();
      Backbone.Model.prototype.constructor.apply(this, arguments);
    },

    toString: function () {
      return '[object Model]';
    },

    isPopulated: function () {
      return _.size(this.attributes) > 0;
    },

    getLocalAttributes: function () {
      return this.pick(this.localAttributes);
    },

    toJSON: function () {
      return this.omit(this.localAttributes);
    },

    getPresenter: function (name) {
      var property = this[name] ? this[name] : name;

      if (name === 'name') property = name;

      if (_.isFunction(property)) {
        return _.bind(property, this);
      } else {
        return _.bind(function () {
          return this.get(property);
        }, this);
      }

      return null;
    },

    getPresenters: function (names) {
      var presenters = {};

      names = names || this.presenters;

      _.forEach(names, function (name) {
        presenters[name] = this.getPresenter(name);
      }, this);

      return presenters;
    },

    present: function (name) {
      return this.getPresenter(name)();
    },

    validate: function (attributes) {
      var errors = {},
          validAttributes = {};

      attributes = attributes || this.attributes;

      if (_.size(attributes) && _.size(this.validations)) {
        _.forOwn(this.validations, function (validations, attributeName) {
          var attributeValue = attributes[attributeName];

          if (!_.isArray(validations)) validations = [validations];

          _.forEach(validations, function (validation) {
            var validationResult, isRequired;

            isRequired = _.find(validations, function (item) {
              return _.isPlainObject(item) && item.isRequired === true;
            });

            if ((!isRequired && !Z.Validations.exists(attributeValue)) || errors[attributeName]) {
              return false;
            }

            if (_.isFunction(validation)) {
              validation = _.bind(validation, this);
              validationResult = validation(attributeValue);

              if (validationResult) {
                errors[attributeName] = validationResult;
              } else {
                validAttributes[attributeName] = attributeValue;
                this.trigger('valid', this, validAttributes);
                this.trigger('valid:' + attributeName, this, attributeValue);
              }
            } else if (_.isPlainObject(validation)) {
              _.forOwn(validation, function (value, key) {
                var isValid;

                key = key === 'isRequired' ? 'exists' : key;

                if (Zeppelin.Validations[key]) {
                  if (_.isBoolean(value)) {
                    isValid = Zeppelin.Validations[key](attributeValue) === value;
                  } else {
                    isValid = Zeppelin.Validations[key](attributeValue, value);
                  }

                  if (isValid) {
                    validAttributes[attributeName] = attributeValue;
                    this.trigger('valid', this, validAttributes);
                    this.trigger('valid:' + attributeName, this, attributeValue);
                  } else {
                    errors[attributeName] = validation.message || attributeName + ' is not valid.';
                  }
                }
              }, this);
            }
          }, this);
        }, this);

        if (_.size(errors)) return errors;
      }
    },

    registerValidation: function (attributeName, validation) {
      if (attributeName && validation) {
        if (_.isArray(validation) || _.isPlainObject(validation) || _.isFunction(validation)) {
          this.validations[attributeName] = _.isArray(validation) ? validation : [validation];
        }
      }

      return this;
    },

    hasValidation: function (attributeName) {
      if (attributeName) {
        return this.validations[attributeName] !== undefined;
      } else {
        return _.size(this.validations) !== 0;
      }
    },

    createCache: function (type) {
      this.cache = new Zeppelin.Storage({
        type: type,
        namespace: this.name
      });

      return this;
    },

    fetchCache: function () {
      if (!this.cache) this.createCache();
      this.set(this.cache.getAll());
      return this;
    },

    saveCache: function () {
      if (!this.cache) this.createCache();
      this.cache.setAll(this.attributes);
      return this;
    },

    destroyCache: function () {
      if (!this.cache) this.createCache();
      this.cache.clearAll(this.attributes);
      return this;
    },

    unplug: function () {
      this.off();
      this.stopListening();
      this.clear();
      this.isUnplugged = true;
      this.onUnplug();
      this.trigger('unplug', this);
      return this;
    },

    onUnplug: function () {

    }
  });

  _.extend(Zeppelin.Model.prototype, Zeppelin.Events);

  Zeppelin.Collection = Backbone.Collection.extend({
    constructor: function (models, options) {
      options = options || {};

      this.cid = _.uniqueId('col');
      this.name = this.name || _.uniqueId('C');
      this.isUnplugged = false;

      if (!this.presenters) this.presenters = [];
      if (!this.subscriptions) this.subscriptions = {};

      this._views = [];

      _.union(this.presenters, options.presenters);
      _.extend(this.subscriptions, options.subscriptions);

      this.registerSubscriptions();
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    toString: function () {
      return '[object Collection]';
    },

    getAttributes: function () {
      return this.map(function (model) {
        return model.attributes;
      });
    },

    getLocalAttributes: function () {
      return this.map(function (model) {
        return model.getLocalAttributes();
      });
    },

    getPresenter: function (name) {
      var property = this[name] ? this[name] : name;

      if (_.isFunction(property)) {
        return _.bind(property, this);
      } else {
        return _.bind(function () {
          return property;
        }, this);
      }

      return null;
    },

    getPresenters: function (names) {
      var presenters = {};

      names = names || this.presenters;

      _.forEach(names, function (name) {
        presenters[name] = this.getPresenter(name);
      }, this);

      return presenters;
    },

    present: function (name) {
      return this.getPresenter(name)();
    },

    createCache: function (type) {
      this.cache = new Zeppelin.Storage({
        type: type,
        namespace: this.name
      });

      return this;
    },

    fetchCache: function () {
      if (!this.cache) this.createCache();
      this.set(this.cache.getAll());
      return this;
    },

    saveCache: function () {
      if (!this.cache) this.createCache();
      this.cache.setAll(this.getAttributes());
      return this;
    },

    destroyCache: function () {
      if (!this.cache) this.createCache();
      this.cache.clearAll();
      return this;
    },

    unplug: function () {
      this.off();
      this.stopListening();
      this.reset();
      this.isUnplugged = true;
      this.onUnplug();
      this.trigger('unplug', this);
      return this;
    },

    onUnplug: function () {

    }
  });

  _.extend(Zeppelin.Collection.prototype, Zeppelin.Events);

  var reservedElementNames = ['el', 'container', 'form', 'list'];

  Zeppelin.View = Backbone.View.extend({
    constructor: function (options) {
      this.cid = _.uniqueId('view');
      this._configure(options);
      this.initialize.apply(this, arguments);
    },

    _configure: function (options) {
      options = options || {};

      this.views = this.views || {};
      this.bindings = this.bindings || {};
      this.elements = this.elements || {};
      this.autoRenders = this.autoRenders || true;

      _.merge(this, options);

      if (!this.name) this.name = this.cid;

      this._isRemoved = false;
      this._isRendered = false;
      this._isInserted = false;
      this._isUnplugged = false;
      this._isFirstRender = true;

      this._registeredViews = {};
      this._registeredBindings = {};
      this._registeredElements = {};

      this.setModel();
      this._ensureElement();
      this.delegateEvents();
      this._ensureContainer();
      this.registerSubscriptions();
      if (this.autoRenders) this.render();
    },

    setElement: function () {
      Backbone.View.prototype.setElement.apply(this, arguments);
      if (this.isInDOM()) this._whenInserted();
      return this;
    },

    toString: function () {
      return '[object View]';
    },

    hasModelSet: function () {
      return Z.Util.isModel(this.model) && this.model.cid ? true : false;
    },

    setModel: function (model) {
      model = model || this.model;
      if (!Z.Util.isModel(model)) return this;
      if (this.hasModelSet()) this.unsetModel();
      this.model = _.isFunction(model) ? new model() : model;
      this.model._views.push(this.cid);
      this.onSetModel(model);
      return this;
    },

    onSetModel: function (model) {
      return this;
    },

    unsetModel: function () {
      if (!this.hasModelSet()) return this;
      this.unregisterModelBindings();
      this.model._views.splice(_.indexOf(this.model._views, this.cid), 1);
      this.onUnsetModel(this.model);
      delete this.model;
      return this;
    },

    onUnsetModel: function (model) {
      return this;
    },

    _ensureContainer: function () {
      this.setContainer(_.result(this, this.container ? 'container' : '$el'));
      return this;
    },

    setContainer: function (element) {
      if (Z.Util.is$(element)) {
        this.$container = element;
      } else if ($(element).is(this.$el)) {
        this.$container = this.$el;
      } else if (this.$(element)) {
        this.$container = this.$(element);
      } else {
        this.$container = $(element);
      }

      return this;
    },

    context: function () {
      var context = {};

      if (this.hasModelSet()) _.extend(context, this.model.getPresenters());
      return context;
    },

    renderTemplate: function (template, context) {
      var output = '';

      if (arguments.length === 2) {
        context = _.isPlainObject(context) ? context : _.result(this, 'context');

        template = _.isFunction(template) ? template : this.template;
      } else {
        context = _.isPlainObject(template) ? template : _.result(this, 'context');

        template = _.isFunction(template) ? template : this.template;
      }

      if (template) output = template.call(this, context);

      return output;
    },

    canRender: function () {
      return this.template ? true : false;
    },

    shouldRender: function () {
      if (!this.canRender()) return false;
      if (!this.hasModelSet() && this.model) return false;
      if (this.hasModelSet() && !this.model.isPopulated()) return false;
      return true;
    },

    isInDOM: function () {
      return $.contains(document, this.el);
    },

    render: function (template, context) {
      var output = this.renderTemplate(template, context);

      if (output) this.$container.html(output);
      this._isRendered = true;
      this._isFirstRender = false;

      this.unregisterElements();
      this.registerElements();
      this.unregisterViews();
      this.registerViews();
      this.unregisterBindings();
      this.registerBindings();

      this.trigger('rendered', this);
      this.onRender();

      return this;
    },

    onRender: function () {
      return this;
    },

    insert: function (element) {
      var $el = Z.Util.is$(element) ? element : $(element);

      if (!$el.length) return this;
      if (this.canRender() && this.shouldRender()) this.render();
      $el.html(this.el);
      return this;
    },

    _whenInserted: function () {
      this._isInserted = true;
      this.trigger('inserted', this);
      this.onInsert();
    },

    onInsert: function () {
      return this;
    },

    toHTML: function () {
      return this.$el.html();
    },

    hasBindings: function () {
      return _.size(this._registeredBindings) > 0;
    },

    registerBinding: function (event, options) {
      var _options = {};

      if (!_.isString(event) || !_.isPlainObject(options)) return this;
      if (!options.callback) return this;

      _options.once = options.once || false;
      _options.delay = options.delay > -1 ? options.delay : 150;
      _options.element = options.element || this.$el;
      _options.element = Z.Util.is$(_options.element) ? _options.element : this.$(_options.element);
      _options.object = options.object;

      if (!_options.object && this.model && this.model.cid) _options.object = this.model;

      if (!_options.object && this.collection && this.collection.cid) _options.object = this.collection;

      if (!_options.object) _options.object = this;

      if (Z.Util.isView(_options.object)) {
        _options.type = 'view';
      } else if (Z.Util.isModel(_options.object)) {
        _options.type = 'model';
      } else if (Z.Util.isCollection(_options.object)) {
        _options.type = 'collection';
      } else {
        _options.type = '';
      }

      _options.callback = _.isFunction(options.callback) ? options.callback : this[options.callback];

      if (!_options.callback) return this;
      _options.callback = _.bind(_options.callback, this);
      _options.callback = _.partial(_options.callback, _options.element);
      _options.callback = _.debounce(_options.callback, _options.delay);

      if (_options.object.cid === this.cid) {
        if (_options.once) {
          this.once(event, _options.callback, this);
        } else {
          this.on(event, _options.callback, this);
        }
      } else {
        if (_options.once) {
          this.listenToOnce(_options.object, event, _options.callback);
        } else {
          this.listenTo(_options.object, event, _options.callback);
        }
      }

      this._registeredBindings[event] = _options;

      return this;
    },

    registerBindings: function (bindings) {
      bindings = bindings || _.result(this, 'bindings');

      _.forOwn(bindings, function (options, event) {
        this.registerBinding(event, options);
      }, this);

      return this;
    },

    unregisterBinding: function (event) {
      var binding = this._registeredBindings[event];

      if (!binding) return this;

      if (binding.object.cid === this.cid) {
        this.off(event, binding.callback, this);
      } else {
        this.stopListening(binding.object, event, binding.callback);
      }

      delete this._registeredBindings[event];
      return this;
    },

    unregisterBindings: function (bindings) {
      bindings = bindings || _.keys(this._registeredBindings);
      _.forEach(bindings, this.unregisterBinding, this);
      return this;
    },

    getModelBindings: function (model) {
      var bindings = {};

      if (!model && this.hasModelSet()) model = this.model;
      if (!Z.Util.isModel(model)) return bindings;

      _.forOwn(this._registeredBindings, function (binding, event) {
        if (binding.object.cid === model.cid) bindings[event] = binding;
      }, this);

      return bindings;
    },

    unregisterModelBindings: function () {
      if (!this.hasModelSet()) return this;
      this.unregisterBindings(_.keys(this.getModelBindings(this.model)));
      return this;
    },

    getViewBindings: function (view) {
      var bindings = {};

      if (!view) view = this;
      if (!Z.Util.isView(view)) return bindings;

      _.forOwn(this._registeredBindings, function (binding, event) {
        if (binding.object.cid === view.cid) bindings[event] = binding;
      }, this);

      return bindings;
    },

    unregisterViewBindings: function (view) {
      if (!Z.Util.isView(view)) return this;
      this.unregisterBindings(_.keys(this.getViewBindings(view)));
      return this;
    },

    _isReservedElementName: function (name) {
      return _.indexOf(reservedElementNames, name) === -1 ? false : true;
    },

    getElement: function (name) {
      return this._isReservedElementName(name) ? undefined : this['$' + name];
    },

    getSelector: function (name) {
      var options, selector;

      options = this._registeredElements[name];
      if (!options) return undefined;

      if (Z.Util.is$(options)) {
        selector = options.selector;
      } else if (_.isString(options)) {
        selector = options;
      } else if (_.isPlainObject(options) && options.selector) {
        selector = options.selector;
      }

      return selector;
    },

    hasElements: function () {
      return _.size(this._registeredElements) > 0;
    },

    registerElement: function (name, options) {
      var $el, selector;

      if (!name || !options || this._isReservedElementName(name)) return this;

      if (Z.Util.is$(options) && this.$el.find(options)) {
        $el = options;
        selector = $el.selector;
      } else if (_.isString(options)) {
        $el = this.$el.find(options);
        selector = options;
      } else if (_.isPlainObject(options) && options.selector) {
        $el = this.$el.find(options.selector);
        selector = options.selector;
      }

      if (!$el || !$el.length) return false;
      this['$' + name] = $el;

      if (_.isPlainObject(options) && _.isPlainObject(options.events)) {
        _.forOwn(options.events, function (callback, event) {
          this.delegateEvent(selector, event, callback);
        }, this);
      }

      this._registeredElements[name] = options;

      return this;
    },

    registerElements: function (elements) {
      elements = elements || _.result(this, 'elements');

      _.forOwn(elements, function (options, name) {
        this.registerElement(name, options);
      }, this);

      return this;
    },

    unregisterElement: function (name) {
      var $el, selector;

      if (this._isReservedElementName(name)) return this;
      $el = this.getElement(name);
      selector = this.getSelector(name);
      if ($el) $el.off();
      if (selector) this.undelegateEvent(selector, '');
      delete this['$' + name];
      delete this._registeredElements[name];
      return this;
    },

    unregisterElements: function (elements) {
      elements = elements || _.keys(this._registeredElements);
      _.forEach(elements, this.unregisterElement, this);
      return this;
    },

    delegateEvent: function (selector, event, callback) {
      if (arguments.length === 2) {
        callback = event;
        event = selector;
        selector = undefined;
      }

      if (!event || !callback) return this;

      event += '.delegateEvents' + this.cid;
      callback = _.isFunction(callback) ? _.bind(callback, this) : _.bind(this[callback], this);

      if (selector) {
        if (Z.Util.is$(selector)) {
          selector = selector.selector;
        } else if (this.getSelector(selector)) {
          selector = this.getSelector(selector);
        } else if (_.isString(selector)) {
          selector = selector;
        }

        if (selector) this.$el.on(event, selector, callback);
      } else {
        this.$el.on(event, callback);
      }

      return this;
    },

    undelegateEvent: function (selector, event) {
      if (arguments.length === 2) {
        selector = Z.Util.is$(selector) ? selector.selector : selector;
        this.$el.off(event + '.delegateEvents' + this.cid, selector);
      } else if (arguments.length === 1) {
        event = selector;
        this.$el.off(event + '.delegateEvents' + this.cid);
      }

      return this;
    },

    hasView: function (name) {
      return Z.Util.isView(this.getView(name));
    },

    hasViews: function () {
      return _.size(this._registeredViews) > 0;
    },

    registerView: function (view, data, name) {
      var options;

      if (_.isPlainObject(view) && !Z.Util.isView(view)) {
        options = view;
        view = options.view;
        name = data;
        data = options.data || {};
      }

      if (!Z.Util.isView(view)) return this;
      if (_.isString(data)) name = data;
      if (!_.isPlainObject(data)) data = {};

      view = _.isFunction(view) ? new view(data) : view;
      this._registeredViews[name || view.cid] = view;
      view.on('removed', this._whenViewRemoved, this);
      return this;
    },

    registerViews: function (views) {
      views = views || _.result(this, 'views');

      _.forOwn(views, function (view, name) {
        this.registerView(view, name);
      }, this);

      return this;
    },

    unregisterView: function (name) {
      var view;

      if (!_.isString(name)) return this;
      view = this.getView(name);
      if (!Z.Util.isView(view)) return this;
      this.unregisterViewBindings(view);
      view.off('removed', this._whenViewRemoved, this);
      delete this._registeredViews[name];
      return this;
    },

    unregisterViews: function (views) {
      views = views || _.keys(this._registeredViews);
      _.forEach(views, this.unregisterView, this);
      return this;
    },

    getView: function (comparator) {
      var view;

      if (_.isString(comparator)) {
        view = this._registeredViews[comparator];
      } else if (_.isFunction(comparator)) {
        comparator = _.bind(comparator, this);
        view = _.find(this._registeredViews, function (view) {
          return comparator(view) === true;
        }, this);
      }

      return view;
    },

    getViews: function (comparator) {
      var views = [];

      if (_.isFunction(comparator)) {
        comparator = _.bind(comparator, this);
        views = _.filter(this._registeredViews, function (view) {
          return comparator(view) === true;
        }, this);
      }

      return views;
    },

    forEachView: function (callback) {
      if (!_.isFunction(callback)) callback = this[callback];
      if (callback) _.forOwn(this._registeredViews, _.bind(callback, this), this);
      return this;
    },

    unplugViews: function (deep) {
      deep = deep || false;

      this.forEachView(function (view) {
        view.unplug(deep);
      });

      return this;
    },

    _whenViewRemoved: function (view) {
      var name;

      _.forOwn(this._registeredViews, function (_view, _name) {
        if (view.cid === _view.cid) {
          name = _name;
          return false;
        }
      }, this);

      if (name) {
        view.off('removed', this._whenViewRemoved, this);
        delete this._registeredViews[name];
      }
    },

    unplug: function (deep) {
      deep = deep || false;

      this.off();
      this.stopListening();
      this.undelegateEvents();
      this.unregisterElements();
      this.unregisterBindings();
      this.unsetModel();

      if (deep) this.unplugViews();

      this._isUnplugged = true;
      this.trigger('unplugged', this);
      this.onUnplug();

      return this;
    },

    onUnplug: function () {
      return this;
    },

    remove: function () {
      this.$el.remove();
      this._isRemoved = true;
      this.trigger('removed', this);
      this.onRemove();
      this.unplug(true);
      return this;
    },

    onRemove: function () {
      return this;
    }
  });

  _.extend(Zeppelin.View.prototype, Zeppelin.Events);

  Zeppelin.FormView = Zeppelin.View.extend({
    _configure: function (options) {
      options = options || {};

      this.views = this.views || {};
      this.bindings = this.bindings || {};
      this.elements = this.elements || {};
      this.model = this.model || Z.Model;
      this.autoRenders = this.autoRenders || true;

      _.merge(this, options);

      if (!this.name) this.name = this.cid;

      this._isRemoved = false;
      this._isRendered = false;
      this._isInserted = false;
      this._isUnplugged = false;
      this._isFirstRender = true;

      this._registeredViews = {};
      this._registeredBindings = {};
      this._registeredElements = {};

      this.setModel();
      this._ensureElement();
      this.delegateEvents();
      this._ensureContainer();
      this._ensureForm();
      this.registerSubscriptions();
      if (this.autoRenders) this.render();
    },

    setModel: function () {
      Zeppelin.View.prototype.setModel.apply(this, arguments);
      this.listenTo(this.model, 'valid', this.onValid);
      this.listenTo(this.model, 'invalid', this.onInvalid);
      return this;
    },

    unsetModel: function () {
      if (!this.hasModelSet()) return this;
      this.stopListening(this.model, 'valid', this.onValid);
      this.stopListening(this.model, 'invalid', this.onInvalid);
      this.unregisterModelBindings();
      this.model._views.splice(_.indexOf(this.model._views, this.cid), 1);
      delete this.model;
      return this;
    },

    _ensureForm: function () {
      this.setForm(_.result(this, this.form ? 'form' : '$container'));
      return this;
    },

    setForm: function (element) {
      if (this.$form) this.$form.off('submit');

      if (Z.Util.is$(element)) {
        this.$form = element;
      } else if ($(element).is(this.$el)) {
        this.$form = this.$el;
      } else if (this.$(element)) {
        this.$form = this.$(element);
      } else {
        this.$form = $(element);
      }

      if (this.$form.length) {
        this.$form.on('submit', _.bind(function (event) {
          this.onSubmit(event);
        }, this));
      }

      return this;
    },

    onSubmit: function (event) {
      event.preventDefault();
      this.setAttributes();
    },

    render: function () {
      Zeppelin.View.prototype.render.apply(this, arguments);
      this._ensureForm();
      return this;
    },

    getAttributeElement: function (attributeName) {
      return this.$form.find('[name=' + attributeName + ']');
    },

    getAttributeErrorElement: function (attributeName) {
      return this.$form.find('[data-error=' + attributeName + ']');
    },

    getAttributeValue: function (attributeName) {
      var $attribute, $checked, $selected;

      $attribute = this.getAttributeElement(attributeName);

      if ($attribute) {
        if ($attribute.is(':radio, :checkbox')) {
          $checked = $attribute.filter(':checked');

          if ($checked.length) {
            if ($checked.length > 1 && $attribute.is(':checkbox')) {
              return _.compact(_.map($checked, function (check) {
                return $(check).val();
              }));
            } else {
              return $checked.attr('value') ? $checked.val() : true;
            }
          } else {
            return false;
          }
        } else if ($attribute.is('input, textarea')) {
          if ($attribute.length > 1) {
            return _.compact(_.map($attribute, function (attr) {
              return $(attr).val();
            }));
          } else {
            return $attribute.val();
          }
        } else if ($attribute.is('select')) {
          $selected = $attribute.find('option').filter(':selected');

          if ($selected.length) {
            if ($selected.length > 1) {
              return _.compact(_.map($selected, function (option) {
                return $(option).val();
              }));
            } else {
              return $selected.attr('value') ? $selected.val() : true;
            }
          } else {
            return false;
          }
        }
      }

      return null;
    },

    getAttributeValues: function () {
      var attributes = {},
          attributeName;

      _.forEach(this.$form.find('[name]'), function (element) {
        attributeName = $(element).attr('name');
        attributes[attributeName] = this.getAttributeValue(attributeName);
      }, this);

      return _.size(attributes) ? attributes : null;
    },

    setAttribute: function (attributeName) {
      this.model.set(attributeName, this.getAttributeValue(attributeName), {
        validate: true
      });

      return this;
    },

    setAttributes: function () {
      var attributes = {};

      _.forEach(this.$form.find('[name]'), function (element) {
        var attributeName = $(element).attr('name');
        attributes[attributeName] = this.getAttributeValue(attributeName);
      }, this);

      if (_.size(attributes)) {
        this.model.set(attributes, {
          validate: true
        });
      }

      return this;
    },

    errorClass: 'error',

    onInvalid: function (model, error) {
      _.forOwn(error, function (message, attributeName) {
        this.getAttributeElement(attributeName).addClass(this.errorClass);
        this.getAttributeErrorElement(attributeName).text(message);
      }, this);

      return this;
    },

    onValid: function (model, attributes) {
      _.forOwn(attributes, function (value, attributeName) {
        this.getAttributeElement(attributeName).removeClass(this.errorClass);
        this.getAttributeErrorElement(attributeName).text('');
      }, this);

      return this;
    },

    reset: function () {
      this.$form.find('[name]').removeClass(this.errorClass);
      this.$form.find('[data-error]').text('');
      return this;
    }
  });

  Zeppelin.CollectionView = Zeppelin.View.extend({
    _configure: function (options) {
      options = options || {};

      this.views = this.views || {};
      this.bindings = this.bindings || {};
      this.elements = this.elements || {};
      this.collection = this.collection || Z.Collection;
      this.autoRenders = this.autoRenders || true;
      this.reactsToCollection = this.reactsToCollection || true;

      _.merge(this, options);

      if (!this.name) this.name = this.cid;

      this._isRemoved = false;
      this._isRendered = false;
      this._isInserted = false;
      this._isFiltered = false;
      this._isUnplugged = false;
      this._isFirstRender = true;
      this._collectionIsRendered = false;

      this._registeredViews = {};
      this._registeredBindings = {};
      this._registeredElements = {};
      this._registeredItemViews = {};

      this.setCollection();
      this._ensureElement();
      this.delegateEvents();
      this._ensureContainer();
      this._ensureList();
      this.registerSubscriptions();
      if (this.autoRenders) this.render();
    },

    itemView: Z.View,

    hasCollectionSet: function () {
      return Z.Util.isCollection(this.collection) && this.collection.cid ? true : false;
    },

    setCollection: function (collection) {
      collection = collection || this.collection;
      if (!Z.Util.isCollection(collection)) return this;
      if (this.hasCollectionSet()) this.unsetCollection();
      this.collection = _.isFunction(collection) ? new collection() : collection;
      this.collection._views.push(this.cid);

      this.listenTo(this.collection, 'add', this.onAdd);
      this.listenTo(this.collection, 'reset', this.onReset);
      this.listenTo(this.collection, 'remove', this.onRemove);

      if (this.reactsToCollection) {
        this.listenTo(this.collection, 'add', this.appendItem);
        this.listenTo(this.collection, 'reset', this.render);
        this.listenTo(this.collection, 'remove', this.removeItem);
      }

      return this;
    },

    unsetCollection: function () {
      if (!this.hasCollectionSet()) return this;
      this.unregisterCollectionBindings();
      this.stopListening(this.collection, 'add', this.onAdd);
      this.stopListening(this.collection, 'reset', this.onReset);
      this.stopListening(this.collection, 'remove', this.onRemove);

      if (this.reactsToCollection) {
        this.stopListening(this.collection, 'add', this.appendItem);
        this.stopListening(this.collection, 'reset', this.renderCollection);
        this.stopListening(this.collection, 'remove', this.removeItem);
      }

      this.collection._views.splice(_.indexOf(this.collection._views, this.cid), 1);
      delete this.collection;
      return this;
    },

    isValidModel: function (model) {
      var valid = false;

      if (this.hasCollectionSet() && model && model.cid && this.collection.contains(model)) valid = true;

      return valid;
    },

    getCollectionBindings: function (collection) {
      var bindings = {};

      if (!collection && this.hasCollectionSet()) collection = this.collection;
      if (!Z.Util.isCollection(collection)) return bindings;

      _.forOwn(this._registeredBindings, function (binding, event) {
        if (binding.object.cid === collection.cid) bindings[event] = binding;
      }, this);

      return bindings;
    },

    unregisterCollectionBindings: function () {
      if (!this.hasCollectionSet()) return this;
      this.unregisterBindings(_.keys(this.getCollectionBindings(this.collection)));
      return this;
    },

    onAdd: function (model) {
      return this;
    },

    onReset: function (collection) {
      return this;
    },

    onRemove: function (model) {
      return this;
    },

    _ensureList: function () {
      this.setList(_.result(this, this.list ? 'list' : '$container'));
      return this;
    },

    setList: function (element) {
      if (Z.Util.is$(element)) {
        this.$list = element;
      } else if ($(element).is(this.$el)) {
        this.$list = this.$el;
      } else if (this.$(element)) {
        this.$list = this.$(element);
      } else {
        this.$list = $(element);
      }

      return this;
    },

    hasItemViews: function () {
      return _.size(this._registeredItemViews) > 0;
    },

    createItemView: function (model) {
      var itemView = Z.View;

      if (!this.isValidModel(model)) return undefined;

      if (_.isFunction(this.itemView) && !Z.Util.isView(this.itemView)) {
        if (Z.Util.isView(this.itemView(model))) itemView = this.itemView(model);
      } else if (Z.Util.isView(this.itemView)) {
        itemView = this.itemView;
      }

      return new itemView({
        model: model,
        autoRenders: true
      });
    },

    getItem: function (model) {
      var itemView;

      if (!model || !model.cid) return undefined;
      itemView = this.getView(this._registeredItemViews[model.cid]);
      return itemView;
    },

    addItem: function (model) {
      var itemView;

      if (this.getItem(model)) return this;
      itemView = this.createItemView(model);
      if (!itemView) return this;
      this.onAddItem(itemView);
      this._registeredItemViews[model.cid] = itemView.cid;
      this.registerView(itemView);
      return this;
    },

    onAddItem: function (itemView) {
      return this;
    },

    addItems: function (models) {
      models = models || this.collections.models;
      _.forEach(models, this.addItem, this);
      return this;
    },

    renderItem: function (model) {
      var itemView = this.getItem(model);

      if (!itemView) this.addItem(model);
      itemView = this.getItem(model);
      if (itemView) itemView.render();
      return this;
    },

    appendItem: function (model) {
      var itemView = this.getItem(model);

      if (!itemView) {
        this.addItem(model);
        itemView = this.getItem(model);
        if (itemView) this.$list.append(itemView.render().el);
      } else {
        this.$list.append(itemView.render().el);
      }

      return this;
    },

    prependItem: function (model) {
      var itemView = this.getItem(model);

      if (!itemView) {
        this.addItem(model);
        itemView = this.getItem(model);
        if (itemView) this.$list.append(itemView.render().el);
      } else {
        this.$list.prepend(itemView.render().el);
      }

      return this;
    },

    removeItem: function (model) {
      var itemView = this.getItem(model);

      if (!itemView) return this;
      this.onRemoveItem(itemView);
      this.unregisterView(itemView.cid);
      itemView.remove();
      delete this._registeredItemViews[model.cid];
      return this;
    },

    onRemoveItem: function (itemView) {
      return this;
    },

    removeItems: function (models) {
      models = models || this.collection.models;
      _.forEach(models, this.removeItem, this);
      return this;
    },

    renderCollection: function (filter) {
      var fragment, models;

      if (this.hasCollectionSet() && this.collection.length) {
        models = _.isFunction(filter) ? this.collection.filter(_.bind(filter, this)) : this.collection.models;
        fragment = document.createDocumentFragment();

        this.removeItems();

        if (models && models.length) {
          _.forEach(models, function (model) {
            var itemView;

            this.renderItem(model);
            itemView = this.getItem(model);
            if (itemView) fragment.appendChild(itemView.el);
          }, this);

          this.$list.html(fragment);
        }

        this._isFiltered = _.isFunction(filter);
        this._collectionIsRendered = true;
        this.onRenderCollection(this.collection);
        this.trigger('collectionRendered', this, this.collection);
      }

      return this;
    },

    onRenderCollection: function (collection) {
      return this;
    },

    context: function () {
      var context = {};

      if (this.hasCollectionSet()) _.extend(context, this.collection.getPresenters());
      return context;
    },

    shouldRender: function () {
      if (!this.canRender()) return false;
      if (!this.hasCollectionSet() && this.collection) return false;
      if (this.hasCollectionSet() && !this.collection.length) return false;
      return true;
    },

    render: function (filter) {
      Zeppelin.View.prototype.render.apply(this);
      this._ensureList();
      this.renderCollection(filter);
      return this;
    },

    unplug: function () {
      if (this.hasItemViews()) this.removeItems();
      Zeppelin.View.prototype.unplug.apply(this, arguments);
      return this;
    }
  });

  Zeppelin.Router = Backbone.Router.extend({
    constructor: function (options) {
      options = options || {};

      this.cid = _.uniqueId('r');
      this.name = this.name || _.uniqueId('R');

      if (!this.validations) this.validations = {};
      if (!this.subscriptions) this.subscriptions = {};

      _.extend(this.validations, options.validations);
      _.extend(this.subscriptions, options.subscriptions);

      this._transformValidations();
      this.registerSubscriptions();
      Backbone.Router.prototype.constructor.apply(this, arguments);
    },

    start: function (options) {
      if (!Backbone.History.started) Backbone.history.start(options);
      return this;
    },

    reload: function () {
      Backbone.history.loadUrl(Backbone.history.fragment);
    },

    stop: function () {
      if (Backbone.History.started) Backbone.history.stop();
      return this;
    },

    getLocation: function () {
      return _.pick(window.location, ['hash', 'host', 'hostname', 'href', 'search', 'origin', 'pathname', 'port', 'protocol']);
    },

    getFragment: function () {
      return Backbone.history.getFragment();
    },

    getRoute: function () {
      var route = null,
          params = null,
          fragment = Backbone.history.getFragment(),
          matched;

      matched = _.find(Backbone.history.handlers, function (handler) {
        return handler.route.test(fragment);
      });

      if (matched) {
        route = matched.route;
        params = this._extractParameters(route, fragment);
      }

      return {
        route: route,
        params: params,
        fragment: fragment
      };
    },

    beforeRoute: function (route) {

    },

    afterRoute: function (route) {

    },

    _transformValidations: function () {
      this.validations = _.transform(this.validations, function (result, callback, route) {
        if (!_.isRegExp(route) && !_.isFunction(route)) route = this._routeToRegExp(route).toString();
        if (!_.isFunction(callback)) callback = this[callback];
        if (route && callback) result[route] = _.bind(callback, this);
      }, null, this);

      return this;
    },

    resgiterValidation: function (route, callback) {
      if (!_.isRegExp(route) && !_.isFunction(route)) route = this._routeToRegExp(route).toString();
      if (!_.isFunction(callback)) callback = this[callback];
      if (route && callback) this.validations[route] = _.bind(callback, this);
      return this;
    },

    registerValidations: function (validations) {
      validations = validations || this.validations;

      _.forOwn(validations, function (callback, route) {
        this.resgiterValidation(route, callback);
      }, this);

      return this;
    },

    validate: function (route) {
      var validation = this.validations[route.route.toString()];
      if (validation) return validation(route);
    },

    execute: function () {
      var route = this.getRoute(),
          error = this.validate(route);

      if (!_.size(error)) {
        this.beforeRoute(route);
        Backbone.Router.prototype.execute.apply(this, arguments);
        this.afterRoute(route);
        this.trigger('route:valid', route);
      } else {
        this.trigger('route:invalid', route, error);
      }
    }
  });

  _.extend(Zeppelin.Router.prototype, Zeppelin.Events);

  return Zeppelin;
})(this, Backbone, _);
