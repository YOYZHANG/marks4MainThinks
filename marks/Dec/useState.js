// https://react.iamkasong.com/concurrent/prepare.html#%E4%B8%8A%E5%B1%82%E5%AE%9E%E7%8E%B0


let workInProgressHook;
let isMount = true;

const fiber = {
    memoizedState: null,
    stateNode: App
};
/**
 *
 * 1. 改变workInProgressHook
 * 2. stateNode()
 * 3. isMount
*/

function schedule() {
    workInProgressHook = fiber.memoizedState;
    // 触发组件render
    const app = fiber.stateNode();
    isMount = false;
    return app;
}


/**
 * 1. 取出对应的hook
 * 2. 赋值hook.memoizedState
 * 3. 根据queue.pending中保存的update更新state
 * @param {*} initialState 
 */
function useState(initialState) {
    let hook;

    // 为hook赋值
    if (isMount) {
        hook = {
           queue: {
               pending: null
           },
           // 保存hook对应的state
           memoizedState: initialState,
           // 与下一个 hook 连接形成单向无环链表
           next: null
        }

        // 将hook
        if (!fiber.memoizedState) {
            fiber.memoizedState = hook;
        } else {
            workInProgressHook.next = hook;
        }
        workInProgressHook = hook;
    } else {
        hook = workInProgressHook;
        // 在组件render时，每当遇到下一个usestate，就移动指针
        workInProgressHook = workInProgressHook.next;
    }

    let baseState = hook.memoizedState;
    if (hook.queue.pending) {
        let firstUpdate = hook.queue.pending.next;

        do {
            const action = firstUpdate.action;
            baseState = action(baseState);
            firstUpdate = firstUpdate.next;
        } while (firstUpdate !== hook.queue.pending)

        hook.queue.pending = null;
    }
    hook.memoizedState = baseState;

    return [baseState, dispatchAction.bind(null, hook.queue)];
}

/**
 * 1. 改造queue
 * 2. 执行schedule
 *
 * @param {*} queue
 * @param {*} action
 */
function dispatchAction(queue, action) {
    // 更新
    const update = {
        action,
        // 与同一个hook的其他更新形成链表
        next: null
    }

    // 环状单向链表操作
    // queue.pending.next指向最后一个的update
    if (queue.pending === null) {
        update.next = update;
    } else {
        update.next = queue.pending.next;
        queue.pending.next = update;
    }

    queue.pending = update;

    // 开始调度更新
    schedule();
}



function App() {
    const [num, updateNum] = useState(0);
    console.log(`${isMount ? 'mount' : 'update'} num:`, num);

    return {
        click() {
            updateNum(num => num + 1);
        }
    }

}

window.app = schedule();

