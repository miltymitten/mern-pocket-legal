const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Question = require('../models/question');
const User = require('../models/user');

const getQuestionById = async (req, res, next) => {
  const questionId = req.params.pid;

  let question;
  try {
    question = await Question.findById(questionId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a question.',
      500
    );
    return next(error);
  }

  if (!question) {
    const error = new HttpError(
      'Could not find question for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ question: question.toObject({ getters: true }) });
};

const getQuestionsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // let questions;
  let userWithQuestions;
  try {
    userWithQuestions = await User.findById(userId).populate('questions');
  } catch (err) {
    const error = new HttpError(
      'Fetching questions failed, please try again later.',
      500
    );
    return next(error);
  }

  // if (!questions || questions.length === 0) {
  if (!userWithQuestions || userWithQuestions.questions.length === 0) {
    return next(
      new HttpError('Could not find questions for the provided user id.', 404)
    );
  }

  res.json({ questions: userWithQuestions.questions.map(question => question.toObject({ getters: true })) });
};

const createQuestion = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { firstName,lastName,contact,title,description,typeofLaw,courtName,address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdQuestion = new Question({
    firstName,
    lastName,
    contact,
    title,
    description,
    typeofLaw,
    courtName,
    address,
    location: coordinates,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/8/8a/Wikinews_banner_sea-blue.png', // => File Upload module, will be replaced with real image url
    creator
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      'Creating question failed, please try again.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdQuestion.save({ session: sess }); 
    user.questions.push(createdQuestion); 
    await user.save({ session: sess }); 
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating question failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ question: createdQuestion });
};

const updateQuestion = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { firstName, lastName, contact, title,description,typeofLaw, courtName} = req.body;
  const questionId = req.params.pid;

  let question;
  try {
    question = await Question.findById(questionId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update question.',
      500
    );
    return next(error);
  }
  question.firstName = firstName;
  question.lastName = lastName;
  question.contact = contact;
  question.title = title;
  question.description = description;
  question.typeofLaw = typeofLaw;
  question.courtName = courtName;

  try {
    await question.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update question.',
      500
    );
    return next(error);
  }

  res.status(200).json({ question: question.toObject({ getters: true }) });
};

const deleteQuestion = async (req, res, next) => {
  const questionId = req.params.pid;

  let question;
  try {
    question = await Question.findById(questionId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete question.',
      500
    );
    return next(error);
  }

  if (!question) {
    const error = new HttpError('Could not find question for this id.', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await question.remove({session: sess});
    question.creator.questions.pull(question);
    await question.creator.save({session: sess});
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete question.',
      500
    );
    return next(error);
  }
  
  res.status(200).json({ message: 'Deleted question.' });
};

exports.getQuestionById = getQuestionById;
exports.getQuestionsByUserId = getQuestionsByUserId;
exports.createQuestion = createQuestion;
exports.updateQuestion = updateQuestion;
exports.deleteQuestion = deleteQuestion;
