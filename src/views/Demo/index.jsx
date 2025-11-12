import React from 'react';
import style from './style.module.less';
import {useInitModel} from 'mtor';
import DemoModel from '~/models/DemoModel';
const Demo = () => {
    const model = useInitModel(DemoModel, ({init}) => init());
    return (<div className={style.container}>
        <div className={style.item} onClick={model.add}>{model.num}</div>
        <div className={style.item}>2</div>
        <div className={style.item}>{model.num}</div>
        <div className={style.item}>4</div>


    </div>);
};
export default Demo;
