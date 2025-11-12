import {define, Model} from 'mtor';
import * as Comlink from 'comlink';

@define(module)
class DemoModel extends Model {
    loaded = false;
    /**
     * @type {Comlink.Remote<{heavyCalculation: any}>}
     */
    static work_proxy;

    num = 10;

    async add() {
        this.num++;
        let ret = await DemoModel.work_proxy.heavyCalculation(1000);
        console.log(`computed2:${ret}`);
    }

    init() {
        if (this.loaded) {
            return;
        }
        const work = new Worker(new URL('./mywork.js', import.meta.url));
        DemoModel.work_proxy = Comlink.wrap(work);
        this.onBeforeReset(() => {
            work.terminate();
            DemoModel.work_proxy.releaseProxy();


        });
        this.loaded = true;
    }


}

export default DemoModel;
