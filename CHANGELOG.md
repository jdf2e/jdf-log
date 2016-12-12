changelog

## 0.0.4

* 修复了profile循环调用时，计时都是从初次调用开始的错误

## 0.0.3

* 调用error()方法时，如果只有一个参数输入同时参数的是Error或者Object时，分别打印合理的日志信息,Error类打印stack信息，Object直接用JSON.stringify格式化

## 0.0.1
* initial
