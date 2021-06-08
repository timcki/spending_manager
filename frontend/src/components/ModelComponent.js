import React from 'react';
import Modal from 'react-modal';
import '../styles/Modal.css'

const customStyles = {
    content : {
      top:'50%',
      left:'50%',
      right:'auto',
      bottom:'auto',
      marginRight:'-50%',
      transform:'translate(-50%, -50%)',
      width:'40%'
    }
};
  
Modal.setAppElement('#root')
    
const ModalComponent =({handleFunc,modalIsOpen,modalContent} )=>{
    var subtitle;

    function closeModal(){
        handleFunc(false);
    }

    return(
        <div>
            <Modal
            isOpen={modalIsOpen}
            style={customStyles}
            contentLabel="Example Modal"
            >
            <div className="modal-container">
                <h2 ref={_subtitle => (subtitle = _subtitle)} className={modalContent.type?"posit":"negat"} >{modalContent.header}</h2>
                <div className="modal-content">{modalContent.content}</div>
                <div className="modal-container-button">
                    <button className="modal-button" onClick={closeModal}>Zamknij</button>
                </div>
            </div>
            </Modal>
        </div>
    )
}

export default ModalComponent;