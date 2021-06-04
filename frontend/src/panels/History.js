import React,{useState,useEffect,useContext} from 'react';
import api from '../utils/api';
import axios from 'axios'
// import Paginate from '../components/Paginate'
import TransactionsList from '../components/TransactionsList';
import {AppContext} from "../store/AppContext";


const History = ()=>{
    const [transactions,setTransactions] = useState([]);
    const [loading,setLoading] = useState(false);
    const [page,setPage] = useState(1);
    const [amountOnPage,setAmountOnPage] = useState(10);

    const {getCsrfToken,getToken,currentAccount} = useContext(AppContext);


    useEffect(() =>{
        const fetchTransactions = async ()=>{
            setLoading(true);
            console.log(currentAccount);
            // const res = await api.get(`/api/v1/transactions/gets?account_id=${currentAccount}`,
            const res = await api.get(`/api/v1/transactions/get`,
            {
                headers:{
                    "Authorization":`Bearer ${getToken()}`,
                    'X-CSRF-TOKEN':`${getCsrfToken()}`,
                    "Content-Type":"application/json"
                }
            });
            // const res = await axios.get('http://localhost:3006/transactions');
            setTransactions(res.data)
            console.log(res.data)
            setLoading(false)
        }

        fetchTransactions();
    },[]);
    
    const lastTransaction =page * amountOnPage;
    const firstTransaction =lastTransaction-amountOnPage;
    const actualTransactions = transactions.slice(firstTransaction,lastTransaction);
    
    const handleClickChangePage = (number)=>{
        setPage(number);
    }

    return(
        <>
        <div>History</div>
        <TransactionsList 
            data={actualTransactions} 
            loading={loading} amountOnPage={amountOnPage} 
            totalAmount={transactions.length}
            onclick = {handleClickChangePage} 
            page={page}
            />
        {/* <TransactionsList transactions={actualTransactions} loading={loading}/>
        <Paginate amountOnPage={amountOnPage} totalAmount={transactions.length}/> */}
        </>
    )
}

export default History;