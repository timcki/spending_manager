import React from 'react';
import { Link, useParams } from 'react-router-dom';
// import api from '../utils/api';
// import { AppContext } from '../store/AppContext';
import FormTransactions from './FormTransactions';
import FormPeriodicTransactions from './FormPeriodicTransactions';
import FormTransfer from './FormTransfer';

const transaction_types = {
	1: 'wydatek',
	2: 'przychód',
	3: 'przelew',
};

const TransactionUpdate = ({ match, location }) => {

	console.log("terasxax")
	console.log(location.state)

	const other_account_id =location.state.other_account_id?Object.values(location.state.other_account_id)[0]:null;
	let updateForm = null;
	if (
		location.state.transaction_type === 1 ||
		location.state.transaction_type === 2
	) {
		updateForm = (
			<FormTransactions
				p_amount={location.state.amount}
				p_date={
					new Date(Object.values(location.state.transaction_date)[0])
				}
				p_selectCategory={{
					value: location.state.category_id.toLowerCase(),
					label: location.state.category_id.toLowerCase(),
				}}
				p_selectType={{
					value: location.state.transaction_type,
					label: transaction_types[location.state.transaction_type],
				}}
				p_description={location.state.recipient}
				p_selectPeriod={location.state.cyclic_period}
				// p_targetAccount={{
				// 	// value: other_account_id,
				// 	value: 123132,
				// 	label: "other_account_id"
				// }}
				p_id={location.state.transaction_id}
				url="/api/v1/transactions/update"
			/>
		);
	} else if (location.state.transaction_type === 3) {
		console.log(location);
		updateForm = (
			<FormTransfer
				p_amount={location.state.amount}
				p_date={
					new Date(Object.values(location.state.transaction_date)[0])
				}
				p_selectCategory={{
					value: location.state.category_id.toLowerCase(),
					label: location.state.category_id.toLowerCase(),
				}}
				p_selectType={{
					value: location.state.transaction_type,
					label: transaction_types[location.state.transaction_type],
				}}
				p_description={location.state.recipient}
				p_selectPeriod={location.state.cyclic_period}
				// p_targetAccount={location.state.other_account_id}
				p_targetAccount={{
					value: other_account_id,
					label: location.state.other_account_name

				}}
				p_id={location.state.transaction_id}
				url="/api/v1/transactions/update"
			/>
		);
	}

	return (
		<>
			<div> Aktualizacja transakcji</div>
			{updateForm}

			<br />
			<br />
			<Link to="/history">Powrót do Transakcji</Link>
		</>
	);
};

export default TransactionUpdate;
