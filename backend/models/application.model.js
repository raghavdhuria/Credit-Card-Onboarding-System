
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  dob: { type: String, required: true },
  pan: { type: String, required: true },
  aadhaar: { type: String, required: true },
  documentPath: { type: String, required: true },
  cardName: { type: String, required: true },
  ocrText: { type: String },
  verificationResults: {
    nameMatch: { type: Boolean, default: false },
    panMatch: { type: Boolean, default: false },
    dobMatch: { type: Boolean, default: false },
    aadhaarMatch: { type: Boolean, default: false }
  }
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
