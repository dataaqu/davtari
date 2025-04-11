import { Button } from "../Button";

export function Modal({ friendToDelete, onCancelDelete, onConfirmDelete }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>
          ნამდვილად გინდა <span> {friendToDelete.name}</span> -ს წაშლა ?
        </p>
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onConfirmDelete}>
            დიახ
          </button>
          <Button onClick={onCancelDelete}>არა</Button>
        </div>
      </div>
    </div>
  );
}
