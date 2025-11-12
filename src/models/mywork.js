import {simple_async} from '~/wasm/pkg/wasm_demo';

import * as ComLink from 'comlink';


// 定义 worker 中要暴露的 API
const workerAPI = {
    heavyCalculation: async (num = 30) => {
        const ret = await simple_async(num);

        return ret;
    },
};
// 暴露 API 给主线程
ComLink.expose(workerAPI);

