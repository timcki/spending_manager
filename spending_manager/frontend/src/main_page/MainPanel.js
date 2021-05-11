import React from 'react';
import {Route,Switch} from 'react-router-dom';

import Transactions from '../panels/Transactions';
import Accounts from '../panels/Accounts';
import Statistics from '../panels/Statistics';
import History from '../panels/History';
import Settings from '../panels/Settings';

const MainPanel = ()=>{
    return(
        <>
            <Switch>
                <Route path="/transactions" component={Transactions}/>
                <Route path="/accounts" component={Accounts}/>
                <Route path="/statistics" component={Statistics}/>
                <Route path="/history" component={History}/>
                <Route path="/settings" component={Settings}/>
            </Switch>
        </>
    )
}

export default MainPanel;