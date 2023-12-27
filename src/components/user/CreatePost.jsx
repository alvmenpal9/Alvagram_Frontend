import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Global_url_api } from "../../constants/global";
import axios from "../../api/axios";

const CreatePost = () => {

    const { auth } = useAuth();
    const [file, setFile] = useState();
    const [description, setDescription] = useState('');
    const [createdPost, setCreatedPost] = useState({});

    const uploadFile = async (e) => {
        const modal = document.querySelector('#floating-post_info');
        const formData = new FormData();
        formData.append('file0', file);

        try {
            const response = await axios.post('/post', formData, {
                headers: {
                    Authorization: auth.accessToken
                },
                timeout: 5000
            });

            if (response?.status === 200) {
                setCreatedPost({
                    postId: response?.data?.postId,
                    filename: response?.data?.filename
                })
                modal.showModal();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const createPost = async (e) => {
        try {
            const response = await axios.put(`/post/${createdPost.postId}`, {
                description: description
            }, {
                headers: {
                    Authorization: auth.accessToken
                },
                timeout: 5000
            })

            if (response?.status === 200) {
                const showSuccess = document.querySelector('.create-success')
                setCreatedPost({})
                document.querySelector('#file0').value = ''
                document.querySelector('#description').value = ''
                showSuccess.showModal();
            }

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <dialog id="floating-file">
                <h1>Create Post</h1>
                <form className="form_create" method="dialog" encType="multipart/form-data" onSubmit={uploadFile}>
                    <div className="form_create--inputfile">
                        <label htmlFor="file0">Upload an Image </label>
                        <input type="file" id="file0" onChange={e => setFile(e.target.files[0])} required />
                    </div>
                    <input type="submit" value="Continue" style={{ marginBottom: '5px', width: '200px', cursor: 'pointer' }} />
                </form>
                <button style={{ marginTop: '0', width: '200px' }} className="unfollow" onClick={e => {
                    const modalToClose = document.querySelector('#floating-file');
                    document.querySelector('#file0').value = ''
                    modalToClose.close();
                }}>Cancel</button>
            </dialog>


            <dialog id="floating-post_info">
                <h1>Create Post</h1>
                <div className="uploaded_image">
                    <img src={`${Global_url_api}post/image/${createdPost?.filename}`} alt="Preview Image" />
                </div>
                <form className="form_create" method="dialog" onSubmit={createPost}>
                    <div className="form_create--description">
                        <label htmlFor="description">Description </label>
                        <textarea id="description" name="description" placeholder="Add Description..." onChange={e => setDescription(e.target.value)}>
                        </textarea>
                    </div>
                    <input type="submit" value="Upload Post" style={{ marginBottom: '5px', width: '200px', cursor: 'pointer' }} />
                </form>
                <button style={{ marginTop: '0', width: '200px' }} className="unfollow" onClick={async e => {
                    const modalToClose = document.querySelector('#floating-post_info');
                    document.querySelector('#file0').value = ''
                    document.querySelector('#description').value = ''
                    const response = await axios.delete(`/post/${createdPost?.postId}`, { headers: { Authorization: auth.accessToken } })
                    if (response?.status === 200) {
                        setCreatedPost({});
                    }
                    modalToClose.close();
                }}>Cancel</button>
            </dialog>

            <dialog className="create-success">
                <p>Your post has been created successfully</p>
                <button style={{ width: '200px' }} onClick={e => {
                    const modal = document.querySelector('.create-success');
                    modal.close();
                }}>OK</button>
            </dialog>
        </>
    )

}

export default CreatePost;