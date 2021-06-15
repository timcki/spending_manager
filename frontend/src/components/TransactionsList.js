import React, { useState, useContext } from 'react';
import Paginate from './Paginate';
import TransactionCard from './TransactionCard';
import api from '../utils/api';
import { AppContext } from './../store/AppContext';
import '../styles/transactionList.css';

const TransactionsList = ({
	data,
	loading,
	amountOnPage,
	totalAmount,
	onclick,
	page,
	csrfToken,
}) => {
	const [numberOfRecords, setNumberOfRecords] = useState(0);
	const { currentAccount, getCsrfToken, setCurrentAccount } =
		useContext(AppContext);

	const deleteTransaction = id => {
		const payload = { transaction_id: id };
		api.post('/api/v1/transactions/delete', payload, {
			headers: {
				'X-CSRF-TOKEN': `${getCsrfToken()}`,
				'Content-Type': 'application/json',
			},
		})
			.then(response => {
				if (response.status === 200) {
					console.log(response);
					setCurrentAccount(response.data);
					console.log('usunieto');
				}
			})
			.catch(err => {});
	};
	console.log(data);
	const actual = data.map((transaction, index) => (
		<TransactionCard
			key={index}
			id={Object.values(transaction._id)[0]}
			{...transaction}
			deleteFun={() =>
				deleteTransaction(Object.values(transaction._id)[0])
			}
		/>
	));
	return (
		<>
			{loading ? (
				<h3>Loading...</h3>
			) : (
				<div className="transaction-list">
					<div className="transaction-content">{actual}</div>
					<div className="transaction-pagination">
						<Paginate
							amountOnPage={amountOnPage}
							totalAmount={totalAmount}
							onclick={onclick}
							page={page}
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default TransactionsList;
