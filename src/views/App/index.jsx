import React, {useRef} from 'react';
import style from './style.module.less';
import {useInitModel} from 'mtor';
import AppModel from '~/models/AppModel';

const Index = () => {
    const ref = useRef(null);
    const model = useInitModel(AppModel, ({init}) => init(ref.current), true);
    return (
        <div className={style.content}>
            <div className={style.title} onClick={model.onBeforeClean}>聊天室</div>

            {!model.currentName && <div className={style.layer}>
                <div className={style.dialog}>
                    <div className={style.tit}>请输入你的昵称</div>
                    <div className={style.nick}>
                        <input value={model.tempname} onChange={({target}) => model.setData({tempname: target.value}) }/>
                    </div>
                    <div className={style.opt}>
                        <div className={style.ok} onClick={() => {
                            model.setData({currentName: model.tempname});
                            sessionStorage.setItem('_name', model.tempname);
                        }}>确认</div>
                    </div>
                </div>

            </div>}
            <div className={style.list} ref={ref}>
                {model.messages.map((msg) => {
                    return msg.name === model.currentName ? <div className={`${style.row} ${style.me}`} key={msg.val}>{msg.val} <span className={style.nname}>我</span></div> :
                    <div className={`${style.row} ${style.you}`} key={msg.val}><span className={style.nname}>{msg.name}</span>{msg.val}
                    </div>;
                })}

            </div>
            <div className={style.bottom}>
                <div className={style.input}>
                    <input value={model.inputVal} onChange={(e) => model.setData({inputVal: e.target.value})}/>
                </div>
                <div className={style.btn} onClick={model.sendMsg}>发送</div>

            </div>



        </div>
    );
};
export default Index;
