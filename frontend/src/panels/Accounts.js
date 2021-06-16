import React, {useState} from 'react';
import { Route, Switch } from 'react-router-dom';
import AddAccountForm from '../components/panel_amount/AddAccountForm';
import MyAccounts from '../components/panel_amount/MyAccounts';
import AddCategoryForm from '../components/panel_amount/AddCategoryForm';
import Category from '../components/panel_amount/Category';
import AccountNav from '../components/panel_amount/AccountNav';
import '../styles/panel_amount/accounts.css';
import InfoModal from '../components/InfoModal';

const Accounts = () => {
	const [isOpenModal,setIsOpenModal]=useState(false); 
	const [modalData,setModalData]=useState({
		header:"",
		content:"",
		classes:""
	});
	return (
		<>
			<div className="accounts">
				<AccountNav />
				<Switch>
					<Route
						path="/accounts/add/account"
						component={()=><AddAccountForm setIsOpenModal={setIsOpenModal} setModalData={setModalData}/>}
						/>
					<Route 
						path="/accounts/category" 
						component={()=><Category setIsOpenModal={setIsOpenModal} setModalData={setModalData}/>}
						// component={Category} 
						/>
					<Route
						path="/accounts/add/category"
						component={()=><AddCategoryForm setIsOpenModal={setIsOpenModal} setModalData={setModalData}/>}
						/>
					<Route 
						path="/accounts" 
						component={MyAccounts} 
						/>
				</Switch>
			</div>
			{isOpenModal&&<InfoModal handleFunc={setIsOpenModal} modalIsOpen={isOpenModal} modalData={modalData}/>}
		</>
	);
};

export default Accounts;
