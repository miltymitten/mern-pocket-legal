import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';

const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const placeId = useParams().placeId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      firstName: {
        value: '',
        isValid: false
      },
      lastName: {
        value: '',
        isValid: false
      },
      contact: {
        value: '',
        isValid: false
      },
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      typeofLaw: {
        value: '',
        isValid: false
      },
      courtName: {
        value: '',
        isValid: false
      }
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`
        );
        setLoadedPlace(responseData.place);
        setFormData(
          {
            firstName: {
              value: responseData.place.firstName,
              isValid: true
            },
            lastName: {
              value: responseData.place.lastName,
              isValid: true
            },
            contact: {
              value: responseData.place.contact,
              isValid: true
            },
            title: {
              value: responseData.place.title,
              isValid: true
            },
            description: {
              value: responseData.place.description,
              isValid: true
            },
            typeofLaw: {
              value: responseData.place.typeofLaw,
              isValid: true
            },
            courtName: {
              value: responseData.place.courtName,
              isValid: true
            }
          },
          true
        );

      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  const placeUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${placeId}`,
        'PATCH',
        JSON.stringify({
          firstName: formState.inputs.firstName.value,
          lastName: formState.inputs.lastName.value,
          contact: formState.inputs.contact.value,
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          typeofLaw: formState.inputs.typeofLaw.value,
          courtName: formState.inputs.courtName.value
        }),
        {
          'Content-Type': 'application/json'
        }
      );
      history.push('/' + auth.userId + '/places');
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="firstName"
            element="input"
            type="text"
            label="First Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid First Name."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id="lastName"
            element="input"
            type="text"
            label="Last Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid Last Name."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id="contact"
            element="input"
            type="text"
            label="Email"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid Email Address."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
          />
          <Input
            id="typeofLaw"
            element="input"
            type="text"
            label="Law Category"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid Law Category."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id="courtName"
            element="input"
            type="text"
            label="courtName"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid Court."
            onInput={inputHandler}
            initialValue={loadedPlace.courtName}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
