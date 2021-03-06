import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './QuestionItem.css';

// renders an individual question on the page in a list of questions
const QuestionItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // handlers for google maps UI
  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  // handlers for question deletion UI
  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  // sends a DELETE request for a specific question using its question ID
  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/questions/${props.id}`,
        'DELETE'
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  // renders an individual question in a card with handlers for cancelling out of the modal
  // and rendering a modal for deleting a question
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="question-item__modal-content"
        footerClass="question-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        {/* renders the google maps UI */}
        <div className="map-container">
          {/*<Map center={props.coordinates} zoom={16} />*/}

          <iframe title="map" width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"
          src={'https://maps.google.com/maps?q=' + props.coordinates.lat.toString() + ',' + props.coordinates.lng.toString() + '&t=&z=15&ie=UTF8&iwloc=&output=embed'}></iframe><script type='text/javascript' src='https://embedmaps.com/google-maps-authorization/script.js?id=5a33be79e53caf0a07dfec499abf84b7b481f165'></script>
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="question-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this Question? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="question-item">
        {/* renders a card for an individual question */}
        <Card className="question-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="question-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="question-item__info">
            <h1>Great Question.</h1>
            <br></br>
            <h2>Contact:</h2>
            <h3>{props.firstName}</h3>
            <h3>{props.lastName}</h3>
            <h3>{props.contact}</h3>
            <br></br>
            <h2>Your Legal Question:</h2>
            <h3>{props.title}</h3>
            <h3>{props.description}</h3>
            <br></br>
            <h2>Provide Your Nearest Court House:</h2>
            <h3>{props.typeofLaw}</h3>
            <h3>{props.courtName}</h3>
            <h3>{props.address}</h3>
          </div>
          <div className="question-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW COURT HOUSE
            </Button>
            {auth.userId === props.creatorId && (
              <Button to={`/questions/${props.id}`}>EDIT</Button>
            )}

            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default QuestionItem;
