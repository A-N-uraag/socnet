import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebase';
import "./createProfile.scss";
import { ParticlesContainer } from './particlesBG';

function CreateProfile() {
    const navigate = useNavigate();
    const userEmail = auth.currentUser.email;
    const [userName, setUserName] = useState("");
    const [dob, setDob] = useState("");
    const [bio, setBio] = useState("");
    const [website, setWebsite] = useState("");
    const [location, setLocation] = useState("");

    return(
        <div>
            <ParticlesContainer/>
            <div id="loginform">
                <div className="headerTitle">Hooray!</div>
                <div className='secondaryHeader'>You are just a step away from becoming part of OASIS!</div>
                <form className="login__create-container__form-container__form" onSubmit={(e) => {
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: userEmail, uname: userName, dob: dob, bio: bio, website: website, location: location })
                    };
                    console.log(requestOptions.body);
                    fetch('https://socnet-swe.herokuapp.com/createUser', requestOptions)
                    .then(response => Promise.all([response.status,response.json()]))
                    .then(([status,response]) => {
                        console.log(response);
                        if (status === 200) {
                            navigate('/home');
                        }
                        else{
                            console.log("Error");
                        }
                    });
                    e.preventDefault();
                }}>
                    <input
                        className="login__create-container__form-container__form--name"
                        placeholder="Username"
                        value={userName}
                        onChange={(value) => setUserName(value.target.value)}
                        required />
                    <input
                        className="login__create-container__form-container__form--dob"
                        type="date"
                        placeholder="01/01/2000"
                        value={dob}
                        onChange={(value) => setDob(value.target.value)}
                        required />
                    <input
                        className="login__create-container__form-container__form--website"
                        type="url"
                        placeholder="Website URL"
                        value={website}
                        onChange={(value) => setWebsite(value.target.value)} />
                    
                    <input
                        className="login__create-container__form-container__form--location"
                        placeholder="Place"
                        value={location}
                        onChange={(value) => setLocation(value.target.value)} />

                    <textarea
                        className="login__create-container__form-container__form--bio"
                        cols={25}
                        placeholder='Bio'
                        value={bio}
                        onChange={(value) => setBio(value.target.value)}>
                    </textarea>
                    <button
                        className="create-account">
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateProfile;