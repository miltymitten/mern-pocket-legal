const express = require('express');
const { check } = require('express-validator');

const questionsControllers = require('../controllers/questions-controllers');

const router = express.Router();

router.get('/:pid', questionsControllers.getQuestionById);

router.get('/user/:uid', questionsControllers.getQuestionsByUserId);
//route checks to see that question form input fields are not empty
router.post(
  '/',
  [
    check('firstName')
      .not()
      .isEmpty(),
    check('lastName')
      .not()
      .isEmpty(),
    check('contact')
      .not()
      .isEmpty(),    
    check('title')
      .not()
      .isEmpty(),
    check('typeofLaw')
      .not()
      .isEmpty(),  
    check('courtName')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address')
      .not()
      .isEmpty()
  ],
  questionsControllers.createQuestion
);
// if users makes an update of the form, form is checked to see input fields are not empty
router.patch(
  '/:pid',
  [
    check('firstName')
      .not()
      .isEmpty(),
    check('lastName')
      .not()
      .isEmpty(),
    check('contact')
      .not()
      .isEmpty(),
    check('title')
      .not()
      .isEmpty(),
    check('typeofLaw')
      .not()
      .isEmpty(),
    check('courtName')
      .not()
      .isEmpty(),  
    check('description').isLength({ min: 5 })
  ],
  questionsControllers.updateQuestion
);

router.delete('/:pid', questionsControllers.deleteQuestion);

module.exports = router;
