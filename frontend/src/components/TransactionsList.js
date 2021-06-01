import React from 'react';
import { Link } from 'react-router-dom';
import Paginate from './Paginate'
import TransactionCard from './TransactionCard'
const TransactionsList = ({data, loading, amountOnPage,totalAmount,onclick,page})=>{

    console.log(data)
    const actual = data.map((transaction)=>(
        // <li key ={transaction.id}>
        //     <Link to={`/history/${transaction.id}`}>
        //     {transaction.name}
        //     </Link>
        // </li>      
        <TransactionCard key ={transaction.id} {...transaction}/>
            /* <Link to={`/history/${transaction.id}`}>
            {transaction.name}
            </Link> */      
    ))
    return(
        <ul>
            {
                loading?<h3>Loading...</h3>:
                (<div>
                    {actual}
                    <Paginate 
                        amountOnPage={amountOnPage} 
                        totalAmount={totalAmount}
                        onclick={onclick}
                        page={page}
                        />
                </div>
                )
            }
        </ul>
        
    )
}

export default TransactionsList;