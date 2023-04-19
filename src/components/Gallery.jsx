import db from './db';
import { useLiveQuery } from 'dexie-react-hooks';

const Gallery = () =>{
    //uploading images to db
    const handlePhotoInput = async() =>{
        const photoInput = document.getElementById('addPhotoInput').files;
        console.log(photoInput.length);
        for (let i = 0; i < photoInput.length; i++){
            await db.gallery.add(photoInput[i]).catch((error)=>{
                console.error(`error adding image to gallery: ${error}`);
            }).then((id)=>{
                console.log(`photo have been added with the ID: ${id}`);
            });
        }
    }
    //reading images from db
    const galleryBlobs = useLiveQuery(async ()=>{
        return await db.gallery.each((blob)=>{
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = (event) =>{
                const output = document.getElementsByClassName('gallery')[0];
                const div = document.createElement('div');
                div.className = 'item';
                const img = document.createElement('img');
                img.className = 'item-image';
                img.alt = '';
                img.src = event.target.result;
                const button = document.createElement('input');
                button.type ='button';
                button.className = 'delete-button';
                button.value = 'Delete';
                div.appendChild(img);
                div.appendChild(button);
                output.appendChild(div);
            }
        })
    })
    return(
        <>
    <input type="file" name="photo" id="addPhotoInput" accept="image/*" multiple onChange={handlePhotoInput} />
    <label htmlFor="addPhotoInput">
        <i className="add-photo-button fas fa-plus-square" />
    </label>
    <section className="gallery">
    </section>
    </>
    )
}

export default Gallery;