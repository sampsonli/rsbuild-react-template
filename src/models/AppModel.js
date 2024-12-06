import {Model, define} from 'mtor';
import {window as twindow} from '@tauri-apps/api';
import {initWebSocket} from '~/common/utils';
import dayjs from 'dayjs';
@define(module)
class AppModel extends Model {
    isFull = false;
    conn = {send: () => null};
    messages = [{name: 'lichun', val: 'hello'}];
    inputVal = '';
    currentName = '';
    tempname = '';

    init(ele) {
        this.currentName = sessionStorage.getItem('_name');
        initWebSocket({
            url: 'http://192.168.2.1:8081/ws',
            onData: (data) => {
               this.messages = [...this.messages, data];
               ele.scrollTo(0, 10000000);
            },
            onOpen: (conn) => {
                this.conn = conn;
            }
        });
    }

    sendData(data) {
        this.conn.send({msg: JSON.stringify(data)});
    }

    sendMsg() {
        if(this.inputVal) {
            this.sendData({name: this.currentName, val: this.inputVal, time: dayjs().format('mm:ss')});
        }
        // this.inputVal = '';
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