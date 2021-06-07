import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Paginate from './Paginate';
import TransactionCard from './TransactionCard';
import api from '../utils/api';
import { AppContext } from './../store/AppContext';

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
		// <li key ={transaction.id}>
		//     <Link to={`/history/${transaction.id}`}>
		//     {transaction.name}
		//     </Link>
		// </li>
		// <TransactionCard key={index} id={index + 1} {...transaction} deleteFun={()=>deleteTransaction(Object.values(transaction._id)[0])} />
		<TransactionCard
			key={index}
			id={Object.values(transaction._id)[0]}
			{...transaction}
			deleteFun={() =>
				deleteTransaction(Object.values(transaction._id)[0])
			}
		/>
		/* <Link to={`/history/${transaction.id}`}>
            {transaction.name}
            </Link> */
	));
	return (
		<ul>
			{loading ? (
				<h3>Loading...</h3>
			) : (
				<div>
					{actual}
					<Paginate
						amountOnPage={amountOnPage}
						totalAmount={totalAmount}
						onclick={onclick}
						page={page}
					/>
				</div>
			)}
		</ul>
	);
};

export default TransactionsList;
