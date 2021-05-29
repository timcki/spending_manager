import React from 'react';
import PlainSelect from 'react-select';

const options = [
    { value: 1, label: 'wydatek' },
    { value: 2, label: 'przychód' }
  ]

const Select =(props)=>{

    const {value,onchange,name,label,placeholder} = props;

    return(
        <>
        <label htmlFor={name}>{label}</label>
            <PlainSelect 
            name={name}
            placeholder={placeholder}
            options={options} 
            value={value}
            onChange={onchange}/>
        </>
        )
}

export default Select;