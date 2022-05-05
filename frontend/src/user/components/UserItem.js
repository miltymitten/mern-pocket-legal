import React from 'react';
import { Link } from 'react-router-dom';

import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';
import './UserItem.css';

// render an individual card for a specific user
const UserItem = props => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        {/* clicking on the user's card links to that user's questions using the user's ID */}
        <Link to={`/${props.id}/questions`}>
          <div className="user-item__image">
            {/* renders the image that the user uploaded during account creation */}
            <Avatar image={`http://localhost:5000/${props.image}`} alt={props.name} />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.questionCount} {props.questionCount === 1 ? 'Question' : 'Questions'}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

// export UserItem component for use in other components/files
export default UserItem;
