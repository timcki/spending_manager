import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navigation.css';

const panels =[
    {name: "transakcje", path: "/transactions"},
    {name: "twoje konta", path: "/accounts"},
    {name: "statystyki", path: "/statistics"},
    {name: "historia", path: "/history"},
    {name: "ustawienia", path: "/settings"},
    {name: "wyloguj", path: "/logout"},
]

const Navigation = ()=>{
    const navigation = panels.map(panel =>(
        <li key={panel.name}>
            <NavLink to={panel.path}>{panel.name}</NavLink>
        </li>
    ))
    return(
        <nav>
            <ul>
                {navigation}
            </ul>
        </nav>
    )
}

export default Navigation;