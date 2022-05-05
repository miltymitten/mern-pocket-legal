import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import QuestionList from '../components/QuestionList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

// Component that renders all questions for a specific user ID
const UserQuestions = () => {
  const [loadedQuestions, setLoadedQuestions] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  // sends a GET request for all questions for a specific user ID and stores using useState hook
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/questions/user/${userId}`
        );
        setLoadedQuestions(responseData.questions);
      } catch (err) {}
    };
    fetchQuestions();
  }, [sendRequest, userId]);

  // handles the UI response for the deletion of a question
  const questionDeletedHandler = deletedQuestionId => {
    setLoadedQuestions(prevQuestions =>
      prevQuestions.filter(question => question.id !== deletedQuestionId)
    );
  };

  // renders list of questions using <QuestionList>
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedQuestions && (
        <QuestionList items={loadedQuestions} onDeleteQuestion={questionDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UserQuestions;
