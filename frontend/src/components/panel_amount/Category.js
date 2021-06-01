import React,{useState,useEffect} from 'react';
// import api from '../utils/api';
import axios from 'axios'
import CategoryList from './CategoryList';


const Category = ()=>{
    const [category,setCategory] = useState([]);
    const [loading,setLoading] = useState(false);
    const [page,setPage] = useState(1);
    const [amountOnPage,setAmountOnPage] = useState(10);

    useEffect(() =>{
        const fetchCategory = async ()=>{
            setLoading(true);
            const res = await axios.get('http://localhost:3006/transactions');
            setCategory(res.data)
            console.log(res.data)
            setLoading(false)
        }

        fetchCategory();
    },[]);
    
    const lastCategory =page * amountOnPage;
    const firstCategory =lastCategory-amountOnPage;
    const actualCategory = category.slice(firstCategory,lastCategory);
    
    const handleClickChangePage = (number)=>{
        setPage(number);
    }

    return(
        <>
        <CategoryList 
            data={actualCategory} 
            loading={loading} amountOnPage={amountOnPage} 
            totalAmount={category.length}
            onclick = {handleClickChangePage} 
            page={page}
            />
        {/* <TransactionsList transactions={actualTransactions} loading={loading}/>
        <Paginate amountOnPage={amountOnPage} totalAmount={transactions.length}/> */}
        </>
    )
}

export default Category;