import {test_performance} from '~/wasm/pkg/wasm_demo';

import * as ComLink from 'comlink';


// 定义 worker 中要暴露的 API
const workerAPI = {
    heavyCalculation: (num = 30) => {
        console.time('add');
        let tmp = test_performance(num);
        console.timeEnd('add');
        console.log(`result: ${tmp}`);
        return tmp;
    },
};
// 暴露 API 给主线程
ComLink.expose(workerAPI);
