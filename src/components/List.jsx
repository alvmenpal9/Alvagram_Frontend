import React from "react";

const List = () => {
    
    const clearDialog = (e) => {
        document.querySelector('#list-title').textContent = '';
        document.querySelector('#list-ul').innerHTML = '';

        document.querySelector('#list-dialog').close();
    }

    return(
        <dialog id="list-dialog">
            <button className="close-dialog" onClick={clearDialog}>X</button>
            <h1 id="list-title">HOLA</h1>
            <ul id="list-ul">

            </ul>
        </dialog>
    )
}

export default List;