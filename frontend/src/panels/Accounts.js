import React from 'react';
import {Route,Switch} from 'react-router-dom'
import AddAccountForm from '../components/panel_amount/AddAccountForm'
import AddCategoryForm from '../components/panel_amount/AddCategoryForm'
import Category from '../components/panel_amount/Category'
import AccountNav from '../components/panel_amount/AccountNav';
import '../styles/panel_amount/accounts.css'

const Accounts = ()=>{
    return(
        <>
            <div className="accounts">
                <AccountNav/>
                <Switch>
                    <Route path="/accounts/add/account" component={AddAccountForm}/>
                    <Route path="/accounts/category" component={Category}/>
                    <Route path="/accounts/add/category" component={AddCategoryForm}/>
                    <Route path="/accounts" component={AddAccountForm} />
                </Switch>
            </div>
        </>
    )
}

export default Accounts;