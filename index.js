'use strict';

const winston = require('winston');
require('colors');

function padLeft(n, m, p) {
  p = p || '0';
  m = m || 2;
  n = n.toString();
  return n.length >= m ? n : new Array((m - n.length) + 1).join(p) + n;
}

const logger = new winston.Logger({
  level: 'info',
  transports: [
    new (winston.transports.Console)({
      timestamp: function() {
        const now = new Date();
        return `[${padLeft(now.getHours())}:${padLeft(now.getMinutes())}:${padLeft(now.getSeconds())}]`.cyan;
      },
      formatter: function(options) {
        if (options.level === 'verbose') { // 对于verbose类的日志，强制转化成info类日志
          options.level = 'info';
        }
        let output = options.timestamp();
        output += !options.meta.igl ? ' ' + winston.config.colorize(options.level, options.level.toUpperCase()) : '';
        output += ' ' + (options.message ? options.message : '');
        return output;
      },
    }),
  ],
});

/**
 * 设置或者获取logger的级别
 * @param level
 */
module.exports.level = function(level) { // eslint-disable-line
  if (!level) {
    return logger.level;
  }
  logger.level = level;
};

const profilers = {};
/**
 * 返回一个测试需要的时间，单位是毫秒，同同时间段内只支持一个name，不可重名
 * @param name 名称
 * @param startFormatter profile开始调用的格式化函数，如果提供了改函数，那么就不采用内置的格式化
 * @param endFormatter profile结束调用的格式化函数，如果提供了改函数，那么就不采用内置的格式化，该函数会接收两个参数name和timeSpan
 */
module.exports.profile = function(name, startFormatter, endFormatter) {
  const now = Date.now();
  let then;

  if (profilers[name]) {
    then = profilers[name].time;
    const timeSpan = now - then;
    if (profilers[name].end) {
      profilers[name].end(name, timeSpan);
      delete profilers[name];
      return;
    }
    module.exports.info(`Finished '${'output'.cyan}' after ${timeSpan.toString().magenta} ms`, { igl: true }); // igl意思是ignore level
  } else {
    profilers[name] = {
      time: now,
      end: endFormatter,
    };

    if (startFormatter) {
      startFormatter(name);
      return;
    }
    module.exports.info(`Starting '${name.cyan}'...`, { igl: true });
  }
}

const methods = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];

methods.forEach((method) => {
  module.exports[method] = function() {
    logger[method].apply(logger, Array.prototype.slice.call(arguments)) // eslint-disable-line
  }
});

module.exports.addColors = winston.addColors;
winston.addColors({
  warn: 'yellow',
  error: 'red',
  info: 'green',
});
