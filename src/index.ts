import { MinPriorityQueue } from '@datastructures-js/priority-queue';

type SetTimeout = ReturnType<typeof setTimeout>;

interface TimerInfo {
  callback: Function,
  expiry: number,
  timer: SetTimeout
}

const timerMap: Map<number, TimerInfo> = new Map();
let id = 0;

function _createNewTimer (uuid: number, callback: Function, newExpiry: number, now: number): void {
  timerMap.set(uuid, {
    callback,
    expiry: newExpiry,
    // @ts-ignore
    timer: setTimeout(callback, newExpiry - now)
  });
}

function _clearTimer (uuid: number, timer: SetTimeout): void {
  clearTimeout(timer);
  timerMap.delete(uuid);
}

function fSetTimeout (fn: Function, ms: number) {
  let uuid = id++;

  function callback () {
    clear();
    fn();
  }

  let _timer: SetTimeout = setTimeout(callback, ms);

  timerMap.set(uuid, {
    callback,
    expiry: new Date().getTime() + ms,
    timer: _timer,
  });

  function forward (ms: number): void {
    const timerInfo = timerMap.get(uuid);
    if (!timerInfo) {
      return;
    }
    _clearTimer(uuid, timerInfo.timer);
    const now = new Date().getTime();
    const newExpiry = timerInfo.expiry - ms;
    if (newExpiry <= now) {
      timerInfo.callback();
    } else {
      _createNewTimer(uuid, timerInfo.callback, newExpiry, now);
    }
  }

  function delay (ms: number): void {
    const timerInfo = timerMap.get(uuid);
    if (!timerInfo) {
      return;
    }
    _clearTimer(uuid, timerInfo.timer);
    const now = new Date().getTime();
    _createNewTimer(uuid, timerInfo.callback, timerInfo.expiry + ms, now);
  }

  function clear (): void {
    const timerInfo = timerMap.get(uuid);
    if (!timerInfo) {
      return;
    }
    _clearTimer(uuid, timerInfo.timer);
  }

  return {
    forward,
    delay,
    clear
  };
}

function forwardAll (ms: number): void {
  const now = new Date().getTime();
  const callbackQueue = new MinPriorityQueue<Function>();
  const entries = Array.from(timerMap.entries());
  entries.forEach(([uuid, timerInfo]) => {
    _clearTimer(uuid, timerInfo.timer);
    const newExpiry = timerInfo.expiry - ms;
    if (newExpiry <= now) {
      callbackQueue.enqueue(timerInfo.callback, newExpiry);
    } else {
      _createNewTimer(uuid, timerInfo.callback, newExpiry, now);
    }
  });

  while (!callbackQueue.isEmpty()) {
    callbackQueue.dequeue().element();
  }
}

export {
  fSetTimeout,
  forwardAll
};
