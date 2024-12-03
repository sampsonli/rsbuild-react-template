import React from 'react';
import style from './style.module.css';
import {useInitModel} from 'mtor';
import AppModel from '~/models/AppModel';

const Index = () => {
    const model = useInitModel(AppModel);
    return (
        <div className={style.content}>
            <h1 className={style.btn} onClick={model.add}>add</h1>
            <h1 className={style.btn} onClick={model.doFullScreen}>fullScreen</h1>
            <p>Start building amazing things with Rsbuild.{model.count}-{model.text}</p>
        </div>
    );
};
export default Index;
