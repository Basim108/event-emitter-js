"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _ = require('@hrimsoft/utils')["default"];

var uuid = require('uuid').v4;

var CONSTS = {
  errors: {
    argumentIsNotFunction: 'Argument is not a function: ',
    eventNotSupported: 'Event not supported: ',
    wrongTypeOfId: 'Wrong identifier type'
  }
};
/**
 * @class
 * @summary EventEmitter provides functionality of subscribing and emitting events for derived classes
 * @param {Array|object} events - supported event names.
 * */

var EventEmitter = /*#__PURE__*/function () {
  function EventEmitter(events) {
    _classCallCheck(this, EventEmitter);

    /** Supported event names. It's important to use one object for events and from subscribers and from here.
     *  That's why it's better implement not array of names but object with properties like enum.
     * @example this.events.onLoad = 'onLoad' */
    this.events = {};

    if (Array.isArray(events)) {
      var length = events.length;

      for (var j = 0; j < length; j++) {
        var name = events[j];
        this.events[name] = name;
      }
    } else if (_typeof(events) === 'object') {
      for (var _name in events) {
        if (events.hasOwnProperty(_name)) this.events[_name] = _name;
      }
    }
  }
  /**
   * Subscribe on an event
   *
   * @param {string} event - event name. @see{EventEmitter.events}
   * @param {function} callback - an event handler function, which will be called on emitting the event.
   * @returns {number|undefined} id of subscription; by this id you can unsubscribe in future @see{EventEmitter.off}.
   *                             returns undefined when an error occurred.
   */


  _createClass(EventEmitter, [{
    key: "on",
    value: function on(event, callback) {
      if (typeof callback !== 'function') return _.consoleError({
        message: CONSTS.errors.argumentIsNotFunction,
        context: {
          callback: callback
        }
      });
      if (_.isNull(event)) return _.consoleError({
        message: 'event is required',
        context: {
          arguments: arguments,
          instance: this
        }
      });
      if (!this.hasEvent(event)) return _.consoleError({
        message: CONSTS.errors.eventNotSupported,
        context: {
          event: event,
          callback: callback
        }
      });
      var subscribers = getSubscriberByInstance(this);

      if (!subscribers) {
        subscribers = [];
        var subscribersInfo = {
          instance: this,
          subscribers: subscribers
        };

        _subscribersForAllInstances.push(subscribersInfo);
      }

      if (!subscribers[event]) subscribers[event] = [];
      var eventSubscribers = subscribers[event];
      var subscriberInfo = {
        id: uuid(),
        handler: callback
      };
      eventSubscribers[eventSubscribers.length] = subscriberInfo;
      return subscriberInfo.id;
    }
  }, {
    key: "off",

    /**
     * Unsubscribe from event
     *
     * @param {string} event - event name.
     * @param {string} id - subscription id, which needs to be off. You had to get it from method @see{EventEmitter.on}.
     */
    value: function off(event, id) {
      if (_.isNull(event) || _.isNull(id)) return;
      if (!this.hasEvent(event)) return _.consoleError({
        message: CONSTS.errors.eventNotSupported,
        context: {
          event: event
        }
      });
      var subscribers = getSubscriberByInstance(this);
      if (!subscribers) return;
      if (!subscribers[event]) return;
      var eventSubscribers = subscribers[event];
      var len = eventSubscribers.length;

      for (var i = 0; i < len; i++) {
        if (eventSubscribers[i].id === id) {
          eventSubscribers.splice(i, 1);
          break;
        }
      }
    }
  }, {
    key: "emit",

    /** emit the event and raise each subscribed handler
     * @param {string} event - event name
     * @param {any} customData - user data, which will be sent to each event handler in eventArgs.data
     * @returns {boolean} - if at least one subscriber returns true, the method returns true
     */
    value: function emit(event, customData) {
      if (_.isNull(event)) return;
      if (!this.hasEvent(event)) return _.consoleError({
        message: CONSTS.errors.eventNotSupported,
        context: {
          event: event
        }
      });
      var subscribers = getSubscriberByInstance(this);
      if (!subscribers) return;
      if (!subscribers[event]) return;
      var eventArgs = {
        name: event,
        data: customData,
        fireTime: new Date(),
        target: this
      };
      var eventSubscribers = subscribers[event];
      var length = eventSubscribers.length;
      var result = false;

      for (var i = 0; i < length; i++) {
        var info = eventSubscribers[i];
        if (result) info.handler(eventArgs);else result = info.handler(eventArgs);
      }

      return result;
    }
  }, {
    key: "hasEvent",

    /** Test for supporting event
     * @param {string} event - event name
     * @returns {boolean} Возвращает True если данный экземпляр поддерживает переданное событие.
     * */
    value: function hasEvent(event) {
      var find = false;

      for (var current in this.events) {
        if (!this.events.hasOwnProperty(current)) continue;

        if (current === event) {
          find = true;
          break;
        }
      }

      return find;
    }
  }, {
    key: "hasListeners",

    /** @returns {boolean} returns true if there is at least one listener */
    value: function hasListeners() {
      return getSubscriberByInstance(this).length > 0;
    }
  }]);

  return EventEmitter;
}();

var _default = EventEmitter;
/**
 * Возвращает массив подписчиков на события для конктретного экземпляра потомка класса Eventive
 * @param {object} instance - экземпляр по которому нужно вернуть подписчиков
 * @returns {array} массив в котором для каждого события содержаться ссылки на колбеки подписчиков.
 */

exports["default"] = _default;

function getSubscriberByInstance(instance) {
  var length = _subscribersForAllInstances.length;

  for (var i = 0; i < length; i++) {
    if (Object.is(_subscribersForAllInstances[i].instance, instance)) return _subscribersForAllInstances[i].subscribers;
  }
}
/** Array of all subscribers of all events */


var _subscribersForAllInstances = [];