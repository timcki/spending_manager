import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Navigation from './Navigation';
import MainPanel from './MainPanel';
import UserPanel from './UserPanel';
import Avatar from './Avatar';
import '../styles/Main.css';

const Main = ()=>{
    return(
        <Router>
            <div className="main-container">
                <aside>
                    {<Avatar/>}
                    {<Navigation/>}
                </aside>
                <main>
                    {/* <section className="user-panel"> */}
                        {<UserPanel/>}
                    {/* </section> */}
                    <section className="main-panel">
                        {<MainPanel/>}
                    </section>
                </main>
            </div>
        </Router>
    )
}


export default Main;