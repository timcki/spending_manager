import React,{useContext, useState} from 'react';
import InputNormal from '../components/InputNormal';

import DatePicker from '../components/DatePicker'
import InputCalculator from '../components/InputCalculator';
import AsyncSelect from '../components/AsyncSelect';
import Select from '../components/Select';
import "../styles/FormTransactions.css";
import api from '../utils/api';
import {AppContext} from "../store/AppContext";
import {useCookies} from 'react-cookie';

const dataTransaction ={
    date:{
        name:"date",
        label:"Data transakcji",
    },
    category:{
        name:"category",
        label:"Kategoria",
        placeholder:"Wybierz"
    },
    type:{
        name:"type",
        label:"Typ transakcji",
        placeholder:"Wybierz"
    },
    name:{
        name:"name",
        label:"Nazwa",
        type:"text",
        placeholder:"np. Zakupy w sklepie itp."
    }
}
const messages = {
    date:"Musisz wybrać date",
    category:"Musisz wybrać kategorie",
    type:"Musisz wybrać typ transakcji",
    name:"Nazwa musi mieć od 4 do 200 znaków",
    amount:"Kwota musi być większa od zera"
}

const FormTransactions = ({p_amount=0, p_date=new Date(), p_selectCategory = '',p_selectType='',p_description=''})=>{

    const {user,getToken} = useContext(AppContext);

    const [date,setDate] = useState(p_date);
    const [selectCategory,setSelectCategory] = useState(p_selectCategory);
    const [selectType,setSelectType] = useState(p_selectType);
    const [description,setDescription] = useState(p_description);
    const [amount,setAmount]=useState(p_amount);

    const [isOpenCalculator,setIsOpenCalculator] = useState(false); 

    const [errors,setErrors]=useState({
        date:false,
        category:false,
        type:false,
        description:false,
        amount:false,
        openCalculator:false
    })

    const handleDatePicker = (date)=>{
        setDate(date);
    }

    const handleSelectCategory = (selectCategory)=>{
        setSelectCategory(selectCategory);
    }

    const handleSelectType = (selectType)=>{
        setSelectType(selectType);
    }
    const handleSetDescription=(e)=>{
        setDescription(e.target.value);
    }

    const validationFun=()=>{
        let correct =true;
        let errDate=false;
        let errCategory=false;
        let errType=false;
        let errDescription=false;
        let errAmount=false;
        let errOpenCalculator=false;
        if(isOpenCalculator){
            errOpenCalculator=true;
        }
        else if(amount==="" || amount<0){
            errAmount=true;
        }
        if(date==null){
            errDate=true;
        }
        if(selectType===""){
            errType=true;
        }
        if(selectCategory===""){
            errCategory=true;
        }
        if(description.length<4 || description.length>200){
            errDescription=true;
        }
        if(errOpenCalculator||errAmount||errCategory||errDate||errType||errDescription){
            correct =false;
        }
        return ({
            correct,
            date:errDate,
            category:errCategory,
            type:errType,
            description:errDescription,
            amount:errAmount,
            openCalculator:errOpenCalculator
        });
    }
    const headers= {"Content-Type": "application/json"}

    const handleSubmit=(e)=>{
        e.preventDefault();
        let {correct,...valid} = validationFun();

        const payload={
            account_id:user,
            amount:amount,
            // transaction_type:selectType.value,
            transaction_type:"1",
            category_id:"1",
            transaction_date:date,
            recipient:description
        }
        if(correct){
            api
			.post(
                'api/v1/transactions/create', 
                payload,headers
                // ,{
                //     headers:{
                //         // "Authorization":"Bearer "+getToken(),
                //         "Content-Type":"application/json"
                //     }
                // }    
            )
			.then(response => {
				if (response.status === 200) {
                    console.log(response);
				}
			})
			.catch(err => {});


            setDate(new Date());
            setAmount(0);
            setDescription('');
            setSelectCategory('');
            setSelectType('');

            setErrors({        
                date:false,
                category:false,
                type:false,
                description:false,
                amount:false,
                openCalculator:false
            })
        }else{
            setErrors({
                ...valid
            })
        }
    }
    return(
        <div className="form-transactions">
            <form onSubmit={handleSubmit} noValidate>
            <div>
                <InputCalculator amount={amount} setAmount={setAmount} setIsOpenCalculator={setIsOpenCalculator}/>
                {errors.openCalculator && <div className="error-transactions xcenter">Musisz zamknąć Kalkulator</div>}
                {errors.amount && <div className="error-transactions xcenter">{messages.amount}</div>}
            </div>

            <div className="move-inputs">
            <div className="date-transactions">
                <DatePicker onchange={handleDatePicker} date={date} {...dataTransaction.date} />
                {errors.date && <div className="error-transactions">{messages.date}</div>}
            </div>
            <div className="category-transactions">
                <AsyncSelect value={selectCategory} onchange={handleSelectCategory} {...dataTransaction.category}/>
                {errors.category && <div className="error-transactions">{messages.category}</div>}
            </div>
            <div className="type-transactions">
                <Select value={selectType} onchange={handleSelectType} {...dataTransaction.type}/>  
                {errors.type && <div className="error-transactions">{messages.type}</div>}
            </div>
            <div className="description-transactions">
                <InputNormal value={description} onchange={handleSetDescription} {...dataTransaction.name}/>
                {errors.description && <div className="error-transactions">{messages.name}</div>}
            </div>
            <div className="save-transaction">
                <button>Zapisz</button>
            </div>
            </div>
            </form>
        </div>
    )
}

export default FormTransactions;