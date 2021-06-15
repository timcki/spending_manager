import React from 'react';
import PlainSelect from 'react-select';

const transaction_types = [
	{ value: 1, label: 'wydatek' },
	{ value: 2, label: 'przychód' },
];

const period_types = [
	{ value: 1, label: 'dzień' },
	{ value: 2, label: 'tydzień' },
	{ value: 3, label: 'miesiąc' },
];

const Select = props => {
	const { type, value, onchange, name, label, placeholder } = props;
	let options = null;
	if (type === 'transaction') {
		options = transaction_types;
	} else if (type === 'period') {
		options = period_types;
	}

	return (
		<>
			<label htmlFor={name}>{label}</label>
			<PlainSelect
				name={name}
				placeholder={placeholder}
				options={options}
				value={value}
				onChange={onchange}
			/>
		</>
	);
};

export default Select;
