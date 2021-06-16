import React, { useContext, useState, useEffect } from 'react';
import InputNormal from './InputNormal';

import DatePicker from './DatePicker';
import InputCalculator from './InputCalculator';
import AsyncSelect from './AsyncSelect';
import Select from './Select';
import '../styles/FormTransactions.css';
import api from '../utils/api';
import { AppContext } from '../store/AppContext';
import { useHistory } from 'react-router-dom';
const dataTransaction = {
	date: {
		name: 'date',
		label: 'Data przelewu',
	},
	category: {
		name: 'category',
		label: 'Kategoria',
		placeholder: 'Wybierz',
	},
	target_account: {
		name: 'type',
		label: 'Przelew na konto',
		placeholder: 'Wybierz',
	},
	name: {
		name: 'name',
		label: 'Nazwa',
		target_account: 'text',
		placeholder: 'np. Zakupy w sklepie itp.',
	},
};
const messages = {
	date: 'Musisz wybrać date',
	category: 'Musisz wybrać kategorie',
	target_account: 'Musisz wybrać konto na które chcesz przelać pieniądze',
	name: 'Nazwa musi mieć od 4 do 200 znaków',
	amount: 'Kwota musi być większa od zera',
};
const FormTransactions = ({
	setModalData,
	setIsOpenModal,
	p_amount = 0,
	p_date = new Date(),
	p_selectCategory = '',
	p_selectType = '',
	p_targetAccount = '',
	p_description = '',
	p_id = '',
	url = 'api/v1/transactions/create',
}) => {
	let history = useHistory();
	const { currentAccount, getCsrfToken, setCurrentAccount } =
		useContext(AppContext);

	const [date, setDate] = useState(p_date);
	const [selectCategory, setSelectCategory] = useState(p_selectCategory);
	const [transactionType, setTransactionType] = useState(3); // transfer is mapped to an int of value 3 on backend
	const [selectTargetAccount, setSelectTargetAccount] =
		useState(p_targetAccount);
	const [description, setDescription] = useState(p_description);
	const [amount, setAmount] = useState(p_amount);
	const [id, setId] = useState(p_id);

	const [category, setCategory] = useState([]);

	const [isOpenCalculator, setIsOpenCalculator] = useState(false);

	const [errors, setErrors] = useState({
		date: false,
		category: false,
		target_account: false,
		description: false,
		amount: false,
		openCalculator: false,
	});

	useEffect(() => {
		const fetchCategory = async () => {
			const res = await api.get('/api/v1/categories/get', {
				headers: {
					'X-CSRF-TOKEN': `${getCsrfToken()}`,
					'Content-Type': 'application/json',
				},
			});
			const categoriesNames = res.data.map(el => el.name);
			setCategory(categoriesNames);
			console.log(res.data);
		};

		fetchCategory();
	}, []);

	const handleDatePicker = date => {
		setDate(date);
	};

	const handleSelectCategory = selectCategory => {
		setSelectCategory(selectCategory);
	};

	const handleSelectTargetAccount = selectTargetAccount => {
		setSelectTargetAccount(selectTargetAccount);
	};
	const handleSetDescription = e => {
		setDescription(e.target.value);
	};

	const validationFun = () => {
		let correct = true;
		let errDate = false;
		let errCategory = false;
		let errType = false;
		let errDescription = false;
		let errAmount = false;
		let errOpenCalculator = false;
		if (isOpenCalculator) {
			errOpenCalculator = true;
		} else if (amount === '' || amount < 0) {
			errAmount = true;
		}
		if (date == null) {
			errDate = true;
		}
		if (selectTargetAccount === '') {
			errType = true;
		}
		if (selectCategory === '') {
			errCategory = true;
		}
		if (description.length < 4 || description.length > 200) {
			errDescription = true;
		}
		if (
			errOpenCalculator ||
			errAmount ||
			errCategory ||
			errDate ||
			errType ||
			errDescription
		) {
			correct = false;
		}
		return {
			correct,
			date: errDate,
			category: errCategory,
			target_account: errType,
			description: errDescription,
			amount: errAmount,
			openCalculator: errOpenCalculator,
		};
	};

	const handleSubmit = e => {
		e.preventDefault();
		let { correct, ...valid } = validationFun();

		const payload = {
			account_id: currentAccount._id.$oid,
			amount: amount,
			transaction_type: transactionType,
			category_id: selectCategory.value,
			transaction_date: date,
			recipient: description,
			transaction_id: id,
			other_account_id: selectTargetAccount.value,
			other_account_name: selectTargetAccount.label,
		};

		console.log(payload);
		if (correct) {
			api.post(url, payload, {
				headers: {
					'X-CSRF-TOKEN': `${getCsrfToken()}`,
					'Content-Type': 'application/json',
				},
			})
				.then(response => {
					console.log('dsadasda cos');
					if (response.status === 200) {
						setCurrentAccount(response.data);
						if (url.includes('update')) {
							history.push('/history');
						} else {
							setModalData({
								header: 'Przelew zatwierdzony',
								content: `Nazwa dodanego przelewu to ${description}`,
								classes: 'positive-info',
							});
							setIsOpenModal(true);
						}
					}
				})
				.catch(err => {});

			setDate(new Date());
			setAmount(0);
			setDescription('');
			setSelectCategory('');
			setSelectTargetAccount('');

			setErrors({
				date: false,
				category: false,
				target_account: false,
				description: false,
				amount: false,
				openCalculator: false,
			});
		} else {
			setErrors({
				...valid,
			});
		}
	};
	return (
		<div className="form-transactions">
			<form onSubmit={handleSubmit} noValidate>
				<div>
					<InputCalculator
						amount={amount}
						setAmount={setAmount}
						setIsOpenCalculator={setIsOpenCalculator}
					/>
					{errors.openCalculator && (
						<div className="error-transactions xcenter">
							Musisz zamknąć Kalkulator
						</div>
					)}
					{errors.amount && (
						<div className="error-transactions xcenter">
							{messages.amount}
						</div>
					)}
				</div>

				<div className="move-inputs">
					<div className="target_account-transactions">
						<AsyncSelect
							type={'accounts'}
							value={selectTargetAccount}
							onchange={handleSelectTargetAccount}
							{...dataTransaction.target_account}
						/>
						{errors.target_account && (
							<div className="error-transactions">
								{messages.target_account}
							</div>
						)}
					</div>
					<div className="date-transactions">
						<DatePicker
							onchange={handleDatePicker}
							date={date}
							{...dataTransaction.date}
						/>
						{errors.date && (
							<div className="error-transactions">
								{messages.date}
							</div>
						)}
					</div>
					<div className="category-transactions">
						<AsyncSelect
							type={'categories'}
							value={selectCategory}
							onchange={handleSelectCategory}
							{...dataTransaction.category}
						/>
						{errors.category && (
							<div className="error-transactions">
								{messages.category}
							</div>
						)}
					</div>
					<div className="description-transactions">
						<InputNormal
							value={description}
							onchange={handleSetDescription}
							{...dataTransaction.name}
						/>
						{errors.description && (
							<div className="error-transactions">
								{messages.name}
							</div>
						)}
					</div>
					<div className="save-transaction">
						<button disabled={currentAccount ? false : true}>
							Zapisz
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default FormTransactions;
