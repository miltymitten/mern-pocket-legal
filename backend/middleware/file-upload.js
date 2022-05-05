const multer = require('multer');
const uuid = require('uuid/v1');
//identifies that type of files can be uploaded when users create a profile
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};
//multer allows the image to be bitmapped, stored, and given a name, and exported as a fileUpload to be called upon
const fileUpload = multer({
  limits: 500000, //size of image
  storage: multer.diskStorage({ //image is stored
    destination: (req, file, cb) => {
      cb(null, 'uploads/images');// if image is empty
    },
    filename: (req, file, cb) => { //given a name based on the file's title
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuid() + '.' + ext);
    }
  }),
  fileFilter: (req, file, cb) => { //checks to see if the image is valid
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type!');
    cb(error, isValid);
  }
});
// image file is sent to file uploaded
module.exports = fileUpload;
