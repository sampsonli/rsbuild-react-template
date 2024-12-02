
export const wait = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});
export const debounce = (fn, delay = 100) => {
    let timer = null; // 借助闭包
    return () => {
        clearTimeout(timer);
        timer = setTimeout(fn, delay); // 简化写法
    };
};

/**
 * 通过script标签加载资源
 * @param {string} src - 资源地址
 * @param attr - 加载后资源定义的全局变量
 * @returns {Promise<any>}
 */
export const  loadjs = (src, attr = '') => {
    if (!window.__loaded) {
        window.__loaded = {};
    }
    if (window.__loaded[src]) {
        return window.__loaded[src];
    }
    window.__loaded[src] = new Promise((resolve, reject) => {
        const element = document.createElement('script');
        document.body.appendChild(element);
        element.src = src;
        element.onload = () => {
            resolve(attr && window[attr]);
        };
        element.onerror = (e) => {
            reject(e);
        };
    });
    return window.__loaded[src];
};

/**
 * 通过lint标签加载样式资源
 * @param {string} src - 资源地址
 * @returns {Promise<any>}
 */
export const loadCss = (src) => {
    if (!window.__loadedCss) {
        window.__loadedCss = {};
    }
    if (window.__loadedCss[src]) {
        return window.__loadedCss[src];
    }
    window.__loadedCss[src] = new Promise((resolve, reject) => {
        const element = document.createElement('link');
        element.setAttribute('rel', 'stylesheet');
        element.href = src;
        document.head.appendChild(element);
        element.onload = () => {
            resolve(() => {
                if (window.__loadedCss[src]) {
                    delete window.__loadedCss[src];
                    try {
                        document.head.removeChild(element);
                    } catch (e) {
                        console.warn(e.message);
                    }
                }
            });
        };
        element.onerror = (e) => {
            reject(e);
        };
    });
    return window.__loadedCss[src];
};


/**
 *
 * @param url
 * @param onData {(any) => void}
 * @param onOpen {function|void}
 * @param type {string}
 * @return {function}
 */
export const initWebSocket = ({url, onData, onOpen = undefined, type = 'text', timeout = 30000}) => {
    let ws;
    let timeoutId;
    function createWebsocket() {
        ws = new WebSocket(url);
        if (type !== 'text') {
            ws.binaryType = 'arraybuffer';
        }
        ws.onmessage = (event) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                try {
                    ws.close();
                } catch (e) {
                    console.log(e.message);
                }
                setTimeout(() => {
                    createWebsocket();
                }, 500);
            }, timeout);
            if (type === 'text') {
                const data = JSON.parse(event.data);
                if (data.msg !== 'pong') {
                    onData(data);
                }
            } else {
                onData(event.data);
            }

        };
        let timeId;
        ws.onopen = () => {
            ws.send(JSON.stringify({
                'msg': {
                    'identity': 1
                },
                'msg_type': 0
            }));
            onOpen && onOpen(ws);
            timeId = setInterval(() => {
                try {
                    ws.send(JSON.stringify({'msg': 'ping', 'msg_type': 1}));
                } catch (ignore) {
                    // console.log('');
                }
            }, 1000 * 20);
        };
        ws.onclose = () => {
            clearInterval(timeId);
        };
        timeoutId = setTimeout(() => {
            try {
                ws.close();
            } catch (e) {
                console.log(e.message);
            }

            setTimeout(() => {
                createWebsocket();
            }, 300);
        }, timeout);
    }
    createWebsocket();
    return () => {
        ws.close();
        ws.onclose = () => {
            clearTimeout(timeoutId);
        };
    };
};
