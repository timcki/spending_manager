import React, { useContext } from 'react';
import {Redirect, Route,} from 'react-router-dom';
import {AppContext} from "../store/AppContext";


const PublicRoute =({component:Component, restricted, ...rest}) =>{
    const {isLogin} = useContext(AppContext);

    return(
        <Route {...rest} render ={(props)=>(
            isLogin() && restricted?
            <Redirect to={"/transactions"} />
            :<Component {...props}/>
        )}/>
    )
}

export default PublicRoute;