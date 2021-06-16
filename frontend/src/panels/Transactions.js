import React,{useState} from 'react';
import { Route, Switch } from 'react-router-dom';
import TransactionNav from './../components/panel_amount/TransactionNav';
import FormTransactions from '../components/FormTransactions';
import FormTransfer from '../components/FormTransfer';
import FormPeriodicTransactions from '../components/FormPeriodicTransactions';
import InfoModal from '../components/InfoModal';

const Transactions = ({ ...props}) => {
	const [isOpenModal,setIsOpenModal]=useState(false); 
	const [modalData,setModalData]=useState({
		header:"",
		content:"",
		classes:""
	});
	return (
		<>
		<div>
			<div className="transactions">
				<TransactionNav />
				<Switch>
					<Route
						path="/transactions/periodic"
						// component={FormPeriodicTransactions}
						component={()=><FormPeriodicTransactions setIsOpenModal={setIsOpenModal} setModalData={setModalData}/>}
					/>
					<Route
						path="/transactions/transfer"
						component={()=><FormTransfer setIsOpenModal={setIsOpenModal} setModalData={setModalData}/>}
					/>
					{/* <Route path="/transactions" component={FormTransactions} /> */}
					<Route path="/transactions" component={()=><FormTransactions setIsOpenModal={setIsOpenModal} setModalData={setModalData}/>} />
				</Switch>
			</div>
		</div>
		  {isOpenModal&&<InfoModal handleFunc={setIsOpenModal} modalIsOpen={isOpenModal} modalData={modalData}/>}
		</>
	);
};

export default Transactions;
