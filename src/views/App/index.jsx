import React from 'react';
import style from './style.module.css';
import {useInitModel} from 'mtor';
import AppModel from '~/models/AppModel';

const Index = () => {
    const model = useInitModel(AppModel);
    return (
        <div className={style.content}>
            <div className={style.row}>
                <div className={`${style.col} ${style.red}`} onClick={model.doFullScreen}></div>
                <div className={`${style.col} ${style.green}`}></div>
                <div className={`${style.col} ${style.yellow}`}></div>
            </div>

            <div className={style.row}>
                <div className={`${style.col} ${style.green}`}></div>
                <div className={`${style.col} ${style.yellow}`}></div>
                <div className={`${style.col} ${style.red}`} onClick={model.doFullScreen}></div>


            </div>

        </div>
    );
};
export default Index;
