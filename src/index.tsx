import { DeviceEventEmitter, EmitterSubscription } from 'react-native';
type ListenerType = {
  [key: string]: {
    eventName: string;
    callback: Function;
    emitter: EmitterSubscription;
  };
};
export default class EventRegister {
  static _Listeners = {
    count: 0,
    refs: {} as ListenerType,
  };
  static _Watcher = {
    count: 0,
    refs: {} as ListenerType,
  };
  static onEventListener(eventName: string, callback: () => any): string {
    const eventId = `W-${EventRegister._Watcher.count}${eventName}`;
    const emitter = DeviceEventEmitter.addListener(eventId, callback);
    EventRegister._Watcher.refs[eventId] = {
      eventName,
      callback,
      emitter,
    };
    EventRegister._Watcher.count++;
    return eventName;
  }
  static addEventListener(eventName: string, callback: () => any): string {
    const eventId = `E-${EventRegister._Listeners.count}${eventName}`;
    const emitter = DeviceEventEmitter.addListener(eventId, callback);
    EventRegister._Listeners.count++;
    EventRegister._Listeners.refs[eventId] = {
      eventName,
      callback,
      emitter,
    };
    if (Object.keys(EventRegister._Watcher.refs).length > 0) {
      Object.keys(EventRegister._Watcher).forEach((_eventId) => {
        if (
          EventRegister._Watcher.refs[_eventId] &&
          EventRegister._Watcher.refs[_eventId].eventName === eventName
        ) {
          DeviceEventEmitter.emit(_eventId, true);
        }
      });
    }
    return eventName;
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
          EventRegister._Listeners.refs[eventId].emitter.remove();
          if (EventRegister._Watcher.count > 0) {
            Object.keys(EventRegister._Watcher.refs).forEach((_eventId) => {
              if (
                EventRegister._Watcher.refs[_eventId] &&
                EventRegister._Watcher.refs[_eventId].eventName === eventName
              ) {
                EventRegister._Watcher.refs[_eventId].emitter.remove();
                delete EventRegister._Watcher.refs[_eventId];
                EventRegister._Watcher.count--;
              }
            });
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
