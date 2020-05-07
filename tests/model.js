const EventEmitter = require('../dist/event-emitter').default;

class TestModel extends EventEmitter{
    constructor() {
        super(['onUpdate', 'onError']);
    }
}
export default TestModel;