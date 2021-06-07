import React, { useContext, useState } from 'react';
import InputNormal from '../InputNormal';
import axios from 'axios';
import api from '../../utils/api';
import { AppContext } from '../../store/AppContext';

const dataAccount = {
	accountName: {
		name: 'accountName',
		label: 'Nazwa konta',
		type: 'text',
	},
	accountState: {
		name: 'accountState',
		label: 'Stan konta',
		type: 'number',
		step: '0.01',
	},
};
const messages = {
	accountName: 'Nazwa musi mieć od 4 do 200 znaków',
	accountState: 'Kwota musi być większa od zera',
};

const AddAccountForm = () => {
	const { CurrentAccount, getToken, getCsrfToken, setCurrentAccount } =
		useContext(AppContext);

	const [accountName, setAccountName] = useState('');
	const [accountState, setAccountState] = useState(0);

	const [errors, setErrors] = useState({
		accountName: false,
		accountState: false,
	});

	const validationFun = () => {
		let correct = true;
		let errAccountName = false;
		let errAccountState = false;

		if (accountName.length < 4 || accountName.length > 200) {
			errAccountName = true;
		}
		if (accountState === '') {
			errAccountState = true;
		}
		if (errAccountName || errAccountState) {
			correct = false;
		}
		return {
			correct,
			accountName: errAccountName,
			accountState: errAccountState,
		};
	};

	const handleAccountName = e => {
		setAccountName(e.target.value);
	};

	const handleAccountState = e => {
		const a = e.target.value;
		let temp = a.indexOf('.');
		let xtemp = a.length - temp - 1;
		if (xtemp < 3) {
			setAccountState(e.target.value);
		} else if (temp < 0) {
			setAccountState(e.target.value);
		}
	};

	const handleSubmit = e => {
		e.preventDefault();
		let { correct, ...valid } = validationFun();

		if (correct) {
			const payload = {
				acc_name: accountName,
				acc_balance: accountState,
			};
			console.log(payload);
			console.log('token\n');
			console.log(getToken());
			api.post('/api/v1/accounts/create', payload, {
				headers: {
					'X-CSRF-TOKEN': `${getCsrfToken()}`,
					'Content-Type': 'application/json',
				},
			})
				.then(response => {
					console.log('Im here', response.data);
					//setCurrentAccount(response.data);
				})
				.catch(err => {});

			setAccountName('');
			setAccountState(0);

			setErrors({
				accountName: false,
				accountState: false,
			});
		} else {
			setErrors({
				...valid,
			});
		}
	};

	return (
		<div className="form-add-account">
			<form onSubmit={handleSubmit} noValidate>
				<div className="name-account">
					<InputNormal
						value={accountName}
						onchange={handleAccountName}
						{...dataAccount.accountName}
					/>
					{errors.accountName && (
						<div className="error-add-account">
							{messages.accountName}
						</div>
					)}
				</div>
				<div className="state-account">
					<InputNormal
						value={accountState}
						onchange={handleAccountState}
						{...dataAccount.accountState}
					/>
					{errors.accountState && (
						<div className="error-add-account">
							{messages.accountState}
						</div>
					)}
				</div>

				<div className="save-add-account">
					<button>Zapisz</button>
				</div>
			</form>
		</div>
	);
};

export default AddAccountForm;
