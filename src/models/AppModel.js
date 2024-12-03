import {Model, define} from 'mtor';
import {window as twindow} from '@tauri-apps/api';

@define(module)
class AppModel extends Model {
    count = 0;
    text = '';
    isFull = false;
    add() {
        this.count += 1;
        if(this.count === 1) {
            console.log('hello world');
        }
    }
    async doFullScreen() {
        const currWindow = twindow.getCurrentWindow();
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




        // // 在你的 JavaScript 文件中
        // const { screen } = window.navigator; // 切换全屏模式
        // function toggleFullScreen() {
        //     console.log('toggleFullScreen');
        //     if (!screen.fullscreenEnabled) {
        //         console.log('全屏模式不可用'); return;
        //     } if (!document.fullscreenElement) {
        //         document.documentElement.requestFullscreen().catch(err => {
        //             console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        //         });
        //     } else {
        //         if (document.exitFullscreen) {
        //             document.exitFullscreen();
        //         }
        //     }
        // }
        // toggleFullScreen();
        
    }
}

export default AppModel;