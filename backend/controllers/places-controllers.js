const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a place.',
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      'Could not find place for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // let places;
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate('places');
  } catch (err) {
    const error = new HttpError(
      'Fetching questions failed, please try again later.',
      500
    );
    return next(error);
  }

  // if (!places || places.length === 0) {
  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError('Could not find questions for the provided user id.', 404)
    );
  }

  res.json({ places: userWithPlaces.places.map(place => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
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

  const createdPlace = new Place({
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
    await createdPlace.save({ session: sess }); 
    user.places.push(createdPlace); 
    await user.save({ session: sess }); 
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating question failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { firstName, lastName, contact, title,description,typeofLaw, courtName} = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update question.',
      500
    );
    return next(error);
  }
  place.firstName = firstName;
  place.lastName = lastName;
  place.contact = contact;
  place.title = title;
  place.description = description;
  place.typeofLaw = typeofLaw;
  place.courtName = courtName;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update question.',
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete question.',
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError('Could not find question for this id.', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({session: sess});
    place.creator.places.pull(place);
    await place.creator.save({session: sess});
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

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
