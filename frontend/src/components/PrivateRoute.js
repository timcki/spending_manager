import React, { useContext } from 'react';
import {Redirect, Route} from 'react-router-dom';
import {AppContext} from "../store/AppContext";


const PrivateRoute =({component:Component, ...rest}) =>{
    const {isLogin} = useContext(AppContext);
    return(
        <Route {...rest} render ={(props)=>(
            isLogin()?
            <Component {...props}/>
            :<Redirect to='/' />
        )}/>
    )
}

export default PrivateRoute;