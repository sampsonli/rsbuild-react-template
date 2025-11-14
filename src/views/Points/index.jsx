import React, {useEffect, useRef} from 'react';
import { useModel } from 'mtor';
import style from './style.module.less';
import PointsModel from '~/models/PointsModel';

function Login () {
    const model = useModel(PointsModel);
    const _3d = useRef();
    useEffect(() => {
        model.init(_3d.current);
    }, []);
    return (
        <div className={style.container}>
            <div className={style.content} onClick={model.changeNum}>
                <div className={style._3d} ref={_3d}></div>
            </div>
        </div>

    );
}
export default Login;