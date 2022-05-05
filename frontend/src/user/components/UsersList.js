import React from 'react';

import UserItem from './UserItem';
import Card from '../../shared/components/UIElements/Card';
import './UsersList.css';

// Component to render a list of all users who have created an account
const UsersList = props => {
  // If there are no users, render an appropriate message on the browser
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }
// render all users in the browser as cards using the UserItem component
  return (
    // render a card component that encapsulates all UserItem component cards
      <Card className="users-list-container">
        <h2 className="users-list-title">All Users</h2>
        <hr />
      <ul className="users-list">
        {props.items.map(user => (
          <UserItem
            key={user.id}
            id={user.id}
            image={user.image}
            name={user.name}
            questionCount={user.questions.length}
          />
        ))}
      </ul>
      </Card>
  );
};

export default UsersList;
