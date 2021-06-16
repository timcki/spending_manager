import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TransactionNav from './../components/panel_amount/TransactionNav';
import FormTransactions from '../components/FormTransactions';
import FormTransfer from '../components/FormTransfer';
import FormPeriodicTransactions from '../components/FormPeriodicTransactions';

const Transactions = () => {
	return (
		<div>
			<div className="transactions">
				<TransactionNav />
				<Switch>
					<Route
						path="/transactions/periodic"
						component={FormPeriodicTransactions}
					/>
					<Route
						path="/transactions/transfer"
						component={FormTransfer}
					/>
					<Route path="/transactions" component={FormTransactions} />
				</Switch>
			</div>
		</div>
	);
};

export default Transactions;
