import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import QuestionList from '../components/QuestionList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const UserQuestions = () => {
  const [loadedQuestions, setLoadedQuestions] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

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

  const questionDeletedHandler = deletedQuestionId => {
    setLoadedQuestions(prevQuestions =>
      prevQuestions.filter(question => question.id !== deletedQuestionId)
    );
  };

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
