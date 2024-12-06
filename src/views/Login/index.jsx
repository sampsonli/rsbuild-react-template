import React, {useEffect, useRef} from 'react';
import { useModel } from 'mtor';
import style from './style.module.less';
import LoginModel from '../../models/LoginModel';

function Login () {
    const model = useModel(LoginModel);
    const _3d = useRef();
    useEffect(() => {
        model.init(_3d.current);
    }, []);
    return (
        <div className={style.container}>
            {/*<div className={style.header}>用户登录1</div>*/}
            <div className={style.content} onClick={model.changeNum}>
                <div className={style._3d} ref={_3d}></div>
            </div>
        </div>

    );
}
export default Login;