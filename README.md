## jdf-log

jdf使用的日志模块，基于winston

### Methods

* level(levelName) get/set 设置日志优先级，采用npm的level方式，共5个日志级别
``` js
{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
```
`日志级别越高，显示的内容越多`。如果不给参数，就返回当前的日志级别，如果给定参数就设置成需要的级别。
* profile(name,[startFormatter], [endFormatter]) 获取某个函数的执行时间，开始调用一次，结束调用一次，*startFormatter*和*endFormatter*为可选参数，如果不提供则会有一个默认的日志输出。默认的格式是：
``` js
`Starting '${name}'...`
`Finished '${name}' after ${timeSpan} ms`
```
你可以提供自定义的输出，注意他们的参数，startFormatter给定的是name，而endFormatter给定的是name和timeSpan，timeSpan单位是ms，你可以仅在开始的时候提供startFormatter和endFormatter：
``` js
const startFn = (name) => {
    logger.info(`Run ${name}`);
}

const endFn = (name, timeSpan) => {
    logger.info(`Finish ${name}, uesd about ${timeSpan} ms`)
}

logger.profile('test command', startFn, endFn);
setTimeout(function() {
    logger.profile('test command');
},1234);

// output
Run test command
Finish test command, used about 1234 ms
```
* error(), warn(), info(), verbose(), debug(), silly() 参考[winston](https://github.com/winstonjs/winston#using-logging-levels)的对应函数

### Work in jdf

jdf的入口处获取参数，看是否需要verbose方式，内部的日志，常规显示的可以用logger.info()，需要啰嗦模式的就用logger.verbose()，当然如果需要更啰嗦的方式，可以用logger.debug()，根据入口的配置设置显示的level级别即可，现在
verbose 级别的日志级别名称，会在最后展示的时候设置成info，主要是为了统一，其他的都还是原来的日志级别的名字

一个简单的demo
``` js
logger.level('verbose');

logger.profile('output');
logger.warn('Hello distributed log files! %d aaa %d', 123, 456);
logger.info('this is step one');
logger.info('this is step two');
logger.silly('ni da yeeeee de'); // 当前日志级别是verbose,所有silly级别的日志不会显示
logger.error(new Error('this is an error').message);
logger.verbose('Verboseeeeeeeeeeeeeeeeeee!');
setTimeout(() => {
  logger.profile('output');
},1000);
```
输出为：
``` sh
[09:58:27] Starting 'output'...
[09:58:27] WARN Hello distributed log files! 123 aaa 777
[09:58:27] INFO this is step one
[09:58:27] INFO this is step two
[09:58:27] ERROR this is an error
[09:58:27] INFO Verboseeeeeeeeeeeeeeeeeee!
[09:58:28] Finished 'output' after 1012 ms
```
