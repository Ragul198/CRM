const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text:      String,
  author:    String
},{timestamps: true});

const leadSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true },
  phone:        { type: String, required: true },
  source:       { type: String, enum: ['IndiaMart', 'Facebook', 'JustDial', 'LinkedIn', 'Website', 'Instagram', 'Email', 'Referral', 'Other'], default: 'Other' },
  status:       { type: String, enum: ['Work In Progress','Opportunity','Enquiry','Quotation','Quotation Sent','Follow-up','Converted','Failed','deleted'], default: 'Work In Progress' },
  assignedTo:   { type: String },
  createdBy:    { type: String },
  priority:     { type: String, enum: ['Low','Medium','High'], default: 'Medium' },
  company:      { type: String, required: true },
  firstName:    { type: String, required: true },
  lastName:     { type: String, required: true },
  city:         { type: String, required: true },
  state:        { type: String, required: true },
  country:      { type: String, required: true },
  address:      { type: String, required: true },
  description:  { type: String, default: '' },
  engineer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  coordinator_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  // openActivities:{ type: String },
  // closedActivities:{ type: String },
  // quoteAmount:  { type: Number, default: null },
  failedReason: { type: String, default: null },
  failedMessage:{ type: String, default: null },
  failedDate:   { type: Date,   default: null },
  notes:        [ noteSchema ],
  

  // send message from engineer to user
  quoteMessage: { type: String, default: '' } ,

  // send quotation details - paper 1
  selectedCompany:    { type: String, default: 'SMIE', enum: ['SMIE', 'FLOQ'] },
  quotationId:        { type: String, default: '' },
  quoteDate:          { type: Date, default: null },
  quoteSenderName:    { type: String, default: '' },
  quoteSenderNumber:  { type: String, default: '' },
  quoteSenderEmail:   { type: String, default: '' },
  quotePumpName:      { type: String, default: '' },
  quoteAddress:       { type: String, default: 'No 7/287, Saud building, Kozhikode- Palakkad National Highway, Kumaramputhur, Palakkad, Kerala - 678583.', enum: ["No 7/287, Saud building, Kozhikode- Palakkad National Highway, Kumaramputhur, Palakkad, Kerala - 678583.","No.519/2, Srinivasapillai Nagar, Ayanambakkam, Tamil Nadu, Chennai – 600095."] },
  quoteBranchName:    { type: String, default: 'Kerala', emum: ["Kerala","Tamil Nadu"] },
  partnerLogo:        { type: String, default: '' },
  partnerName:        { type: String, default: '' },

  //paper -2 - section 1
  tag:         { type: Number, default: null },
  qty:         { type: Number, default: null },
  application: { type: String, default: '' },
  liquid:      { type: String, default: '' },
  flowm:       { type: String, default: '' },
  headm:       { type: String, default: '' },
  density:     { type: Number, default: null },
  suctionPR:   { type: String, default: '' },
  duty:        { type: String, default: '' },
  // Quantity:    { type: Number, default: null },

  //paper 2 - section 2 pump offered
  make:                   { type: String, default: '' },
  pumpModel:              { type: String, default: '' },
  pumpSize:               { type: String, default: '' },
  capacity:               { type: String, default: '' },
  dischargePressure:      { type: String, default: '' },
  reliefValue:            { type: String, default: '' },
  reliefValueSetPressure: { type: String, default: '' },
  shaftSeal:              { type: String, default: '' },
  Bearing:                { type: String, default: '' },
  operatingTem:           { type: String, default: '' },
  designTem:              { type: String, default: '' },
  hydrotestTem:           { type: String, default: '' },
  mounting:               { type: String, default: '' },

  //paper 2 - section 3 drive data
  drive:            { type: String, default: '' },
  BKWDutyPoint:     { type: String, default: '' },
  BKWRVSetPressure: { type: String, default: '' },
  motor:            { type: String, default: '' },

  //paper 2 - section 4 MATERIALS OF CONSTRUCTION
  pumpBody: { type: String, default: '' },
  rotor:    { type: String, default: '' },
  shaft:    { type: String, default: '' },

  //paper 2 - section 5 PRICE
  price: { type: Number, default: null },

  //paper 3 - TERMS AND CONDITIONS
  incoterms:    { type: String, default: '' },
  pakFor:       { type: String, default: '' },
  IECCode:      { type: String, default: '' },
  deliveryTime: { type: Number, default: '' },

  // sent email confirmation
  sentEmail: { type: Boolean, default: 'false' }

},{timestamps: true});

module.exports = mongoose.model('Lead', leadSchema);
