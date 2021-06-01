import React from 'react';
import '../../styles/panel_amount/categoryCard.css'
// import { Trash } from 'react-bootstrap-icons';

const TransactionCard = ({name,id})=>{
    return(
        <div key={id} className="category-card-wrapper">
            <div className="category-card">
                <div class="category-name"> {name}</div>
                <div>
                    {/* <Trash className="icons delete-icon"/> */}
                </div>
            </div>
        </div>
    )
}

export default TransactionCard;