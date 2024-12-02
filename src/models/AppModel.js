import {Model, define} from 'mtor';

@define(module)
class AppModel extends Model {
    count = 0;
    add() {
        this.count += 1;
        if(this.count === 1) {
            console.log('hello world');
        }
    }
}

export default AppModel;