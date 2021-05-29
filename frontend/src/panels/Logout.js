import { React, useContext } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import {AppContext} from "../store/AppContext";


const Logout = props => {

	const {logout} = useContext(AppContext);

	return (
		<>
			{logout()};
			<Redirect to="/" />
		</>
	);
};

export default withRouter(Logout);
