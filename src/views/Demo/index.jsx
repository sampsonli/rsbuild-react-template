import React from 'react';
import style from './style.module.less';
import {useInitModel} from 'mtor';
import DemoModel from '~/models/DemoModel';
const Demo = () => {
    const model = useInitModel(DemoModel, ({init}) => init());
    return (<div className={style.container}>
        <div className={style.item} onClick={model.add}>1</div>
        <div className={style.item}>2</div>
        <div className={style.item}>{model.num}</div>
        <div className={style.item}>4</div>
        <div className={style.item}>5</div>
        <div className={style.item}>6</div>
        <div className={style.item}>7</div>
        <div className={style.item}>8</div>
        <div className={style.item}>9</div>
        <div className={style.item}>10</div>
    </div>);
};
export default Demo;
