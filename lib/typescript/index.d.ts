declare type ListenerType = {
    [key: string]: {
        eventName: string;
        callback: Function;
        remove: Function;
    };
};
export default class EventRegister {
    static _Listeners: {
        count: number;
        refs: ListenerType;
    };
    static _Watcher: {
        [key: string]: any;
    };
    static onEventListener(eventName: string, callback: () => any): void;
    static addEventListener(eventName: string, callback: () => any): void;
    static emitEvent(eventName: string, data: any): void;
    static removeEventListener(eventName: string): void;
    static removeAllListeners(): void;
    static on(eventName: string, callback: () => any): void;
    static rm(eventName: string): void;
    static rmAll(): void;
    static emit(eventName: string, data: any): void;
    static onEvent(eventName: string, callback: () => any): void;
}
export { EventRegister as EventWatcher };
