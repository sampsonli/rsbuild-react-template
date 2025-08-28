import { Model, define } from 'mtor';

@define(module)
class CalculatorModel extends Model {
    expression = '';
    result = '';
    lastOperation = false;

    init() {
        // 初始化计算器
    }

    handleInput(value) {
        switch (value) {
            case 'C':
                this.clear();
                break;
            case 'DEL':
                this.delete();
                break;
            case '=':
                this.calculate();
                break;
            default:
                this.appendValue(value);
                break;
        }
    }

    clear() {
        this.expression = '';
        this.result = '';
        this.lastOperation = false;
    }

    delete() {
        if (this.expression.length > 0) {
            this.expression = this.expression.slice(0, -1);
            this.tryCalculate();
        }
    }

    appendValue(value) {
        // 如果上一次按了等号，并且现在输入的是数字，则清空表达式
        if (this.lastOperation && /[0-9]/.test(value)) {
            this.expression = value;
            this.lastOperation = false;
        } 
        // 如果上一次按了等号，并且现在输入的是运算符，则使用上次的结果
        else if (this.lastOperation && /[+\-*/()]/.test(value)) {
            this.expression = this.result + value;
            this.lastOperation = false;
        } 
        // 正常追加输入
        else {
            this.expression += value;
        }
        
        this.tryCalculate();
    }

    tryCalculate() {
        try {
            // 创建一个安全的表达式计算
            if (this.expression) {
                // 替换乘法符号为JavaScript可识别的
                const sanitizedExpression = this.expression.replace(/×/g, '*');
                
                // 使用Function构造函数创建一个安全的计算环境
                // eslint-disable-next-line no-new-func
                const result = new Function(`return ${sanitizedExpression}`)();
                
                // 检查结果是否为有效数字
                if (!isNaN(result) && isFinite(result)) {
                    this.result = String(result);
                } else {
                    this.result = '';
                }
            } else {
                this.result = '';
            }
        } catch (error) {
            // 如果计算出错，不显示结果
            this.result = '';
        }
    }

    calculate() {
        try {
            if (this.expression) {
                this.tryCalculate();
                if (this.result) {
                    this.expression = this.result;
                    this.lastOperation = true;
                }
            }
        } catch (error) {
            // 计算错误时不做任何处理
        }
    }
}

export default CalculatorModel;