import {Model, define} from 'mtor';
import * as Comlink from 'comlink';

@define(module)
class DemoModel extends Model {

    /**
     * @type {Comlink.Remote<{heavyCalculation: any}>}
     */
    static work;
    ready = false;

    num = 0;

    async add() {
        this.num++;

        let result = await DemoModel.work.heavyCalculation(35);
        console.log(result);


    }

    init() {

       const work = new Worker(new URL('./mywork.js', import.meta.url));

        // 创建 proxy
        DemoModel.work = Comlink.wrap(work);




        this.onBeforeReset(() => {
            console.log('hello reset');

        });
    }


}

export default DemoModel;
