import React from 'react';
import DateView from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePicker = (props)=>{
    const {date,onchange,name,label} =props;
    return(
        <div>
            <label htmlFor={name}>{label}</label>
            <DateView
                name={name}
                selected={date}
                onChange={onchange}
                dateFormat='dd/MM/yyyy'
                isClearable
                showYearDropdown
                scrollableMonthYearDropdown
                autoComplete="off"
            />
        </div>
    )
}

export default DatePicker;