# @hrimsoft/event-emitter-js
![GitHub](https://img.shields.io/github/license/basim108/event-emitter-js)
![npm](https://img.shields.io/npm/v/@hrimsoft/event-emitter)
![npm](https://img.shields.io/npm/dy/@hrimsoft/event-emitter)

EventEmitter provides functionality of subscribing and emitting events for derived classes
# installing
`npm install @hrimsoft/event-emitter --save`

or

`yarn add @hrimsoft/event-emitter`
# usage
```javascript
class MyClass extends EventEmitter{
    constructor() {
        // here list event names
        // it's possible to change the list future in the runtime by changing the this.events object
        super(['onUpdate', 'onError']);
    }
    
    update(){
        // do some work
        this.emit(this.events.onUpdate, { data: someData }); // second argument is optional, and will be sent to all subscribers
    }
}

const obj1 = new MyClass();
obj1.on(obj.events.onUpdate, (eventArgs) => console.log('after update we have been called', eventArgs.data));
obj1.update();
```
## Unsubscribe
```javascript
const obj1 = new MyClass();
const id = obj1.on(obj.events.onUpdate, (eventArgs) => console.log('after update we have been called', eventArgs.data));
obj1.off('onUpdate', id);
// or
obj1.off(obj.events.onUpdate, id);
```
