(function (root, Backbone, _) {
  var Zeppelin, Z;

  if (typeof exports !== 'undefined') {
    Zeppelin = exports;
  } else {
    root.Zeppelin = root.Z = Zeppelin = Z = {};
  }

  Zeppelin.VERSION = '0.0.1-alpha';

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
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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
    subscriptions: {

    },

    registerSubscriptions: function (subscriptions) {
      subscriptions = subscriptions || this.subscriptions;

      if (_.size(subscriptions)) {
        _.forOwn(subscriptions, function (callback, eventName) {
          this.subscribe(eventName, callback);
        }.bind(this));
      }

      return this;
    },

    subscribe: function (eventName, callback) {
      if (_.isFunction(callback)) {
        callback = callback.bind(this);
      } else {
        callback = this[callback];
      }

      if (callback) {
        this.listenTo(Backbone.Events, eventName, callback);
        this.subscriptions[eventName] = callback;
      }

      return this;
    },

    subscribeToOnce: function (eventName, callback) {
      if (_.isFunction(callback)) {
        callback = callback.bind(this);
      } else {
        callback = this[callback];
      }

      if (callback) {
        callback = callback.bind(this);
        this.listenToOnce(Backbone.Events, eventName, callback);
        this.subscriptions[eventName] = callback;
      }

      return this;
    },

    publish: function () {
      if (arguments.length) {
        Backbone.Events.trigger.apply(Backbone.Events, arguments);
      }

      return this;
    },

    unsubscribe: function (eventName) {
      if (eventName && this.subscriptions[eventName]) {
        this.stopListening(Backbone.Events, eventName);
        delete this.subscriptions[eventName];
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
    constructor: function () {
      this.name = this.name || _.uniqueId('M');
      this.presenters = this.presenters || [];
      this.validations = this.validations || {};
      this.localAttributes = this.localAttributes || [];

      this.registerSubscriptions();
      Backbone.Model.prototype.constructor.apply(this, arguments);
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
        return property.bind(this);
      } else {
        return function () {
          return this.get(property);
        }.bind(this);
      }

      return null;
    },

    getPresenters: function (names) {
      var presenters = {};

      names = names || this.presenters;

      _.forEach(names, function (name) {
        presenters[name] = this.getPresenter(name);
      }.bind(this));

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

          if (!_.isArray(validations)) {
            validations = [validations];
          }

          _.forEach(validations, function (validation) {
            var validationResult, isRequired;

            isRequired = _.find(validations, function (item) {
              return _.isPlainObject(item) && item.isRequired === true;
            });

            if ((!isRequired && !Z.Validations.exists(attributeValue)) || errors[attributeName]) {
              return false;
            }

            if (_.isFunction(validation)) {
              validation = validation.bind(this);
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
              }.bind(this));
            }
          }.bind(this));
        }.bind(this));

        if (_.size(errors)) {
          return errors;
        }
      }
    },

    addValidation: function (attributeName, validation) {
      if (attributeName && validation) {
        if (_.isArray(validation) || _.isPlainObject(validation) || _.isFunction(validation)) {
          this.validations[attributeName] = _.isArray(validation) ? validation : [validation];
        }
      }

      return this;
    },

    removeValidation: function (attributeName) {
      if (attributeName) {
        delete this.validations[attributeName];
      } else {
        this.validations = {};
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
      if (!this.cache) {
        this.createCache();
      }

      this.set(this.cache.getAll());
      return this;
    },

    saveCache: function () {
      if (!this.cache) {
        this.createCache();
      }

      this.cache.setAll(this.attributes);
      return this;
    }
  });

  _.extend(Zeppelin.Model.prototype, Zeppelin.Events);

  Zeppelin.Collection = Backbone.Collection.extend({
    constructor: function () {
      this.cid = _.uniqueId('col');
      this.name = this.name || _.uniqueId('C');
      this.presenters = this.presenters || [];

      this.registerSubscriptions();
      Backbone.Collection.prototype.constructor.apply(this, arguments);
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
        return property.bind(this);
      } else {
        return function () {
          return property;
        }.bind(this);
      }

      return null;
    },

    getPresenters: function (names) {
      var presenters = {};

      names = names || this.presenters;

      _.forEach(names, function (name) {
        presenters[name] = this.getPresenter(name);
      }.bind(this));

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
      if (!this.cache) {
        this.createCache();
      }

      this.set(this.cache.getAll());
      return this;
    },

    saveCache: function () {
      if (!this.cache) {
        this.createCache();
      }

      this.cache.setAll(this.getAttributes());
      return this;
    }
  });

  _.extend(Zeppelin.Collection.prototype, Zeppelin.Events);

  var reservedElementNames = ['el', 'container', 'form', 'list'];

  Zeppelin.View = Backbone.View.extend({
    constructor: function (options) {
      options = options || {};

      this.name = options.name || this.name || _.uniqueId('V');

      if (!this.events) this.events = {};
      if (!this.elements) this.elements = {};
      if (!this.bindings) this.bindings = {};
      if (!this.children) this.children = {};

      _.extend(this.events, options.events);
      _.extend(this.elements, options.elements);
      _.extend(this.bindings, options.bindings);
      _.extend(this.children, options.children);

      this.isRemoved = false;
      this.isRendered = false;
      this.isInserted = false;
      this.isUnplugged = false;
      this.isFirstRender = true;
      this.containerIsSet = false;

      this.model = options.model || this.model;
      if (this.model) this.setModel(this.model);

      this.collection = options.collection || this.collection;
      if (this.collection) this.setCollection(this.collection);

      this.registerBindings();
      this.registerSubscriptions();
      Backbone.View.prototype.constructor.apply(this, arguments);
      this.registerElements();
    },

    _isReservedElementName: function (name) {
      if (_.indexOf(reservedElementNames, name) === -1) {
        return false;
      } else {
        return true;
      }
    },

    registerElement: function (name, options) {
      var $element, selector;

      if (!name || !options || this._isReservedElementName(name)) return this;

      if (_.isString(options)) {
        selector = options;
      } else if (_.isPlainObject(options)) {
        if (options.selector) {
          selector = options.selector;
        } else {
          return this;
        }
      } else {
        return this;
      }

      $element = this.$el.find(selector);
      if (!$element.length) return this;
      this['$' + name] = $element;
      this.elements[name] = selector;

      if (options.events && _.isPlainObject(options.events)) {
        _.forOwn(options.events, function (callback, eventName) {
          this.delegateEvent(selector, eventName, callback);
        }.bind(this));
      }

      return this;
    },

    getElement: function (name) {
      if (!name || this._isReservedElementName(name) || !this['$' + name]) {
        return null;
      } else {
        return this['$' + name];
      }
    },

    getElementSelector: function (name) {
      var selector;

      if (!name || this._isReservedElementName(name) || this.getElement(name) === null) return null;
      selector = this.elements[name];
      if (_.isPlainObject(selector)) selector = selector.selector;

      return selector || null;
    },

    unregisterElement: function (name) {
      var $element, selector;

      if (!name || this._isReservedElementName(name) || !this.getElement(name)) return this;

      $element = this.getElement(name);
      selector = this.getElementSelector(name);

      if (selector) {
        $element.off();
        this.undelegateEvent(selector, '');
        delete this['$' + name];
        delete this.elements[name];
      } else {
        return this;
      }
    },

    registerElements: function (elements) {
      elements = elements || this.elements;

      _.forOwn(elements, function (options, name) {
        this.registerElement(name, options);
      }.bind(this));

      return this;
    },

    unregisterElements: function (elements) {
      elements = elements || this.elements;

      _.forOwn(elements, function (options, name) {
        this.unregisterElement(name);
      }.bind(this));

      return this;
    },

    bindings: {

    },

    _deconstructBinding: function (binding) {
      var _binding, deconstructedBinding;

      if (binding) {
        _binding = binding.split(' ');

        deconstructedBinding = {
          once: false,
          other: this
        };

        if (_binding.length === 1) {
          deconstructedBinding.eventName = _binding[0];
        } else if (_binding.length >= 2) {
          deconstructedBinding.eventName = _binding[1];

          if (_binding[0] === 'model' && this.model) {
            deconstructedBinding.other = this.model;
          } else if (_binding[0] === 'collection' && this.collection) {
            deconstructedBinding.other = this.collection;
          } else {
            return null;
          }

          if (_.last(_binding) === 'once') deconstructedBinding.once = true;
        } else {
          return null;
        }
      } else {
        return null;
      }

      return deconstructedBinding;
    },

    registerBinding: function (binding, callback) {
      var _binding, eventName, binded;

      if (_.isFunction(callback)) {
        callback = callback.bind(this);
      } else {
        callback = this[callback];
      }

      if (!binding || !callback || !_.isString(binding)) return this;
      _binding = this._deconstructBinding(binding);
      if (!_binding) return this;

      if (_binding.other.cid === this.cid) {
        if (_binding.once) {
          this.once(_binding.eventName, callback, this);
        } else {
          this.on(_binding.eventName, callback, this);
        }
      } else {
        if (_binding.once) {
          this.listenToOnce(_binding.other, _binding.eventName, callback);
        } else {
          this.listenTo(_binding.other, _binding.eventName, callback);
        }
      }

      this.bindings[binding] = callback;
      return this;
    },

    unregisterBinding: function (binding) {
      var _binding;

      if (binding && this.bindings[binding]) {
        _binding = this._deconstructBinding(binding);

        if (!_binding) return this;

        if (_binding.other.cid === this.cid) {
          this.off(_binding.eventName);
        } else {
          this.stopListening(_binding.other, _binding.eventName);
        }

        delete this.bindings[binding];
      }

      return this;
    },

    registerBindings: function (bindings) {
      bindings = bindings || this.bindings;

      _.forOwn(bindings, function (callback, binding) {
        this.registerBinding(binding, callback);
      }.bind(this));

      return this;
    },

    unregisterBindings: function (bindings) {
      bindings = bindings || this.bindings;

      _.forOwn(bindings, function (callback, binding) {
        this.unregisterBinding(binding);
      }.bind(this));

      return this;
    },

    delegateEvent: function (selector, eventName, callback) {
      var originalEventName;

      if (arguments.length === 2) {
        callback = eventName;
        eventName = selector;
        selector = undefined;
      }

      if (_.isFunction(callback)) {
        callback = callback.bind(this);
      } else {
        callback = this[callback];
      }

      if (!eventName || !callback) return this;
      if (selector && this.getElementSelector(selector)) selector = this.getElementSelector(selector);

      originalEventName = eventName;
      eventName += '.delegateEvents' + this.cid;

      if (selector) {
        this.$el.on(eventName, selector, callback);
        this.events[originalEventName + ' ' + selector] = callback;
      } else {
        this.$el.on(eventName, callback);
        this.events[originalEventName] = callback;
      }

      return this;
    },

    undelegateEvent: function (selector, eventName) {
      if (arguments.length === 2) {
        this.$el.off(eventName + '.delegateEvents' + this.cid, selector);
        delete this.events[eventName + ' ' + selector];
      } else if (arguments.length === 1) {
        eventName = selector;
        this.$el.off(eventName + '.delegateEvents' + this.cid);
        delete this.events[eventName];
      }

      return this;
    },

    setModel: function (model) {
      model = model || this.model;

      if (!model) return this;
      if (_.isFunction(model)) model = new model();
      this.model = model;

      return this;
    },

    setCollection: function (collection) {
      collection = collection || this.collection;

      if (!collection) return this;
      if (_.isFunction(collection)) collection = new collection();
      this.collection = collection;

      return this;
    },

    container: null,

    $container: null,

    setContainer: function (container) {
      container = container || this.container;

      if (!container) {
        this.container = this.el;
        this.$container = this.$el;
      } else {
        this.container = container;
        this.$container = this.$(this.container);
        if (!this.$container.length) this.$container = this.$el;
      }

      this.containerIsSet = true;
      return this;
    },

    template: '',

    context: function () {
      if (this.model) {
        return this.model.getPresenters();
      } else if (this.collection) {
        return this.collection.getPresenters();
      } else {
        return {};
      }
    },

    renderTemplate: function (template, context) {
      if (!context) {
        if (_.isPlainObject(template)) {
          context = template;
          template = this.template;
        } else if (_.isFunction(template) || _.isString(template)) {
          context = _.result(this, 'context');
          template = template;
          if (_.isFunction(template)) template = template.bind(this);
        } else {
          context = _.result(this, 'context');
          template = this.template;
        }
      } else {
        context = context || _.result(this, 'context');
        template = template || this.template;
      }

      if (_.isFunction(template)) {
        return template(context);
      } else if (_.isString(template)) {
        return template;
      } else {
        return '';
      }
    },

    render: function (template, context) {
      var output = this.renderTemplate(template, context);

      if (!output) return this;
      if (!this.containerIsSet) this.setContainer();
      this.$container.html(output);
      this.isRendered = true;
      this.isFirstRender = false;

      return this;
    },

    insert: function (destination) {
      if (destination) {
        if (this.isFirstRender) this.render();
        this.$el.appendTo(destination);
        this.isInserted = true;
      }

      return this;
    },

    unplug: function (deep) {
      deep = deep || false;

      this.off();
      this.stopListening();
      this.undelegateEvents();
      this.unregisterElements();
      this.unregisterBindings();
      this.isUnplugged = true;

      delete this.parent;
      if (deep) this.unplugChildren(deep);

      return this;
    },

    remove: function () {
      this.unplug(true);
      this.$el.remove();
      this.children = {};
      this.isRemoved = true;
      return this;
    },

    addChild: function (child, data) {
      data = data || {};

      if (child) {
        if (_.isFunction(child)) child = new child(data);
        if (!child.cid) return this;
        child.parent = this;
        this.children[child.cid] = child;
      }

      return child;
    },

    addChildren: function (children) {
      if (_.isArray(children)) _.forEach(children, this.addChild, this);
      return this;
    },

    forEachChild: function (callback) {
      if (!_.isFunction(callback)) callback = this[callback];
      if (callback) _.forOwn(this.children, callback.bind(this));
      return this;
    },

    getChild: function (comparator) {
      var child;

      if (_.isFunction(comparator)) {
        comparator = comparator.bind(this);

        this.forEachChild(function (_child) {
          child = comparator(_child) ? _child : null;
          if (child) return false;
        });

        return child;
      }

      return null;
    },

    getChildren: function (comparator) {
      var children = [];

      if (_.isFunction(comparator)) {
        comparator = comparator.bind(this);

        this.forEachChild(function (child) {
          if (comparator(child)) children.unshift(child);
        });
      }

      return children;
    },

    getChildByCid: function (cid) {
      return _.find(this.children, function (child) {
        return child.cid === cid;
      });
    },

    getChildByName: function (name) {
      return _.find(this.children, function (child) {
        return child.name === name;
      });
    },

    unplugChildren: function (deep) {
      deep = deep || false;

      this.forEachChild(function (child) {
        child.unplug(deep);
      });
    }
  });

  _.extend(Zeppelin.View.prototype, Zeppelin.Events);

  Zeppelin.FormView = Zeppelin.View.extend({
    constructor: function () {
      this.formIsSet = false;
      Zeppelin.View.prototype.constructor.apply(this, arguments);
    },

    model: Zeppelin.Model,

    setModel: function () {
      Zeppelin.View.prototype.setModel.apply(this, arguments);
      this.listenTo(this.model, 'valid', this.onValid);
      this.listenTo(this.model, 'invalid', this.onInvalid);
      return this;
    },

    form: null,

    $form: null,

    setForm: function (form) {
      form = form || this.form;

      if (!form) {
        this.form = this.el;
        this.$form = this.$el;
      } else {
        this.form = form;
        this.$form = this.$(this.form);

        if (!this.$form.length) {
          this.$form = this.$el;
        }
      }

      this.formIsSet = true;

      this.$form.on('submit', function (event) {
        this.onSubmit(event);
      }.bind(this));

      return this;
    },

    onSubmit: function (event) {
      event.preventDefault();
      this.setAttributes();
    },

    render: function () {
      Zeppelin.View.prototype.render.apply(this, arguments);

      if (!this.formIsSet) {
        this.setForm();
      }
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
      }.bind(this));

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
      }.bind(this));

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
      }.bind(this));

      return this;
    },

    onValid: function (model, attributes) {
      _.forOwn(attributes, function (value, attributeName) {
        this.getAttributeElement(attributeName).removeClass(this.errorClass);
        this.getAttributeErrorElement(attributeName).text('');
      }.bind(this));

      return this;
    },

    reset: function () {
      this.$form.find('[name]').removeClass(this.errorClass);
      this.$form.find('[data-error]').text('');
      return this;
    }
  });

  Zeppelin.CollectionView = Zeppelin.View.extend({
    constructor: function () {
      this.listIsSet = false;
      this.isFiltered = false;
      this.collectionIsRendered = false;

      this.setItemView();
      Zeppelin.View.prototype.constructor.apply(this, arguments);
    },

    collection: Zeppelin.Collection,

    setCollection: function () {
      Zeppelin.View.prototype.setCollection.apply(this, arguments);
      this.listenTo(this.collection, 'add', this.onAdd);
      this.listenTo(this.collection, 'remove', this.onRemove);
      return this;
    },

    onAdd: function (model) {

    },

    onRemove: function (model) {

    },

    list: null,

    $list: null,

    setList: function (list) {
      list = list || this.list;

      if (!list) {
        this.list = this.el;
        this.$list = this.$el;
      } else {
        this.list = list;
        this.$list = this.$(this.list);

        if (!this.$list.length) {
          this.$list = this.$el;
        }
      }

      this.listIsSet = true;
      return this;
    },

    itemView: Zeppelin.View,

    setItemView: function (view) {
      if (_.isFunction(view)) {
        this.itemView = view;
      }

      return this;
    },

    renderItem: function (model) {
      if (model && model.cid) {
        return this.addChild(this.itemView, {
          model: model
        }).render();
      }

      return null;
    },

    renderCollection: function () {
      var fragment;

      if (this.listIsSet && this.collection.length) {
        fragment = document.createDocumentFragment();

        this.collection.each(function (item) {
          fragment.appendChild(this.renderItem(item).el);
        }.bind(this));

        this.$list.html(fragment);
        this.isFiltered = false;
        this.collectionIsRendered = true;
      }

      return this;
    },

    render: function () {
      Zeppelin.View.prototype.render.apply(this, arguments);

      if (!this.listIsSet) {
        this.setList();
      }

      this.renderCollection();
    },

    getItemElement: function (comparator) {
      var $element;

      if (_.isFunction(comparator)) {
        comparator = comparator.bind(this);

        this.forEachChild(function (child) {
          $element = comparator(child) ? child.$el : null;

          if ($element) {
            return false;
          }
        });

        return $element;
      }

      return null;
    },

    getItemElements: function (comparator) {
      var $elements = [];

      if (_.isFunction(comparator)) {
        comparator = comparator.bind(this);

        this.forEachChild(function (child) {
          if (comparator(child)) {
            $elements.unshift(child);
          }
        });
      }

      return $elements;
    },

    filter: function (comparator) {
      var fragment, filteredModels, filteredCollection = this.collection.clone();

      if (_.isFunction(comparator)) {
        comparator = comparator.bind(this);
        filteredModels = filteredCollection.filter(comparator);

        if (this.listIsSet) {
          fragment = document.createDocumentFragment();
          filteredCollection.reset(filteredModels);

          filteredCollection.each(function (item) {
            fragment.appendChild(this.renderItem(item).el);
          }.bind(this));

          this.$list.html(fragment);
          this.isFiltered = true;
          this.collectionIsRendered = true;
        }
      }

      return this;
    }
  });

  Zeppelin.Router = Backbone.Router.extend({
    constructor: function () {
      this.cid = _.uniqueId('r');
      this.name = this.name || _.uniqueId('R');

      this.registerSubscriptions();
      Backbone.Router.prototype.constructor.apply(this, arguments);
    },

    start: function (options) {
      if (!Backbone.History.started) {
        Backbone.history.start(options);
      }

      return this;
    },

    reload: function () {
      Backbone.history.loadUrl(Backbone.history.fragment);
    },

    stop: function () {
      if (Backbone.History.started) {
        Backbone.history.stop();
      }

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
    }
  });

  _.extend(Zeppelin.Router.prototype, Zeppelin.Events);

  return Zeppelin;
})(this, Backbone, _);
