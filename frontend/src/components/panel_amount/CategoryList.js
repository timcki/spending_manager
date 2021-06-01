import React from 'react';
import { Link } from 'react-router-dom';
import Paginate from '../Paginate';
import CategoryCard from './CategoryCard'
import '../../styles/panel_amount/categoryList.css'

const CategoryList = ({data, loading, amountOnPage,totalAmount,onclick,page})=>{

    console.log(data)
    const actual = data.map((temp)=>(
        // <li key ={temp.id}>
        //     <Link to={`/history/${transaction.id}`}>
        //     {temp.name}
        //     </Link>
        // </li>      
        <CategoryCard key ={temp.id} name={temp.name}/>
        /* // <TransactionCard key ={temp.id} {...temp}/> */

            /* <Link to={`/history/${transaction.id}`}>
            {transaction.name}
            </Link> */      
    ))
    return(
        <>
            {
                loading?<h3>Loading...</h3>:
                (<div className="category-list">
                    <div className="category-content">
                        {actual}
                    </div>
                    <div className="category-pagination"> 
                        <Paginate 
                            amountOnPage={amountOnPage} 
                            totalAmount={totalAmount}
                            onclick={onclick}
                            page={page}
                            />
                    </div>
                </div>
                )
            }
        </>
        
    )
}

export default CategoryList;