const { state } = require('../utils/store');

function getTravelController(_req, res) {
  res.json(state.travel);
}

function getRestaurantsController(_req, res) {
  res.json(state.restaurants);
}

function getProductsController(_req, res) {
  res.json(state.products);
}

function getEventsController(_req, res) {
  res.json(state.events);
}

module.exports = {
  getTravelController,
  getRestaurantsController,
  getProductsController,
  getEventsController,
};
