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
    if (Object.keys(EventRegister._Listeners.refs).length > 0) {
      Object.keys(EventRegister._Listeners.refs).forEach((eventId) => {
        if (
          EventRegister._Listeners.refs[eventId] &&
          EventRegister._Listeners.refs[eventId].eventName === eventName
        ) {
          DeviceEventEmitter.emit(eventId, data);
        }
      });
    }
  }
  static removeEventListener(eventName: string) {
    if (Object.keys(EventRegister._Listeners.refs).length > 0) {
      Object.keys(EventRegister._Listeners.refs).forEach((eventId) => {
        if (
          EventRegister._Listeners.refs[eventId] &&
          EventRegister._Listeners.refs[eventId].eventName === eventName
        ) {
          EventRegister._Listeners.refs[eventId].remove &&
            EventRegister._Listeners.refs[eventId].remove();
          if (
            EventRegister._Listeners.refs[eventId].eventName in
            EventRegister._Watcher
          ) {
            EventRegister._Watcher[
              EventRegister._Listeners.refs[eventId].eventName
            ]();
            delete EventRegister._Watcher[
              EventRegister._Listeners.refs[eventId].eventName
            ];
          }
          delete EventRegister._Listeners.refs[eventId];
          EventRegister._Listeners.count--;
        }
      });
    }
  }
  static removeAllListeners() {
    if (EventRegister._Listeners.count > 0) {
      Object.keys(EventRegister._Listeners.refs).forEach((eventId) => {
        if (EventRegister._Listeners.refs[eventId]) {
          EventRegister.removeEventListener(
            EventRegister._Listeners.refs[eventId].eventName
          );
        }
      });
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
