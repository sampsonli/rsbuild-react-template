import {Model, define} from 'mtor';
import {window as twindow} from '@tauri-apps/api';
import {initWebSocket} from '~/common/utils';
import dayjs from 'dayjs';
@define(module)
class AppModel extends Model {
    ready = false;
    isFull = false;
    conn = {send: () => null};
    messages = [];
    inputVal = '';
    currentName = '0';
    tempname = '';

    init(ele) {
        this.currentName = sessionStorage.getItem('_name');
        const wsCloseFn = initWebSocket({
            // url: 'http://106.5.205.221:48216/ws',
            url: 'ws://47.116.42.80:8817/ws',
            onData: (data) => {
               this.messages = [...this.messages, data];
               ele.scrollTo(0, 10000000);
            },
            onOpen: (conn) => {
                this.conn = conn;
                this.ready = true;
                this.messages = [{name: '管理员', val: 'hello， 咋们可以愉快聊天了'}];
            }
        });
        this.onBeforeReset(wsCloseFn);
    }

    sendData(data) {
        this.conn.send({msg: JSON.stringify(data)});
    }

    sendMsg() {
        if(this.inputVal) {
            this.sendData({name: this.currentName, val: this.inputVal, time: dayjs().format('mm:ss')});
        }
        this.inputVal = '';
    }



    async doFullScreen() {
        const currWindow = twindow.getCurrentWindow();
        // core.invoke('')
        try {
            if(this.isFull) {
                await currWindow.setFullscreen(false);
            } else {
                await currWindow.setFullscreen(true);
            }
            this.isFull = !this.isFull;
        } catch (e) {
            this.text = e;
        }
    }
}

export default AppModel;
