import {simple_async} from '~/wasm/pkg/wasm_demo';

import * as ComLink from 'comlink';


// 暴露 API 给主线程
ComLink.expose({
    heavyCalculation: simple_async,
});

