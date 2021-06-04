import React,{ useEffect, useState } from 'react';
import api from '../utils/api';
import {useCookies} from 'react-cookie';
import { useHistory } from 'react-router';
export const AppContext = React.createContext();

const AppProvider = ({children}) => {
    const [user, setUser]=useState();
    // const [token, setToken]=useState();
    const [cookies, setCookie, removeCookie] = useCookies();
    const [currentAccount,setCurrentAccount] = useState();
    

    const history = useHistory();

    useEffect(()=>{
        takeFromLocalStorage();
    })

    const isLogin=()=>{
        return cookies.token && cookies.token !=="" && cookies.token!==undefined ;
    }
    const getToken=()=>{
        return cookies.token;
    }
    const getCsrfToken=()=>{
        return cookies.csrf_access_token;
    }
    
    
    const loginOnClickHandler = async (payload, setSubmitting) => {
        api
        .post('/api/v1/login', payload)
        .then(response => {
            setSubmitting(false);
            if (response.status === 200) {
                // localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', response.data.username);
                setCookie('token',response.data.token);
                setUser(response.data.username);
                setCurrentAccount(response.data.account);
                console.log(response)
                history.push('/transactions')
                return true
                
                // setIsAuthenticated(response.data.token !== null);
            }else{
				alert("Błędne logowanie")

                return false
            }
        })
        .catch(err => {});
	};
    
    const signUpOnClickHandler = (payload, setSubmitting) => {
        api
        .post('/api/v1/registration', payload)
        .then(response => {
            setSubmitting(false);
            console.log(response)
            if (response.data.success) {
                alert(response.data.mssg + '\nPrzejdz do logowania!');
                return true
            } else {
                alert(response.data.mssg);
                return false
            }
        })
        .catch(err => {});
	};
    
    const logout = () =>{
        // localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        // setToken(null);
        removeCookie('token');
        history.push('/');
    }

    const takeFromLocalStorage=()=>{
        // const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        if(isLogin()){
            setUser(user);
        }
    }
    
    const value = {
        user,
        signUpOnClickHandler,
        loginOnClickHandler,
        logout,
        isLogin,
        getToken,
        getCsrfToken,
        currentAccount,
        setCurrentAccount
        
    }


    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
};

export default AppProvider;