import React,{useState} from 'react';
import { XLg } from 'react-bootstrap-icons';
import Modal from 'react-modal';
import '../styles/infoModal.css'
const customStyles = {
    content : {
      top:'84%',
      left:'2%',
      right:'auto',
      bottom:'auto',
      color:'white',
      width:'300px',
      padding:'10px',
      backgroundColor:'#333'
    }
};
  
Modal.setAppElement('#root')
    
const InfoModal =({handleFunc,modalIsOpen,modalData} )=>{
  
    function closeModal(){
        handleFunc(false);
    }
    let idTimeout=null;
    function showInfo(){
        idTimeout=setTimeout(()=>{closeModal()},10000);
    }
    function closeInfo(){
        clearTimeout(idTimeout);
    }
    return(
        <div>
            <Modal
            isOpen={modalIsOpen}
            onAfterOpen={showInfo}
            onAfterClose={closeInfo}
            overlayClassName="Overlay"
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Information Modal"
            >
            <div className="modal-info-container">
                <XLg className="cross-icon" onClick={closeModal}/>
                <h3 className={modalData.classes}>{modalData.header}</h3>
                <div className="modal-info-content">{modalData.content}</div>
            </div>
            </Modal>
        </div>
    )
}

export default InfoModal;