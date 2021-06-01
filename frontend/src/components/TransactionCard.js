import React from 'react';
import '../styles/transactionCard.css'
// import { Trash } from 'react-bootstrap-icons';
// import { PencilSquare } from 'react-bootstrap-icons';

const TransactionCard = ({type,category,name,amount,date})=>{
    return(
        <div className="test">

        <div className="transaction-card">
            <div class="transaction-type"> {type}</div>
            <div className="category-name">
                <div className="category">{category}</div>
                <div className="name">{name}</div>
            </div>
            <div className="amount-date">
                <div className="amount">{amount}</div>
                <div className="date">{date}</div>
            </div>
            {/* <PencilSquare className="icons update-icon"/>
            <Trash className="icons delete-icon"/> */}
        </div>
        </div>
    )
}

export default TransactionCard;