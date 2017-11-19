//testing - simple assert function courtesy of John Resig
import { PizzaBot } from './pizzabot.js'
function assert(condition, message) {
  if (!condition) {
    message = message || "Assertion failed";
    if (typeof Error !== "undefined") {
      throw new Error(message);
    }
    throw message || "Assertion failed";
  }
}
export function test() {
  assert(PizzaBot('5x5x5', 'test', true) === false, "Doesn't pass type entry test!");
  assert(PizzaBot('5x5', [[0,1], [6, 6]], true) === false, "Allows for impossible points!");
  assert(PizzaBot('5x5', [0, 1], true) === false, "Allows for point input that is not 2-D array!")
  assert(PizzaBot('5x5', [[1, 3],[4, 4]], true).simple === 'ENNNDEEEND', "Simple calculations not working!");
  assert(PizzaBot('5x5',  [[0, 0], [1, 3], [4, 4], [4, 2], [4, 2], [0, 1], [3, 2], [2, 3], [4, 1]], true).efficient === "DNDNNEDEDESDEDDSDNNND", "Efficiency calculations not working!");
  return "Tests passed!"
}
console.log(test());
//TODO: randomly generate input to ensure that the efficient calculation is always shorter than or equal to the simple calculation
//  assert(output.simple.length >= output.efficient.length, 'Uh oh! Your efficiency calculations are off! Try the simpler route instead or debug your efficient route calculator.');
