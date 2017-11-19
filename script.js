import { PizzaBot } from './lib/pizzabot.js'
var prompt = require('prompt');
prompt.start();
prompt.get(['dimensions', 'stops'], (err, result) => {
  var points = result.stops.replace(/ /g, '').split(')(');
  var grid = points.map((point) => {
    return point.replace(/[{()}]/g, '').split(',').map(p => {
      return parseInt(p);
    });
  });
  var pb = PizzaBot(result.dimensions, grid);
  if (!pb.simple || !pb.efficient) {
    console.log("While trying to calculate your route, PizzaBot encountered a fatal error and exploded. Try calling instead?");
    return;
  }
  console.log('PizzaBot has calculated its route! In order of addresses as they were entered the route is ' + pb.simple + ', but the most efficient route is ' + pb.efficient + '.');
})