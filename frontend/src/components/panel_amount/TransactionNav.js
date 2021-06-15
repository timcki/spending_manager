import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/panel_amount/transactionNav.css';
const transactionOptions = [
	{ name: 'Transakcja', path: '/transactions', exact: true },
	{ name: 'Transakcja cykliczna', path: '/transactions/periodic' },
	{ name: 'Przelew', path: '/transactions/transfer' },
];

const TransactionNav = () => {
	const navigation = transactionOptions.map(panel => (
		<li key={panel.name}>
			<NavLink to={panel.path} exact={panel.exact}>
				{panel.name}
			</NavLink>
		</li>
	));
	return (
		<nav className="transaction-nav">
			<ul>{navigation}</ul>
		</nav>
	);
};

export default TransactionNav;
