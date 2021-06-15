import React from 'react';
import '../styles/transactionCard.css';
import { Trash } from 'react-bootstrap-icons';
import { PencilSquare } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

const transaction_types = {
	1: 'wydatek',
	2: 'przychód',
	3: 'przelew',
};

const TransactionCard = ({
	type,
	category_id,
	transaction_type,
	recipient,
	amount,
	transaction_date,
	id,
	deleteFun,
	other_account_id,
	cyclic_period,
}) => {
	const date = new Date(Object.values(transaction_date)[0]);

	const formattedDate = date.toLocaleString('pl-PL', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});

	let type_name = transaction_types[transaction_type];

	let amountClasses = '';
	let idClasses = ['transaction-id'];
	if (transaction_type == 1 || transaction_type == 3) {
		amountClasses = 'negative';
		idClasses.push('negative');
	} else if (transaction_type == 2) {
		amountClasses = 'positive';
		idClasses.push('positive');
	}

	return (
		<div key={id} className="test">
			<div className="transaction-card">
				<div className={idClasses.join(' ')}>
					{' '}
					{type_name.toUpperCase()}
				</div>
				<div className="category-name">
					<div className="category">{category_id}</div>
					<div className="name">{recipient}</div>
				</div>
				<div className="amount-date">
					<div className={amountClasses}>{amount} PLN</div>
					<div className="date">{formattedDate}</div>
				</div>
				<div className="icons-container">
					<div>
						<Link
							to={{
								pathname: `/history/${id}`,
								state: {
									category_id: category_id,
									transaction_type: transaction_type,
									recipient: recipient,
									amount: amount,
									transaction_date: transaction_date,
									transaction_id: id,
									other_account_id: other_account_id,
									cyclic_period: cyclic_period,
								},
							}}>
							{<PencilSquare className="icons update-icon" />}
						</Link>
					</div>
					<div>
						{
							<Trash
								className="icons delete-icon"
								onClick={deleteFun}
							/>
						}
					</div>
				</div>
			</div>
		</div>
	);
};

export default TransactionCard;
