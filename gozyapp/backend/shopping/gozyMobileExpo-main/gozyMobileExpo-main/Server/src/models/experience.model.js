const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    category: String,
    title: String,
    subtitle: String,
    location: String,
    description: String,
    posterUrl: String,
    videoUrl: String,
    tags: [String],
    priceLabel: String,
    rating: Number,
    distanceKm: Number,
    vibe: String,
    duration: String,
    brandCue: String,
    cta: String,
  },
  { timestamps: true },
);

module.exports = {
  ExperienceModel: mongoose.models.Experience || mongoose.model('Experience', experienceSchema),
};
