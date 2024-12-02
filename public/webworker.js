
self.addEventListener('message', e => {
    const data = e.data;


    if (data.type === 'staticPoints') {
        console.time('处理无人机点云用时');
        const url = data.url;
        getStaticPoints(url, (data) => {
            console.timeEnd('处理无人机点云用时');
            postMessage({type: 'staticPoints', data});
        });
    }

});


function parseHeader(data) {

    const PCDheader = {};
    const result1 = data.search(/[\r\n]DATA\s(\S*)\s/i);
    const result2 = /[\r\n]DATA\s(\S*)\s/i.exec(data.slice(result1 - 1));

    PCDheader.data = result2[1];
    PCDheader.headerLen = result2[0].length + result1;
    PCDheader.str = data.slice(0, PCDheader.headerLen);

    // remove comments

    PCDheader.str = PCDheader.str.replace(/#.*/gi, '');

    // parse

    PCDheader.version = /VERSION (.*)/i.exec(PCDheader.str);
    PCDheader.fields = /FIELDS (.*)/i.exec(PCDheader.str);
    PCDheader.size = /SIZE (.*)/i.exec(PCDheader.str);
    PCDheader.type = /TYPE (.*)/i.exec(PCDheader.str);
    PCDheader.count = /COUNT (.*)/i.exec(PCDheader.str);
    PCDheader.width = /WIDTH (.*)/i.exec(PCDheader.str);
    PCDheader.height = /HEIGHT (.*)/i.exec(PCDheader.str);
    PCDheader.viewpoint = /VIEWPOINT (.*)/i.exec(PCDheader.str);
    PCDheader.points = /POINTS (.*)/i.exec(PCDheader.str);

    // evaluate

    if (PCDheader.version !== null)
        PCDheader.version = parseFloat(PCDheader.version[1]);

    PCDheader.fields = (PCDheader.fields !== null) ? PCDheader.fields[1].split(' ') : [];

    if (PCDheader.type !== null)
        PCDheader.type = PCDheader.type[1].split(' ');

    if (PCDheader.width !== null)
        PCDheader.width = parseInt(PCDheader.width[1]);

    if (PCDheader.height !== null)
        PCDheader.height = parseInt(PCDheader.height[1]);

    if (PCDheader.viewpoint !== null)
        PCDheader.viewpoint = PCDheader.viewpoint[1];

    if (PCDheader.points !== null)
        PCDheader.points = parseInt(PCDheader.points[1], 10);

    if (PCDheader.points === null)
        PCDheader.points = PCDheader.width * PCDheader.height;

    if (PCDheader.size !== null) {

        PCDheader.size = PCDheader.size[1].split(' ').map(function (x) {

            return parseInt(x, 10);

        });

    }

    if (PCDheader.count !== null) {

        PCDheader.count = PCDheader.count[1].split(' ').map(function (x) {

            return parseInt(x, 10);

        });

    } else {

        PCDheader.count = [];

        for (let i = 0, l = PCDheader.fields.length; i < l; i++) {

            PCDheader.count.push(1);

        }

    }

    PCDheader.offset = {};

    let sizeSum = 0;

    for (let i = 0, l = PCDheader.fields.length; i < l; i++) {

        if (PCDheader.data === 'ascii') {

            PCDheader.offset[PCDheader.fields[i]] = i;

        } else {

            PCDheader.offset[PCDheader.fields[i]] = sizeSum;
            sizeSum += PCDheader.size[i] * PCDheader.count[i];

        }

    }

    // for binary only

    PCDheader.rowSize = sizeSum;

    return PCDheader;

}

function getRange(url, begin, size, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('range', `bytes=${begin}-${begin + size - 1}`);
    xhr.responseType = 'arraybuffer';
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
            const data = xhr.response;
            cb(data);
        } else if(xhr.readyState === 4 && xhr.status >=400) {
            cb(null);
        }
    };
    xhr.send();
}

const precision = 5;
function getStaticPoints(url, onFinish) {
    getRange(url, 0, 1000, (head) => {
        const textData = new TextDecoder().decode(new Uint8Array(head));
        const PCDheader = parseHeader(textData);

        const all = new Map();
        let index = 0; // 点序列号
        const bSize = 20000000; // 一次请求点数量

        let position = [];
        let color = [];
        let indexD = [];

        if (PCDheader.data === 'binary') {
            const process = (begin) => {
                const _begin = PCDheader.headerLen + begin * PCDheader.rowSize;
                getRange(url, _begin,  PCDheader.rowSize * bSize, (data) => {
                    if(data) {
                        const dataView = new DataView(data);
                        const points = Math.floor(dataView.byteLength / PCDheader.rowSize);
                        const offset = PCDheader.offset;
                        let x, y, z, ix, iy, iz;
                        for (let i = 0, row = 0; i < points; i += 1, row += PCDheader.rowSize) {
                            x = dataView.getFloat32(row + offset.x, true);
                            y = dataView.getFloat32(row + offset.y, true);
                            z = dataView.getFloat32(row + offset.z, true);


                            ix = Math.round(x * precision);
                            iy = Math.round(y * precision);
                            iz = Math.round(z * precision);


                            const tmpx = ix - 1000;
                            const tmpy = iy + 5000;
                            const tmpz = iz + 1000;
                            const key = (tmpx & 0xfff) << 20 | (tmpy & 0xfff)<< 8 | tmpz & 0xff;

                            if(all.has(key)) {

                                continue;
                            }
                            all.set(key, true);
                            position.push(ix / precision, iy / precision, iz / precision);
                            indexD.push(ix/precision, iy/precision);
                            let colorInt;
                            if(offset.rgb) {
                                colorInt = dataView.getUint32(row + offset.rgb, true);
                                color.push(((colorInt & 0xff0000) >> 16) / 255, ((colorInt & 0xff00) >> 8) / 255, (colorInt & 0xff) / 255);
                            }

                        }
                        onFinish({position: new Float32Array(position), color: new Float32Array(color),indexD: new Float32Array(indexD)});
                    }


                });
            };
            process(index);
        } else {
            console.log('不支持的类型', PCDheader.data);
        }

    });

}





const getGradientColors = (startColor, endColor, step) => {
    const colorRgb = function (sColor) {
        let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        sColor = sColor.toLowerCase();
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                let sColorNew = "#";
                for (let i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值
            let sColorChange = [];
            for (let i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
            }
            return sColorChange;
        } else {
            return sColor;
        }
    };
    const startRGB = colorRgb(startColor);//转换为rgb数组模式
    const startR = startRGB[0];
    const startG = startRGB[1];
    const startB = startRGB[2];

    const endRGB = colorRgb(endColor);
    const endR = endRGB[0];
    const endG = endRGB[1];
    const endB = endRGB[2];

    const sR = (endR - startR) / step;//总差值
    const sG = (endG - startG) / step;
    const sB = (endB - startB) / step;

    let colorArr = [];
    for (let i = 0; i < step; i++) {
        //计算每一步的hex值
        // var hex = this.colorHex('rgb('+parseInt((sR*i+startR))+','+parseInt((sG*i+startG))+','+parseInt((sB*i+startB))+')');
        let colorInt = parseInt((sR * i + startR)) << 16 | parseInt((sG * i + startG)) << 8 | parseInt((sB * i + startB));
        let hex = [parseInt((sR * i + startR)) / 255, parseInt((sG * i + startG)) / 255, parseInt((sB * i + startB)) / 255, colorInt];
        colorArr.push(hex);
    }
    return colorArr;
};

const step = 500;
const colors = getGradientColors('#22ef65','#872412',  step);

function getColor(h) {

    let cs = Math.floor(h * 1.5 + 300);
    if (cs >= step) {
        cs = step - 1;
    } else if (cs < 0) {
        cs = 0;
    }
    return colors[cs];
}
const step2 = 70;
// const colors2 = getGradientColors('#9b988f','#afffaf',  80);
// const colors2 = getGradientColors('#2277bb','#331111',  80);
// const colors2 = getGradientColors('#2277bb','#221111',  70);
// const colors2 = getGradientColors('#221111','#4477bb',  80);
const colors2 = getGradientColors('#444444','#ffffff',  step2);
// const colors2 = getGradientColors('#222222','#ffffff',  step2);
// 155/255, 152/255, 143/255)
