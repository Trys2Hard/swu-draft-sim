const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CardSchema = new Schema({
  Set: { type: String, required: true },
  Number: { type: String, required: true },
  Name: { type: String, required: true },
  Subtitle: { type: String },
  Type: { type: String, required: true },
  Aspects: [{ type: String }],
  Traits: [{ type: String }],
  Arenas: [{ type: String, required: true }],
  Cost: { type: Number, required: true },
  Power: { type: Number },
  HP: { type: Number },
  FrontText: { type: String },
  DoubleSided: { type: Boolean, required: true },
  Rarity: { type: String, required: true },
  Unique: { type: Boolean, required: true },
  Keywords: [{ type: String }],
  Artist: { type: String, required: true },
  VariantType: { type: String, required: true },
  MarketPrice: { type: String },
  FoilPrice: { type: String },
  FrontArt: { type: String, required: true },
  LowPrice: { type: String },
  Rank: { type: Number },
});

module.exports = mongoose.model('Card', CardSchema);
