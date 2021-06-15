import React from 'react';


const InputNormal =(props)=>{
    const {label,onchange,name,...rest}=props;
    return(
        <>
        {label &&<label htmlFor={name}>{label}</label>}
        <input name={name} {...rest} onChange={onchange} autoComplete="off"/>
        </>
    )
}

export default InputNormal;