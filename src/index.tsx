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
  static _Watcher: { [key: string]: EmitterSubscription } = {};
  static onEventListener(eventName: string, callback: () => any): string {
    EventRegister._Watcher[eventName] = DeviceEventEmitter.addListener(
      eventName,
      callback
    );
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
    DeviceEventEmitter.emit(eventName, true);
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
          if (
            EventRegister._Listeners.refs[eventId].eventName in
            EventRegister._Watcher
          ) {
            EventRegister._Watcher[
              EventRegister._Listeners.refs[eventId].eventName
            ].remove();
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
