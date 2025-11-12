import {define, Model} from 'mtor';
import * as Comlink from 'comlink';

@define(module)
class DemoModel extends Model {
    loaded = false;
    /**
     * @type {Comlink.Remote<{heavyCalculation: any}>}
     */
    work_proxy;

    num = 10;

    async add() {
        this.num++;
        let ret = await this.work_proxy.heavyCalculation();
        console.log(`computed:${ret}`);
    }

    init() {
        if (this.loaded) {
            return;
        }
        const work = new Worker(new URL('./mywork.js', import.meta.url));
        this.work_proxy = Comlink.wrap(work);
        this.onBeforeReset(() => {
            work.terminate();
        });
        this.loaded = true;
    }


}

export default DemoModel;
