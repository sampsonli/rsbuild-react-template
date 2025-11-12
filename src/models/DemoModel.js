import {define, Model} from 'mtor';
import * as Comlink from 'comlink';

@define(module)
class DemoModel extends Model {
    loaded = false;
    static work = 1;
    /**
     * @type {Comlink.Remote<{heavyCalculation: any}>}
     */
    work_proxy;

    num = 10;

    async add() {
        console.log(DemoModel.work);
        console.log(26);

        // this.num = await DemoModel.work.heavyCalculation(11111);


    }

    init() {
        if (this.loaded) {
            return;
        }
        DemoModel.work = 2;
       const work = new Worker(new URL('./mywork.js', import.meta.url));
        this.work_proxy = Comlink.wrap(work);
        this.onBeforeReset(() => {
            work.terminate();
        });
        this.loaded = true;
    }


}

export default DemoModel;
