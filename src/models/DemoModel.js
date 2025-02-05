import {Model, define} from 'mtor';

@define(module)
class DemoModel extends Model {
    ready = false;

    num = 0;

    add() {
        this.num++;
    }

    init() {

        this.onBeforeReset(() => {
            console.log('hello reset');

        });
    }


}

export default DemoModel;
