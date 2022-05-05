import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import QuestionItem from './QuestionItem';
import Button from '../../shared/components/FormElements/Button';
import './QuestionList.css';

// renders list of questions and handles case when there are no questions
const QuestionList = props => {
  // if there are no questions, render an appropriate page
  if (props.items.length === 0) {
    return (
      <div className="question-list center">
        <Card>
          <h2>No questions found. Maybe create one?</h2>
          <Button to="/questions/new">Share Question</Button>
        </Card>
      </div>
    );
  }

  // render a list of questions using QuestionItem
  return (
    <ul className="question-list">
      {props.items.map(question => (
        <QuestionItem
          key={question.id}
          id={question.id}
          image={question.image}
          firstName={question.firstName}
          lastName={question.lastName}
          contact={question.contact}
          title={question.title}
          description={question.description}
          typeofLaw={question.typeofLaw}
          courtName={question.courtName}
          address={question.address}
          creatorId={question.creator}
          coordinates={question.location}
          onDelete={props.onDeleteQuestion}
        />
      ))}
    </ul>
  );
};

export default QuestionList;
