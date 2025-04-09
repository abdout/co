export interface ModalState {
    open: boolean;
    id: string | null;
    data?: any;
  }
  
  export interface ModalContextProps {
    modal: ModalState;
    openModal: (id: string | null, data?: any) => void;
    closeModal: () => void;
    handleCloseModal: () => void;
  }