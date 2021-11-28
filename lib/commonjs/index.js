"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.EventWatcher = void 0;

var _reactNative = require("react-native");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class EventRegister {
  static onEventListener(eventName, callback) {
    EventRegister._Watcher[eventName] = _reactNative.DeviceEventEmitter.addListener(eventName, callback);
  }

  static addEventListener(eventName, callback) {
    const eventId = `E-${EventRegister._Listeners.count}${eventName}`;

    const remove = _reactNative.DeviceEventEmitter.addListener(eventId, callback);

    EventRegister._Listeners.count++;
    EventRegister._Listeners.refs[eventId] = {
      eventName,
      callback,
      remove
    };

    _reactNative.DeviceEventEmitter.emit(eventName, true);
  }

  static emitEvent(eventName, data) {
    for (const listenersKey in EventRegister._Listeners) {
      const {
        eventName: lookupEvent
      } = EventRegister._Listeners.refs[listenersKey];

      if (lookupEvent === eventName) {
        _reactNative.DeviceEventEmitter.emit(listenersKey, data);
      }
    }
  }

  static removeEventListener(eventName) {
    for (const listenersKey in EventRegister._Listeners) {
      if (listenersKey in EventRegister._Listeners) {
        const {
          eventName: lookupEvent,
          remove
        } = EventRegister._Listeners.refs[listenersKey];

        if (lookupEvent === eventName) {
          remove && remove();

          if (eventName in EventRegister._Watcher) {
            EventRegister._Watcher[eventName] && EventRegister._Watcher[eventName]();
            delete EventRegister._Watcher[eventName];
          }

          delete EventRegister._Listeners.refs[listenersKey];
        }
      }
    }
  }

  static removeAllListeners() {
    for (const listenersKey in EventRegister._Listeners) {
      if (listenersKey in EventRegister._Listeners) {
        const {
          eventName: lookupEvent
        } = EventRegister._Listeners.refs[listenersKey];
        EventRegister.removeEventListener(lookupEvent);
      }
    }
  }
  /*
   * shortener
   */


  static on(eventName, callback) {
    return EventRegister.addEventListener(eventName, callback);
  }

  static rm(eventName) {
    return EventRegister.removeEventListener(eventName);
  }

  static rmAll() {
    return EventRegister.removeAllListeners();
  }

  static emit(eventName, data) {
    EventRegister.emitEvent(eventName, data);
  }

  static onEvent(eventName, callback) {
    return EventRegister.onEventListener(eventName, callback);
  }

}

exports.EventWatcher = exports.default = EventRegister;

_defineProperty(EventRegister, "_Listeners", {
  count: 0,
  refs: {}
});

_defineProperty(EventRegister, "_Watcher", {});
//# sourceMappingURL=index.js.map