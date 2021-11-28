import { DeviceEventEmitter } from 'react-native';
type ListenerType = {
  [key: string]: {
    eventName: string;
    callback: Function;
    remove: Function;
  };
};
export default class EventRegister {
  static _Listeners = {
    count: 0,
    refs: {} as ListenerType,
  };
  static _Watcher: { [key: string]: any } = {};
  static onEventListener(eventName: string, callback: () => any): void {
    EventRegister._Watcher[eventName] = DeviceEventEmitter.addListener(
      eventName,
      callback
    );
  }
  static addEventListener(eventName: string, callback: () => any) {
    const eventId = `E-${EventRegister._Listeners.count}${eventName}`;
    const remove = DeviceEventEmitter.addListener(eventId, callback);
    EventRegister._Listeners.count++;
    EventRegister._Listeners.refs[eventId] = {
      eventName,
      callback,
      remove,
    };
    DeviceEventEmitter.emit(eventName, true);
  }
  static emitEvent(eventName: string, data: any) {
    for (const listenersKey in EventRegister._Listeners.refs) {
      const { eventName: lookupEvent } =
        EventRegister._Listeners.refs[listenersKey];
      if (lookupEvent === eventName) {
        DeviceEventEmitter.emit(listenersKey, data);
      }
    }
  }
  static removeEventListener(eventName: string) {
    for (const listenersKey in EventRegister._Listeners.refs) {
      if (listenersKey in EventRegister._Listeners.refs) {
        const { eventName: lookupEvent, remove } =
          EventRegister._Listeners.refs[listenersKey];
        if (lookupEvent === eventName) {
          remove && remove();
          if (eventName in EventRegister._Watcher) {
            EventRegister._Watcher[eventName] &&
              EventRegister._Watcher[eventName]();
            delete EventRegister._Watcher[eventName];
          }
          delete EventRegister._Listeners.refs[listenersKey];
          EventRegister._Listeners.count--;
        }
      }
    }
  }
  static removeAllListeners() {
    for (const listenersKey in EventRegister._Listeners) {
      if (listenersKey in EventRegister._Listeners) {
        const { eventName: lookupEvent } =
          EventRegister._Listeners.refs[listenersKey];
        EventRegister.removeEventListener(lookupEvent);
      }
    }
  }
  /*
   * shortener
   */
  static on(eventName: string, callback: () => any) {
    return EventRegister.addEventListener(eventName, callback);
  }

  static rm(eventName: string) {
    return EventRegister.removeEventListener(eventName);
  }

  static rmAll() {
    return EventRegister.removeAllListeners();
  }

  static emit(eventName: string, data: any) {
    EventRegister.emitEvent(eventName, data);
  }

  static onEvent(eventName: string, callback: () => any) {
    return EventRegister.onEventListener(eventName, callback);
  }
}
export { EventRegister as EventWatcher };
