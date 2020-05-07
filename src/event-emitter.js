const _ = require('@hrimsoft/utils').default;
const uuid = require('uuid').v4;

const CONSTS = {
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
class EventEmitter {
    constructor(events) {
        /** Supported event names. It's important to use one object for events and from subscribers and from here.
         *  That's why it's better implement not array of names but object with properties like enum.
         * @example this.events.onLoad = 'onLoad' */
        this.events = {};

        if (Array.isArray(events)) {
            const length = events.length;
            for (let j = 0; j < length; j++) {
                const name = events[j];
                this.events[name] = name;
            }
        } else if (typeof events === 'object') {
            for (let name in events) {
                if (events.hasOwnProperty(name))
                    this.events[name] = name;
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
    on(event, callback) {
        if (typeof (callback) !== 'function')
            return _.consoleError({
                message: CONSTS.errors.argumentIsNotFunction,
                context: {callback: callback}
            });
        if (_.isNull(event))
            return _.consoleError({
                message: 'event is required',
                context: {arguments: arguments, instance: this}
            })

        if (!this.hasEvent(event))
            return _.consoleError({
                message: CONSTS.errors.eventNotSupported,
                context: {event: event, callback: callback}
            });

        let subscribers = getSubscriberByInstance(this);
        if (!subscribers) {
            subscribers = [];
            const subscribersInfo = {
                instance: this,
                subscribers: subscribers
            };
            _subscribersForAllInstances.push(subscribersInfo);
        }

        if (!subscribers[event])
            subscribers[event] = [];

        const eventSubscribers = subscribers[event];
        const subscriberInfo = {
            id: uuid(),
            handler: callback
        };
        eventSubscribers[eventSubscribers.length] = subscriberInfo;
        return subscriberInfo.id;
    };

    /**
     * Unsubscribe from event
     *
     * @param {string} event - event name.
     * @param {string} id - subscription id, which needs to be off. You had to get it from method @see{EventEmitter.on}.
     */
    off(event, id) {
        if (_.isNull(event) || _.isNull(id))
            return;

        if (!this.hasEvent(event))
            return _.consoleError({
                message: CONSTS.errors.eventNotSupported,
                context: {event: event}
            });

        const subscribers = getSubscriberByInstance(this);
        if (!subscribers)
            return;
        if (!subscribers[event])
            return;

        const eventSubscribers = subscribers[event];
        const len = eventSubscribers.length;
        for (let i = 0; i < len; i++) {
            if (eventSubscribers[i].id === id) {
                eventSubscribers.splice(i, 1);
                break;
            }
        }
    };

    /** emit the event and raise each subscribed handler
     * @param {string} event - event name
     * @param {any} customData - user data, which will be sent to each event handler in eventArgs.data
     * @returns {boolean} - if at least one subscriber returns true, the method returns true
     */
    emit(event, customData) {
        if (_.isNull(event))
            return;

        if (!this.hasEvent(event))
            return _.consoleError({
                message: CONSTS.errors.eventNotSupported,
                context: {event: event}
            });

        const subscribers = getSubscriberByInstance(this);
        if (!subscribers)
            return;
        if (!subscribers[event])
            return;

        const eventArgs = {
            name: event,
            data: customData,
            fireTime: new Date(),
            target: this
        };
        const eventSubscribers = subscribers[event];
        const length = eventSubscribers.length;
        let result = false;
        for (let i = 0; i < length; i++) {
            const info = eventSubscribers[i];
            if (result)
                info.handler(eventArgs);
            else
                result = info.handler(eventArgs);
        }
        return result;
    };

    /** Test for supporting event
     * @param {string} event - event name
     * @returns {boolean} Возвращает True если данный экземпляр поддерживает переданное событие.
     * */
    hasEvent(event) {
        let find = false;
        for (let current in this.events) {
            if (!this.events.hasOwnProperty(current))
                continue;
            if (current === event) {
                find = true;
                break;
            }
        }
        return find;
    };

    /** @returns {boolean} returns true if there is at least one listener */
    hasListeners() {
        return getSubscriberByInstance(this).length > 0;
    };
}

export default EventEmitter;

/**
 * Возвращает массив подписчиков на события для конктретного экземпляра потомка класса Eventive
 * @param {object} instance - экземпляр по которому нужно вернуть подписчиков
 * @returns {array} массив в котором для каждого события содержаться ссылки на колбеки подписчиков.
 */
function getSubscriberByInstance(instance) {
    const length = _subscribersForAllInstances.length;
    for (let i = 0; i < length; i++) {
        if (Object.is(_subscribersForAllInstances[i].instance, instance))
            return _subscribersForAllInstances[i].subscribers;
    }
}

/** Array of all subscribers of all events */
const _subscribersForAllInstances = [];