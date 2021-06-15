import React, { useContext } from 'react';
import avatar_img from '../images/logo.png';
import '../styles/Avatar.css';
import { AppContext } from '../store/AppContext';
import { PersonCircle } from 'react-bootstrap-icons';

const Avatar = () => {
	const { user } = useContext(AppContext);

	return (
		<section className="avatar">
			<div>
				<img src={avatar_img} alt="logo użytkownika" />
			</div>
			{user ? (
				<div className="user-name-container">
					{<PersonCircle className={'user-name-icon'} />}
					<p className="user-name">{user}</p>
				</div>
			) : null}
		</section>
	);
};

export default Avatar;
