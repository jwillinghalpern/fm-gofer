!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("FMPromise",[],t):"object"==typeof exports?exports.FMPromise=t():e.FMPromise=t()}(self,(function(){return e={579:e=>{function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,t){for(var o=0;o<t.length;o++){var r=t[o];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var r=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.callbacks={},this.nextID=0}var r,n;return r=e,(n=[{key:"createCallback",value:function(e,t,o,r){var n={resolve:e,reject:t};0!==o&&(n.timeoutID=setTimeout((function(){t(r||"The FM script call timed out")}),o));var i=this.nextID;return this.callbacks[i]=n,this.nextID++,i}},{key:"deleteCallback",value:function(e){delete this.callbacks[e]}},{key:"getCallback",value:function(e){return this.callbacks[e]}},{key:"runCallback",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"resolve",o=arguments.length>2?arguments[2]:void 0;try{var r=this.getCallback(e);r.timeoutID&&clearTimeout(r.timeoutID),"reject"===t.toLowerCase()?r.reject(o):r.resolve(o),this.deleteCallback(e)}catch(e){console.error(e),alert(e)}}},{key:"performScriptWithOption",value:function(e){var o=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1e3,l=arguments.length>4?arguments[4]:void 0;return new Promise((function(a,c){r.callbackID=o.createCallback(a,c,i,l);var u=setInterval((function(){"object"===("undefined"==typeof FileMaker?"undefined":t(FileMaker))&&(clearInterval(u),window.FileMaker.PerformScriptWithOption(e,JSON.stringify(r),n))}),5)}))}},{key:"performScript",value:function(e,t,o,r){return this.performScriptWithOption(e,t,null,o,r)}}])&&o(r.prototype,n),e}();e.exports.FMPromise=r}},t={},function o(r){var n=t[r];if(void 0!==n)return n.exports;var i=t[r]={exports:{}};return e[r](i,i.exports,o),i.exports}(579).FMPromise;var e,t}));