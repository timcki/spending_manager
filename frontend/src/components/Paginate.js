import React from 'react';


const Paginate = ({amountOnPage, totalAmount, onclick, page})=>{

    let pageNumbers = [];

    for(let i=1; i<= Math.ceil(totalAmount / amountOnPage); i++){
        pageNumbers.push(i);
    }
    const amountPage=pageNumbers.length
    const start = [1, 2,3,4,5]
    const middle=[page-2,page-1,page,page+1,page+2]
    const end = [amountPage-4,amountPage-3,amountPage-2,amountPage-1,amountPage]
    
    if(amountPage>6){
        if(page<4){
            pageNumbers=start
        }else if(page>amountPage-3){
            pageNumbers=end
        }else{
            pageNumbers=middle
        } 
    }
    return(
        <nav>
            {page>1 && <button onClick={()=>{onclick(page-1)}}>Prev</button>}
                {
                    pageNumbers.map(number=>(
                            <button onClick={()=>{onclick(number)}}>
                                {number}
                            </button>
                    ))
                }
            {page<amountPage && <button onClick={()=>{onclick(page+1)}}>Next</button>}
        </nav>
    )
}

export default Paginate;