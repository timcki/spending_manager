import React from 'react';
import { Link, useParams } from 'react-router-dom';
// import api from '../utils/api';
// import { AppContext } from '../store/AppContext';
import FormTransactions from './FormTransactions';

const transaction_types = {
	1:'wydatek',
	2:'przychód'
};

const TransactionUpdate = ({ match, location }) => {
	const amount = useParams();
	// const { getCsrfToken } = useContext(AppContext);
	// const [updateData, setUpdateData] = useState(null);
	// useEffect(() => {
	// 	const getTransaction = async () => {
	// 		console.log(match.params.id);
	// 		const res = await api.get(
	// 			'/api/v1/transaction/get?transaction_id=' + match.params.id,
	// 			{
	// 				headers: {
	// 					'X-CSRF-TOKEN': `${getCsrfToken()}`,
	// 					'Content-Type': 'application/json',
	// 				},
	// 			},
	// 		);
	// 		console.log(res.data[0]);
	// 		console.log(location);
	// 		setUpdateData(res.data[0]);
	// 	};
	// 	getTransaction();
	// }, []);
	return (
		<>
			<div> Aktualizacja transakcji</div>
			<FormTransactions
				p_amount={location.state.amount}
				p_date={new Date(Object.values(location.state.transaction_date)[0])} 
				p_selectCategory={{value:location.state.category_id.toLowerCase(),label:location.state.category_id.toLowerCase()}}
				p_selectType={{value:location.state.transaction_type,label:transaction_types[location.state.transaction_type]}}
				p_description={location.state.recipient}
				p_id={location.state.transaction_id}
				url="/api/v1/transactions/update"
			/>
			<br />
			<br />
			<Link to="/history">Powrót do Transakcji</Link>
		</>
	);
};

export default TransactionUpdate;
