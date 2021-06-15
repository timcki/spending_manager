import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/panel_amount/accountNav.css';
const accountOptions =[
    {name: "Dodaj konto", path: "/accounts/add/account"},
    {name: "Twoje kategorie", path: "/accounts/category"},
    {name: "Dodaj kategorie", path: "/accounts/add/category"},
    {name: "Twoje konta", path: "/accounts", exact:true}
]

const AccountNav = ()=>{
    const navigation = accountOptions.map(panel =>(
        <li key={panel.name}>
            <NavLink to={panel.path} exact ={panel.exact}>{panel.name}</NavLink>
        </li>
    ))
    return(
        <nav className="account-nav">
            <ul>
                {navigation}
            </ul>
        </nav>
    )
}

export default AccountNav;