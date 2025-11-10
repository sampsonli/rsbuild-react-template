import {Model, define} from 'mtor';
import {test_performance, simple_async} from '~/common/pkg/wasm_demo';

@define(module)
class DemoModel extends Model {
    ready = false;

    num = 0;

    add() {
        this.num++;
        let tmp = test_performance(123567);
        console.log(`${tmp} is now ready!`);
        simple_async();


    }

    init() {



        this.onBeforeReset(() => {
            console.log('hello reset');

        });
    }


}

export default DemoModel;
