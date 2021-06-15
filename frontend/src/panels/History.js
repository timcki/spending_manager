import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import TransactionsList from '../components/TransactionsList';
import { AppContext } from '../store/AppContext';

const History = () => {
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [amountOnPage, setAmountOnPage] = useState(10);

	const { getCsrfToken, currentAccount } = useContext(AppContext);

	useEffect(() => {
		const fetchTransactions = async () => {
			setLoading(true);
			const res = await api.get('/api/v1/transactions/get', {
				headers: {
					'X-CSRF-TOKEN': `${getCsrfToken()}`,
					'Content-Type': 'application/json',
				},
			});
			setTransactions(res.data);
			console.log(res.data);
			setLoading(false);
		};

		fetchTransactions();
	}, [currentAccount]);

	const lastTransaction = page * amountOnPage;
	const firstTransaction = lastTransaction - amountOnPage;
	const actualTransactions = transactions.slice(
		firstTransaction,
		lastTransaction,
	);

	const handleClickChangePage = number => {
		setPage(number);
	};

	return (
		<>
			<div>History</div>
			<TransactionsList
				data={actualTransactions}
				loading={loading}
				amountOnPage={amountOnPage}
				totalAmount={transactions.length}
				onclick={handleClickChangePage}
				page={page}
				csrfToken={getCsrfToken()}
			/>
			{/* <TransactionsList transactions={actualTransactions} loading={loading}/>
        <Paginate amountOnPage={amountOnPage} totalAmount={transactions.length}/> */}
		</>
	);
};

export default History;
