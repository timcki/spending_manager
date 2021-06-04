import React,{useContext,useEffect,useState} from 'react';
import '../styles/UserPanel.css';
import {AppContext} from "../store/AppContext";
import api from '../utils/api'

import axios from 'axios'

const UserPanel = ()=>{
    const {currentAccount,getCsrfToken,getToken,setCurrentAccount} = useContext(AppContext);
    const [accountData,setAccountData] = useState();

    useEffect(()=>{
        // const headers={
        //     'X-CSRF-TOKEN':`${getCsrfToken()}`,
        //     "Content-Type":"application/json",
        //     "Authorization":`Bearer ${getToken()}`
        // }
        const getAccountData = async () =>{
            const res = await api.get('/api/v1/main_account/get',
            {
                headers:{
                    "Authorization":`Bearer ${getToken()}`,
                    'X-CSRF-TOKEN':`${getCsrfToken()}`,
                    "Content-Type":"application/json"
                }
            });
            setAccountData(res.data);
            setCurrentAccount(res.data._id.$oid);
            console.log(res.data);    
        }
        getAccountData();

    },[])
    
    return(
        <div className="user-panel">
        {console.log(currentAccount)}
        {currentAccount?(
            <div>
            <p>Wybrane Konto: {accountData.name}</p>
            <p>Stan Konta: {accountData.balance} PLN</p>
            </div>)
        :(
            <div>Brak Konta</div>
        )
        }
        </div>
    )
}

export default UserPanel;