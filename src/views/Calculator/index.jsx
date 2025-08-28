import React from 'react';
import style from './style.module.less';
import { useInitModel } from 'mtor';
import CalculatorModel from '~/models/CalculatorModel';


const Calculator = () => {
    const model = useInitModel(CalculatorModel, ({ init }) => init());

    const handleButtonClick = (value) => {
        model.handleInput(value);
    };

    return (
        <div className={style.container}>
            <div className={style.calculator}>
                <div className={style.display}>
                    <div className={style.expression}>{model.expression || '0'}</div>
                    <div className={style.result}>{model.result}</div>
                </div>
                <div className={style.buttons}>
                    <div className={style.row}>
                        <button className={`${style.button} ${style.clear}`} onClick={() => handleButtonClick('C')}>C</button>
                        <button className={`${style.button} ${style.operator}`} onClick={() => handleButtonClick('(')}>(</button>
                        <button className={`${style.button} ${style.operator}`} onClick={() => handleButtonClick(')')}>)</button>
                        <button className={`${style.button} ${style.operator}`} onClick={() => handleButtonClick('/')}>/</button>
                    </div>
                    <div className={style.row}>
                        <button className={style.button} onClick={() => handleButtonClick('7')}>7</button>
                        <button className={style.button} onClick={() => handleButtonClick('8')}>8</button>
                        <button className={style.button} onClick={() => handleButtonClick('9')}>9</button>
                        <button className={`${style.button} ${style.operator}`} onClick={() => handleButtonClick('*')}>×</button>
                    </div>
                    <div className={style.row}>
                        <button className={style.button} onClick={() => handleButtonClick('4')}>4</button>
                        <button className={style.button} onClick={() => handleButtonClick('5')}>5</button>
                        <button className={style.button} onClick={() => handleButtonClick('6')}>6</button>
                        <button className={`${style.button} ${style.operator}`} onClick={() => handleButtonClick('-')}>-</button>
                    </div>
                    <div className={style.row}>
                        <button className={style.button} onClick={() => handleButtonClick('1')}>1</button>
                        <button className={style.button} onClick={() => handleButtonClick('2')}>2</button>
                        <button className={style.button} onClick={() => handleButtonClick('3')}>3</button>
                        <button className={`${style.button} ${style.operator}`} onClick={() => handleButtonClick('+')}>+</button>
                    </div>
                    <div className={style.row}>
                        <button className={style.button} onClick={() => handleButtonClick('0')}>0</button>
                        <button className={style.button} onClick={() => handleButtonClick('.')}>.</button>
                        <button className={style.button} onClick={() => handleButtonClick('DEL')}>DEL</button>
                        <button className={`${style.button} ${style.equals}`} onClick={() => handleButtonClick('=')}>=</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calculator;