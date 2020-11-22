// Event Review

// fake code



// 队列的实现

class QueueSet {
  constructor() {
    this.queueSet = {};
  }
  get(nameSpace) {
    if (!this.queueSet[nameSpace]) {
      this.queueSet[nameSpace] = [];
    }
    
    return this.queueSet[nameSpace];
  }
  pushTo(namespace, message) {
    let queue = this.get(namespace);
    queue.push(message);
  }
  
  has(namespace, message) {
    return Object.prototype.toString.call(this.queueSet[namespace]) === '[object Array]'
  }
  del(namespace, element) {
    // let que = this.get(namespace);
    // let i = que.indexOf(element);
    // if (i > -1) {
    //   que.splice(1,i);
    // }
    this.queueSet[namespace] = this.queueSet[namespace].filter(item => item.handler !== element);
    return que;
  }
  pop(namespace, handler) {
    let que = this.get(namespace);
    que.pop();
  }
}

let que1 = new QueueSet();

que1.pushTo('test1', 123);
console.log(que1);

// 事件的实现
class EventsEmitter {
  constructor() {
    // 句柄，这个应该就是存储on的消息
    this.handlerQueueSet = new QueueSet();
    // 这个是？
    this.messageQueuSet = new QueueSet();
  }
  
  // 融合多条事件流成为一条
  static merge() {
    
  }
  
  fireMessage(type, msg) {
    let que = this.handlerQueueSet.get(type);
    this.messageQueue.pushTo(type, {type,msg});
    // 这里once要怎么用？
    
    for (let handler of que) {
      handler.call(this, msg);
      
      if(once) {
        que.del(type, handler);
      }
    }
    
    
    
  }
  emit() {}
  onMessage(type, cb, options) {
    this.handlerQueueSet.pushTo(type, {
      cb,
      once: options.once
    });
    
    // 如果它设置了监听前面的事件
    let preque = this.messageQueue.get(type);
    cb.call(i, preque.msg);
    
    return this;
  }
  on() {}
  delHandler(){}
  off() {}
  removeListener() {}
  saveHandlerToBuffer() {}
  clearHandlerBuffer() {}
  handlerWrapper() {}
}

var testA = new EventsEmitter();

// 所谓的fire应该就是把他们从队列中拿出来开始依次执行
testA.fireMessage({
  type: 'typeA',
  event: {
    a: 1,
    b: 2
  }
});


// 所谓的on 应该就是把它塞到一个队列里
testA.onMessage(
  'typeA', cb, {listenPreviousEvent: true}
);


// 若fire比较早的话，on比较晚，只能在on中处理


