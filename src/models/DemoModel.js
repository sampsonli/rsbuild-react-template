import {define, Model} from 'mtor';
import * as Comlink from 'comlink';

@define(module)
class DemoModel extends Model {

    /**
     * @type {Comlink.Remote<{heavyCalculation: any}>}
     */
    static work;

    num = 10;

    async add() {
        this.num = await DemoModel.work.heavyCalculation(this.num);


    }

    init() {
       const work = new Worker(new URL('./mywork.js', import.meta.url));
        // 创建 proxy
        DemoModel.work = Comlink.wrap(work);
        this.onBeforeReset(() => {
            DemoModel.work = undefined;
            work.terminate();
        });
    }


}

export default DemoModel;
