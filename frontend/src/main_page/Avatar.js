import React,{useContext} from 'react';
import avatar_img from '../images/logo.png';
import '../styles/Avatar.css';
import {AppContext} from "../store/AppContext";

const Avatar = ()=>{
    
    const {user} = useContext(AppContext);

    return(
        <section className="avatar">
            <div>
                <img src={avatar_img} alt="logo użytkownika"/>
            </div>
            {user?<p>{user}</p>:null}
        </section>
    )
}


export default Avatar;