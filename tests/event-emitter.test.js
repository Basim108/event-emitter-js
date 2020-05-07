const {expect, test} = require("@jest/globals");
const TestModel = require('./model').default;

test('given 2 events should have them', () => {
    const obj = new TestModel();
    expect(obj.events).toEqual({"onError": "onError", "onUpdate": "onUpdate"});
});

test('should subscribe to an existing event', () => {
    const obj = new TestModel();
    const mockCallback = jest.fn(function (eventArgs){});
    obj.on('onUpdate', mockCallback);
    obj.emit('onUpdate');
    expect(mockCallback.mock.calls.length).toBe(1);
});

test('should not subscribe to an unknown event', () => {
    const obj = new TestModel();
    const mockCallback = jest.fn(function (eventArgs){});
    obj.on('SomeEvent', mockCallback);
    obj.emit('SomeEvent');
    expect(mockCallback.mock.calls.length).toBe(0);
});

test('should unsubscribe from a subscribed event', () => {
    const obj = new TestModel();
    const mockCallback = jest.fn(function (eventArgs){});
    const id = obj.on('onUpdate', mockCallback);
    obj.off('onUpdate', id);
    obj.emit('onUpdate');
    expect(mockCallback.mock.calls.length).toBe(0);
});

test('should not raise an error when off() called many times with the same id', () => {
    const obj = new TestModel();
    const mockCallback = jest.fn(function (eventArgs){});
    const id = obj.on('onUpdate', mockCallback);
    obj.off('onUpdate', id);
    obj.off('onUpdate', id);
    obj.emit('onUpdate');
    expect(mockCallback.mock.calls.length).toBe(0);
});

test('should call only those subscibers who subscribe to the specific event', () => {
    const obj = new TestModel();
    const mockCallback1 = jest.fn(function (eventArgs){});
    const mockCallback2 = jest.fn(function (eventArgs){});
    obj.on('onUpdate', mockCallback1);
    obj.on('onError', mockCallback2);
    obj.emit('onUpdate');
    expect(mockCallback1.mock.calls.length).toBe(1);
    expect(mockCallback2.mock.calls.length).toBe(0);
});

test('should call all subscribers who subscribed to an event', () => {
    const obj = new TestModel();
    const mockCallback1 = jest.fn(function (eventArgs){});
    const mockCallback2 = jest.fn(function (eventArgs){});
    obj.on('onUpdate', mockCallback1);
    obj.on('onUpdate', mockCallback2);
    obj.emit('onUpdate');
    expect(mockCallback1.mock.calls.length).toBe(1);
    expect(mockCallback2.mock.calls.length).toBe(1);
});

test('should allow extend events dynamically', () => {
    const obj = new TestModel();
    obj.events.onDelete = 'onDelete';
    const mockCallback = jest.fn(function (eventArgs){});
    obj.on('onDelete', mockCallback);
    obj.emit('onDelete');
    expect(mockCallback.mock.calls.length).toBe(1);
});