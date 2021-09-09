# fast-forward-timer

收到`jest.advanceTimersByTime(msToRun)`的启发，实现的可以快进延迟的`setTimeout`

## 安装

```bash
npm i fast-forward-timer -save
```

## brower

```js
import { fSetTimeout, forwardAll } from 'fast-forward-timer';

const timer1 = fSetTimeout(() => {
  console.log(1);
}, 3000);
timer1.forward(2000); // 快进2s
timer.delay(500); // 延迟0.5s

const timer2 = fSetTimeout(() => {
  console.log(2);
}, 2000);

forwardAll(1000); // 所有定时器快进1s

// 结果：0.5s -> 1 -> 1s -> 2
```

## node

```js
const { fSetTimeout, forwardAll } = require('fast-forward-timer');
```

