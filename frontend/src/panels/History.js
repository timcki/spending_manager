import React,{useState,useEffect} from 'react';
import api from '../utils/api';
import axios from 'axios'
// import Paginate from '../components/Paginate'
import TransactionsList from '../components/TransactionsList';


const History = ()=>{
    const [transactions,setTransactions] = useState([]);
    const [loading,setLoading] = useState(false);
    const [page,setPage] = useState(1);
    const [amountOnPage,setAmountOnPage] = useState(10);

    useEffect(() =>{
        const fetchTransactions = async ()=>{
            setLoading(true);
            const res = await axios.get('http://localhost:3006/transactions');
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