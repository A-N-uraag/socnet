import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./createProfile.scss";
import { ParticlesContainer } from './particlesBG';

function CreateProfile() {
    const {state} = useLocation();
    const navigate = useNavigate();
    const userEmail = state.userEmail;
    const [userName, setUserName] = useState("");
    const [dob, setDob] = useState("");
    const [bio, setBio] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
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
                    .then(response => {
                        console.log(response);
                        if (response.status === 200) {
                            navigate('/home');
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
                    <span style={{marginTop:"5px",marginRight:"40%",color: "#332FD0"}}><b>Profile Picture:</b></span>
                    {selectedImage && (
                        <div>
                        <img alt="not fount" width={"250px"} src={URL.createObjectURL(selectedImage)} />
                        <br />
                        <button onClick={()=>setSelectedImage(null)}>Remove</button>
                        </div>
                    )}
                    <input
                        type="file"
                        name="myImage"
                        style={{display: "inline"}}
                        onChange={(event) => {
                            if(event.target.files && event.target.files.length > 0) {
                                console.log(event.target.files[0]);
                                setSelectedImage(event.target.files[0]);
                            }
                        }}
                    />
                    
                    <button
                        className="create-account">
                        Create Account
                    </button>
                </form>
            </div>
            <script>
                VANTA.WAVES('#background')
            </script>
        </div>
    );
}

export default CreateProfile;