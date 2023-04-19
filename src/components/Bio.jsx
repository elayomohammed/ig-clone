import { useState } from 'react';
import db from './db';
import userImage from '../assets/userImage.png';

const Bio = () =>{
    const editBioForm = (
        <form className="edit-bio-form" onSubmit={($event => updateBioFormInput($event))}>
            <input type="text" id="userName" name="userName" placeholder="enter your name" />
            <input type="text" id="userBio" name="userBio" placeholder="enter your bio information" />
            <br />
            <button type="button" className="cancel-button" onClick={() => setUpdateBioFormView(false)}>Cancel</button><button type="submit">Save</button>
        </form>
    )
    const [bioFormInput, setBioFormInput] = useState({
        name: 'AME',
        bio: 'JS Dev'
    });
    const getBioState = async() =>{
        const state = await db.about.get('biodata');
        setBioFormInput({name: state.name, bio: state.bio});
    }
    getBioState();

    //initialize profile photo input state
    let [profilePhoto, setProfilePhoto] = useState(userImage);
    const updateProfilePhotoState = async () =>{
        return await db.profilePhoto.get('profile-photo').catch((error)=>{
            console.error(`error reading profile-photo-blob from the db: ${error}`);
        }).then((blobfile)=>{
            const reader = new FileReader();
            reader.readAsDataURL(blobfile);
            reader.onloadend = (loadedData) =>{
                setProfilePhoto(loadedData.target.result);
            }
        })
    }
    updateProfilePhotoState();

    const updateBioFormInput = async ($event) =>{
        $event.preventDefault();
        await db.transaction('rw', 'about', async ()=>{
            await db.about.put({
                name: $event.target.userName.value,
                bio: $event.target.userBio.value
            }, 'biodata').catch((error) =>{
                console.log(`error updating bio: ${error}`)
            }).then((id)=>{
                console.log(`database updated with the ID: ${id}`)
                return id;
            });
        }).catch((error)=>{
            console.error(`transaction error ${error}`);
        })
    setUpdateBioFormView(false);
}

//update profile photo input state
const updateProfilePhoto = async () =>{
    const getProfilePhotoInput = document.getElementById('profilePhotoInput').files[0];
    await db.profilePhoto.put(getProfilePhotoInput, 'profile-photo').catch((error)=>{
        console.error(`error uploading profile photo: ${error}`);
    }).then((id)=>{
        console.log(`profile photo uploaded with the ID: ${id}`);
    });
}

const [updateBioFormView, setUpdateBioFormView] = useState(false);

    return(
        <section className="bio">
            <input type="file" accept="image/*" name="photo" id="profilePhotoInput" onChange={updateProfilePhoto} />
            <label htmlFor="profilePhotoInput">
                <div className="profile-photo" role="button" title="click to edit your profile photo">
                    <img src={profilePhoto} alt="profile" />
                </div>
            </label>
            <div className="profile-info">
                <p className="name">{bioFormInput.name}</p>
                <p className="about">{bioFormInput.bio}</p>
                {updateBioFormView ? editBioForm : <button type="button" onClick={()=>setUpdateBioFormView(true)}>Edit Bio</button>}
            </div>
        </section>
    )
}

export default Bio;