import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => {
        if (ulRef.current) {
            setShowMenu(false);
        }
    }

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        closeMenu();
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <>
            <button onClick={openMenu} id='profile-button' style={{ backgroundColor: 'transparent' }}>
                <i className="fas fa-bars" style={{
                    fontSize: '14px',
                    paddingRight: '12px',
                    paddingLeft: '5px',
                }} />
                <i className="fas fa-user-circle" style={{
                    fontSize: '30px',
                }} />
            </button>
            <ul className={ulClassName} ref={ulRef} id='profile-dropdown'>
                {user ? (
                    <>
                        {/* <li id="username">{user.username}</li> */}
                        <li id="firstname">Hello, {user.firstName} {user.lastName}</li>
                        <li id="email">{user.email}</li>
                        {/* Make an edit so that this links to the users spots
                        <li>Manage Spots{user.manageSpots}</li> */}
                        <li id="manage-spots">Manage Spots</li>
                        <li id="li-logout">
                            <button onClick={logout}
                                id="logout-button"
                            >Log Out</button>
                        </li>
                    </>
                ) : (
                    <>
                        <div className="login-button">
                            <OpenModalMenuItem
                                itemText="Log In"
                                onItemClick={closeMenu}
                                modalComponent={<LoginFormModal />}
                            />
                        </div>
                        <div className="signup-button">
                            <OpenModalMenuItem
                                itemText="Sign Up"
                                onItemClick={closeMenu}
                                modalComponent={<SignupFormModal />}
                            />
                        </div>
                    </>
                )}
            </ul>
        </>
    );
}

export default ProfileButton;
