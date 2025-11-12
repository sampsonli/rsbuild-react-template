import {fib} from '~/wasm/pkg/wasm_demo';

import * as Comlink from 'comlink';


// 定义 worker 中要暴露的 API
const workerAPI = {
    heavyCalculation: (num = 30) => {
        console.time('add');
        let tmp = fib(num);
        console.timeEnd('add');
        console.log(`result: ${tmp}`);
        return tmp;
    },
};
// 暴露 API 给主线程
Comlink.expose(workerAPI);
