import React,{useContext, useState} from 'react';
import InputNormal from '../InputNormal';
import axios from 'axios'
import api from '../../utils/api';
import {AppContext} from "../../store/AppContext";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}


const dataAccount ={
    accountName:{
        name:"accountName",
        label:"Nazwa konta",
        type:"text"
    },
    accountState:{
        name:"accountState",
        label:"Stan konta",
        type:"number",
        step:"0.01"
    }
}
const messages = {
    accountName:"Nazwa musi mieć od 4 do 200 znaków",
    accountState:"Kwota musi być większa od zera"
}

const AddAccountForm = ()=>{

    const {user,getToken,getCsrfToken} = useContext(AppContext);

    const [accountName,setAccountName] = useState('');
    const [accountState,setAccountState]=useState(0);

    const [errors,setErrors]=useState({
        accountName:false,
        accountState:false
    })


    const validationFun=()=>{
        let correct =true;
        let errAccountName=false;
        let errAccountState=false;

        if(accountName.length<4 || accountName.length>200){
            errAccountName=true;
        }
        if(accountState===""){
            errAccountState=true;
        }
        if(errAccountName||errAccountState){
            correct =false;
        }
        return ({
            correct,
            accountName:errAccountName,
            accountState:errAccountState
        });
    }

    const handleAccountName = (e) =>{
        setAccountName(e.target.value)
    }

    const handleAccountState = (e) =>{
        const a = e.target.value;
        let temp=a.indexOf(".");
        let xtemp=a.length -temp-1;
        if(xtemp<3){
            setAccountState(e.target.value)
        }
        else if(temp<0){
            setAccountState(e.target.value)
        }
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        let {correct,...valid} = validationFun();

        if(correct){
        
            const payload={
                acc_name:accountName,
                acc_balance:accountState
            }
            console.log(payload)
            console.log("token\n")
            console.log(getToken())
            api
			.post(
                '/api/v1/accounts/create',
                payload,
                {
                    headers:{
                        // "Authorization":`Bearer ${getToken()}`,
                        'X-CSRF-TOKEN':`${getCookie('csrf_access_token')}`,
                        "Content-Type":"application/json"
                    }
                }
            )
			.then(response => {
                console.log(response)
			})
            .catch(err => {});
            // fetch('http://127.0.0.1:5000/api/v1/accounts/create',{
            //     method: "POST",
            //     credentials: "include",
            //     headers: {'X-CSRF-TOKEN': getCookie('csrf_access_token')},
            //     body: JSON.stringify(payload)
            // }).then((response)=>{
            //         console.log(response)
            // }).catch(err => {});
                
            setAccountName('');
            setAccountState(0);

            setErrors({        
                accountName:false,
                accountState:false
            })
        }else{
            setErrors({
                ...valid
            })
        }
    }

    return(
        <div className="form-add-account">
            <form onSubmit={handleSubmit} noValidate>

            <div className="name-account">
                <InputNormal value={accountName} onchange={handleAccountName} {...dataAccount.accountName}/>
                {errors.accountName && <div className="error-add-account">{messages.accountName}</div>}
            </div>
            <div className="state-account">
                <InputNormal value={accountState} onchange={handleAccountState} {...dataAccount.accountState}/>
                {errors.accountState && <div className="error-add-account">{messages.accountState}</div>}
            </div>

            <div className="save-add-account">
                <button>Zapisz</button>
            </div>
            </form>
        </div>
    )
}

export default AddAccountForm;