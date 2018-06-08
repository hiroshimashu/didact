const HOST_COMPONENT = "host";
const CLASS_COMPONENT =  "class";
const HOST_ROOT = "root";

const updateQueue = [];
let nextUnitOfWork = null;
let pendingCommit = null;

function render(elements, containerDom) {
    updateQueue.push({
        from: HOST_ROOT,
        dom: containerDom,
        newProps: { children: elements }
    });
    requestIdleCallback(performWork);
}

function scheduleUpdate(instance, partialState) {
    updateQueue.push({
        from: CLASS_COMPONENT,
        instance: instance,
        partialState: partialState
    });
    requestIdleCallback(performWork);
}

const ENOUGH_TIME = 1;

function performWork(deadline) {
    workLoop(deadline);
    if (nextUnitOfWork || updateQueue.length > 0) {
        requestIdleCallback(performWork);
    }
}

function workLoop(deadline) {
    if(!nextUnitOfWork) {
        reserNextUnitOfWork();
    }
    while (nextUnitOfWork && deadline.timeRemaining() > ENOUGH_TIME) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
    if (pendingCommit) {
        commitAllWork(pendingCommit);
    }
}