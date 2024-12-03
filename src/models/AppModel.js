import {Model, define} from 'mtor';
import {window as twindow, core} from '@tauri-apps/api';
@define(module)
class AppModel extends Model {
    count = 0;
    text = '';
    isFull = false;
    async add() {
        const ret = await core.invoke('my_custom_command', {a: 12, b: 54});
        console.log(ret);
        this.count = ret;
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