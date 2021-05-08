import React from 'react';
import {useField} from 'formik';

const Input =({label, ...props})=>{

    const [field,meta]=useField(props);

    return(
        <div className="input-container">
            {label &&<label htmlFor={props.name}>{label}</label>}
            <input className={`form-control ${meta.touched && meta.error && "is-invalid"}`} {...field} {...props} autoComplete="off"/>
            {meta.touched && meta.error?(<div className="error">{meta.error}</div>):null}
        </div>
    )
}

export default Input;