import React,{useContext,useEffect,useState} from 'react';
import '../styles/UserPanel.css';
import {AppContext} from "../store/AppContext";
import api from '../utils/api'

import axios from 'axios'

const UserPanel = ()=>{
    const {currentAccount,getCsrfToken,getToken} = useContext(AppContext);
    const {accountData,setAccountData} = useState();

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
            // setAccountData(res.data);
            console.log(res);    
        }
        getAccountData();

    },[])
    
    return(
        <div className="user-panel">
        {currentAccount?(
            <div>
            <p>Wybrane Konto: Konto Bankowe</p>
            <p>Stan Konta: 241.24 PLN</p>
            </div>)
        :(
            <div>Brak Konta</div>
        )
        }
        </div>
    )
}

export default UserPanel;