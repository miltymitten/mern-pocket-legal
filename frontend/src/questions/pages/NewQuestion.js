import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './QuestionForm.css';

// includes handlers for adding a new question and rendering the page to add a new question
const NewQuestion = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
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
      courtName: {
        value: '',
        isValid: false
      },
      typeofLaw: {
        value: '',
        isValid: false
      },
      address: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const history = useHistory();

  const questionSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        'http://localhost:5000/api/questions',
        'POST',
        JSON.stringify({
          firstName: formState.inputs.firstName.value,
          lastName: formState.inputs.lastName.value,
          contact: formState.inputs.contact.value,
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          typeofLaw: formState.inputs.typeofLaw.value,
          courtName: formState.inputs.courtName.value,
          address: formState.inputs.address.value,
          creator: auth.userId
        }),
        { 'Content-Type': 'application/json' }
      );
      history.push('/');
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="question-form" onSubmit={questionSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="firstName"
          element="input"
          type="text"
          label="First Name"
          placeholder = "Enter your First Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid First Name."
          onInput={inputHandler}
        />
        <Input
          id="lastName"
          element="input"
          type="text"
          label="Last Name"
          placeholder = "Enter your Last Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid Last Name."
          onInput={inputHandler}
        />
        <Input
          id="contact"
          element="input"
          type="text"
          label="Email"
          placeholder = "Enter your Email Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid Email Adress."
          onInput={inputHandler}
        />
        <Input
          id="title"
          element="input"
          type="text"
          label="Legal Question"
          placeholder = "Enter your question"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Extended Description"
          placeholder = "Enter a detailed description of your question"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="typeofLaw"
          element="input"
          type="text"
          label="Law Category"
          placeholder = "Identify the area of Law Practice"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid law category."
          onInput={inputHandler}
        />
        <Input
          id="courtName"
          element="input"
          type="text"
          label="Court Name"
          placeholder = "Name of court nearest to you"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid Court Name."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Court House Address"
          placeholder = "Provide your Court's Full Street Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          Ask Question
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewQuestion;
