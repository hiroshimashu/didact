const ENOUGH_TIME = 1;

let workQueue = [];
let nextUnitOfWork = null;

function scheduler(task) {
    workQueue.push(task);
    requestIdleCallback(performWork);
}

function performWork(deadline) {
    if(!nextUnitOfWork) {
        nextUnitOfWork = workQueue.shift();
    }
    while(nextUnitOfWork && deakline.timeRemaining() > ENOUGH_TIME) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }

    if (nextUnitOfWork || workQueue.length > 0) {
        requestIdleCallback(performWork);
    }
}