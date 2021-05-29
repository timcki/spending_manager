import React from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';

const options = [
    { value: 'option1', label: 'option1' },
    { value: 'option2', label: 'option2' },
    { value: 'option3', label: 'option3' }
  ]

async function loadOptions(search, loadedOptions,{page}) {
  // const response = await fetch(`http://localhost:3006/results/?search=${search}&offset=${loadedOptions.length}`);
  const response = await fetch();
  const responseJSON = await response.json();
  const hasMore = responseJSON.length > loadedOptions.length;
  const slicedOptions = responseJSON.slice(
    loadedOptions.length,
    loadedOptions.length + 3
  );
  return {
    options: slicedOptions,
    hasMore: hasMore,
    additional: {
      page: page + 1,
    },
  };
}

const AsyncSelect =(props)=>{

    const {value,onchange,name,label,placeholder} = props;

    return(
        <>
        <label htmlFor={name}>{label}</label>           
            <AsyncPaginate 
            name={name}
            placeholder={placeholder}
            defaultOptions={options} 
            // options={options} 
            loadOptions={loadOptions}
            value={value}
            onChange={onchange}
            additional={{
              page: 1,
            }}
            />
        </>
        )
}

export default AsyncSelect;