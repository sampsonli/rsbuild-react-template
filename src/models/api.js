import {generator} from '../common/ajax';
// export const baseUrl = 'http://localhost:8081';
let baseUrl = location.hostname + ':8082';
if(process.env.NODE_ENV === 'development') {
    baseUrl = '47.116.42.80:8818';
}
const Apis = {
    getCranes: {
        url: `${baseUrl}/api/v1/crane`,
        method: 'get',
    },
    getTaskList: {
        url: `${baseUrl}/api/v1/data/crane_task/all`,
        method: 'post',
    },
};
export default generator(Apis);
