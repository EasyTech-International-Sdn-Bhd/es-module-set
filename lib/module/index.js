function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { DeviceEventEmitter } from 'react-native';
export default class EventRegister {
  static onEventListener(eventName, callback) {
    EventRegister._Watcher[eventName] = DeviceEventEmitter.addListener(eventName, callback);
  }

  static addEventListener(eventName, callback) {
    const eventId = `E-${EventRegister._Listeners.count}${eventName}`;
    const remove = DeviceEventEmitter.addListener(eventId, callback);
    EventRegister._Listeners.count++;
    EventRegister._Listeners.refs[eventId] = {
      eventName,
      callback,
      remove
    };
    DeviceEventEmitter.emit(eventName, true);
  }

  static emitEvent(eventName, data) {
    for (const listenersKey in EventRegister._Listeners) {
      const {
        eventName: lookupEvent
      } = EventRegister._Listeners.refs[listenersKey];

      if (lookupEvent === eventName) {
        DeviceEventEmitter.emit(listenersKey, data);
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

_defineProperty(EventRegister, "_Listeners", {
  count: 0,
  refs: {}
});

_defineProperty(EventRegister, "_Watcher", {});

export { EventRegister as EventWatcher };
//# sourceMappingURL=index.js.map