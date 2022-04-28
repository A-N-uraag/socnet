import { useState, useEffect } from "react";
import './login.scss';
import logo from "../../assets/logo.jpg";
import facebook from "../../assets/facebook.svg";
import google from "../../assets/google.svg";
import apple from "../../assets/apple.svg";
import {auth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { ClimbingBoxLoader } from "react-spinners";

function Login() {
    let navigate = useNavigate();
    const [login, setLogin] = useState(true);
    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [signInErrorMessage, setSignInErrorMessage] = useState('');
    const [signUpErrorMessage, setSignUpErrorMessage] = useState('');
    const [showSpinner, setShowSpinner] = useState(false);
    const [user, loading, error] = useAuthState(auth);


    useEffect(() => {
        if (loading) return;
        if (user) navigate("/home");
        if (error) console.log(error);
    }, [user, loading, navigate, error]);

    const createAccount = (email: string, password: string) => {
        console.log(email, password);
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigate('/create-profile', {state:{userEmail:email}});
            })
            .catch((error) => {
                setShowSpinner(false);
                setSignUpErrorMessage(error.code.slice(error.code.indexOf('/') + 1));
            });
    };

    const signIn = (email: string, password: string) => {
        console.log({email}, {password});
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigate('/home');

            })
            .catch((error) => {
                setShowSpinner(false);
                setSignInErrorMessage(error.code.slice(error.code.indexOf('/') + 1));
            });
    };

    return (
        <div className="login">
            <div className={`login__colored-container ${login ? 'login__colored-container--left' : 'login__colored-container--right'}`}></div>
            <div className={`login__welcome-back ${login ? 'login__welcome-back--active' : 'login__welcome-back--inactive'}`}>
                <div className="login__welcome-back__logo-container">
                    <img className="login__welcome-back__logo-container--image" src={logo} alt="Oasis" />
                </div>
                <div className="login__welcome-back__main-container">
                    <div className="login__welcome-back__main-container__text-container">
                        <span className="login__welcome-back__main-container__text-container--title">
                            Welcome Back!
                        </span>
                        <span className="login__welcome-back__main-container__text-container--secondary">
                            To connect with people you love, please log in.
                        </span>
                    </div>
                    <div onClick={() => setLogin(!login)} className="login__welcome-back__main-container__button-container">
                        Sign In
                    </div>
                </div>
            </div>
            <div className={`login__create-container ${login ? 'login__create-container--active' : 'login__create-container--inactive'}`}>
                Create Account
                <div className="login__create-container__social-container">
                    <img className="login__create-container__social-container--facebook-icon" src={facebook} alt="" />
                    <img className="login__create-container__social-container--google-icon" src={google} alt="" />
                    <img className="login__create-container__social-container--apple-icon" src={apple} alt="" />
                </div>
                <span className="login__create-container--info-text">or use email for your registration</span>
                <div className="login__create-container__form-container">
                    <form className="login__create-container__form-container__form" onSubmit={(e) => {
                        e.preventDefault();
                        setShowSpinner(true);
                        setSignUpErrorMessage('');
                        createAccount(signUpEmail, signUpPassword);
                    }}>
                        <input
                            className="login__create-container__form-container__form--email"
                            type="email"
                            placeholder="Email"
                            value={signUpEmail}
                            onChange={(value) => setSignUpEmail(value.target.value)}
                            required />
                        <input
                            className="login__create-container__form-container__form--password"
                            type="password"
                            placeholder="Password"
                            value={signUpPassword}
                            onChange={(value) => setSignUpPassword(value.target.value)}
                            required />
                        <span className={`${signUpErrorMessage!=='' ? 'login__create-container__form-container__form--error--active' : 'login__create-container__form-container__form--error--inactive'}`}>{signUpErrorMessage}</span>
                        <button
                            className="login__create-container__form-container__form--submit">
                            Sign Up
                        </button>
                        <ClimbingBoxLoader color="#332FD0" loading={showSpinner}/>
                    </form>
                </div>
            </div>
            <div className={`login__login-container ${!login ? 'login__login-container--active' : 'login__login-container--inactive'}`}>
                <div className="login__login-container__logo-container">
                    <img className="login__login-container__logo-container--image" src={logo} alt="Oasis" />
                </div>
                <div className="login__login-container__main-container">
                    <div className="login__login-container__main-container__social-container">
                        <img className="login__login-container__main-container__social-container--facebook-icon" src={facebook} alt="" />
                        <img className="login__login-container__main-container__social-container--google-icon" src={google} alt="" />
                        <img className="login__login-container__main-container__social-container--apple-icon" src={apple} alt="" />
                    </div>
                    <span className="login__login-container__main-container--info-text">or use email for your login</span>
                    <div className="login__login-container__main-container__form-container">
                        <form className="login__login-container__main-container__form-container__form" onSubmit={(e) => {
                            e.preventDefault();
                            setShowSpinner(true);
                            setSignInErrorMessage('');
                            signIn(signInEmail, signInPassword);
                        }}>
                            <input
                                className="login__login-container__main-container__form-container__form--email"
                                type="email"
                                placeholder="Email"
                                value={signInEmail}
                                onChange={(value) => setSignInEmail(value.target.value)}
                                required />
                            <input
                                className="login__login-container__main-container__form-container__form--password"
                                type="password"
                                placeholder="Password"
                                value={signInPassword}
                                onChange={(value) => setSignInPassword(value.target.value)}
                                required />
                            <span className={`${signInErrorMessage!=='' ? 'login__login-container__main-container__form-container__form--error--active' : 'login__login-container__main-container__form-container__form--error--inactive'}`}>{signInErrorMessage}</span>
                            <button
                                className="login__login-container__main-container__form-container__form--submit">
                                Sign In
                            </button>
                            <ClimbingBoxLoader color="#332FD0" loading={showSpinner}/>
                        </form>
                    </div>
                </div>
            </div>
            <div className={`login__hello-container ${!login ? 'login__hello-container--active' : 'login__hello-container--inactive'}`}>
                <div className="login__welcome-back__main-container__text-container">
                    <span className="login__welcome-back__main-container__text-container--title">
                        Hello Stranger!
                        </span>
                    <span className="login__welcome-back__main-container__text-container--secondary">
                        New to the <b>OASIS</b>? <br/> Join the network that's connecting the world!
                    </span>
                </div>
                <div onClick={() => setLogin(!login)} className="login__welcome-back__main-container__button-container">
                    Sign Up
                </div>
            </div>
        </div>
    );
}

export default Login;