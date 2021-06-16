import React,{useState} from 'react';
import InputNormal from '../components/InputNormal';
import '../styles/inputCalculator.css';
import Big from 'big.js';

const dataCalc ={
    inputAmount:{
        name:"inputAmount",
        type:"number",
        label:"Kwota",
        autoComplete:"off", 
        step:"0.01",
        min:"0.00"
    },
    inputHelp:{
        name:"amount",
        type:"number",
        placeholder:"Wpisz kwotę",
        autoComplete:"off", 
        step:"0.01"
    },
}

const InputWithCalculator = (props) => {
    const {amount,setAmount,setIsOpenCalculator}=props;

    const [operationAmount,setOperationAmount]=useState("");
    const [calculator,setCalculator]=useState(false);

    const [errorInputHelp,setErrorInputHelp] = useState(false);
    const [errorDivideByZero,setErrorDivideByZero] = useState(false);

    const handleChangeAmount =(e,func)=>{
        setErrorDivideByZero(false)
        setErrorInputHelp(false)
        const a = e.target.value;
        let temp=a.indexOf(".");
        let xtemp=a.length -temp-1;
        if(xtemp<3){
            func(e.target.value);
        }
        else if(temp<0){
            func(e.target.value);
        }
    }

    const handleClickOperation = (operation) =>{
        let a = parseFloat(amount);
        if(amount ===""){
            a=0;
        }
        if(operationAmount===""){
            setErrorInputHelp(true);
            return
        }
        else if(errorInputHelp) {
            setErrorInputHelp(false);
        }
        const b = parseFloat(operationAmount);

        let bigA = new Big(a);
        let bigB = new Big(b);

        let result=null;
        switch(operation){
            case "add":
                result = bigA.plus(bigB).toFixed(2)
                setAmount(result);
                // setAmount(a+b);
                setOperationAmount(0);
                break;
            case "sub":
                result = bigA.minus(bigB).toFixed(2);
                setAmount(result);
                // setAmount(a-b);
                setOperationAmount(0);
                break;
            case "mult":
                result = bigA.times(bigB).toFixed(2)
                setAmount(result);
                // setAmount(a*b);
                setOperationAmount(0);
                break;
            case "div":
                if(b!==0){
                    result = bigA.div(bigB).toFixed(2)
                    setAmount(result);
                    // setAmount(a/b);
                    setOperationAmount(0);
                    if(errorDivideByZero){
                        setErrorDivideByZero(false);
                    }
                }else{
                    setErrorDivideByZero(true);
                }
                break;
        }
    }
    const handleShowCalculator=()=>{
        setErrorDivideByZero(false)
        setErrorInputHelp(false)
        setCalculator(true);
        setIsOpenCalculator(true);
    }
    const handleHideCalculator=()=>{
        setErrorDivideByZero(false)
        setErrorInputHelp(false)
        setCalculator(false);
        setIsOpenCalculator(false);
    }
    
    return(
        
        <div className="special-calculator">
            <div className="input-calc">
                <InputNormal {...dataCalc.inputAmount} value={amount} onchange={(e)=>handleChangeAmount(e,setAmount)}/>
                
                {
                    calculator?    
                    (<button className="calc-button red" onClick={handleHideCalculator} type="button">Zakończ</button>):
                    (<button className="calc-button green" onClick={handleShowCalculator} type="button">Kalkulator</button>)
                }
            </div>
            {
                calculator?(
                <div className="animate-calc-window">
                    <div className="calc-window">

                        <div className="actual-amount">
                            <InputNormal {...dataCalc.inputHelp} value={operationAmount} onchange={(e)=>handleChangeAmount(e,setOperationAmount)}/>
                        </div>
                        <div className="operations">
                            <button className="operation addition" onClick={()=>handleClickOperation("add")} type="button">+</button>
                            <button className="operation substraction" onClick={()=>handleClickOperation("sub")} type="button">-</button>
                            <button className="operation multiply" onClick={()=>handleClickOperation("mult")} type="button">x</button>
                            <button className="operation division" onClick={()=>handleClickOperation("div")} type="button">/</button>
                        </div>
                    </div>
                    {errorInputHelp && <div className="error-transactions xcenter">Musisz wstawić wartość</div>}
                    {errorDivideByZero && <div className="error-transactions xcenter">Nie możesz dzielić przez zero</div>}
                </div>
                ):(null)

            }
        </div>
    )
    
}



export default InputWithCalculator;