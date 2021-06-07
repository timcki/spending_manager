import React from 'react';
import Transactions from '../panels/Transactions';
import Accounts from '../panels/Accounts';
import Statistics from '../panels/Statistics';
import History from '../panels/History';
import Settings from '../panels/Settings';
import TransactionUpdate from '../components/TransactionUpdate';

import {Switch,Route} from 'react-router-dom';

const MainPanel = props => {
	// let panel = null;
	// switch (props.history.location.pathname) {
	// 	case '/transactions':
	// 		panel = <Transactions />;
	// 		break;
	// 	case '/accounts':
	// 		panel = <Accounts />;
	// 		break;
	// 	case '/statistics':
	// 		panel = <Statistics />;
	// 		break;
	// 	case '/history':
	// 		panel = <History />;
	// 		break;
	// 	case '/settings':
	// 		panel = <Settings />;
	// 		break;
	// 	default:
	// 		panel = <Transactions />;
	// }
	// return panel;

	return (
		<>
		  <Switch>
			<Route path="/transactions" component={Transactions} />
			<Route path="/accounts" component={Accounts} />
			<Route path="/statistics" component={Statistics} />
			<Route path="/history/:id" component={TransactionUpdate} />
			<Route path="/history" component={History} />
			<Route path="/settings" component={Settings} />
		  </Switch>
		</>
	  );
};

export default MainPanel;
