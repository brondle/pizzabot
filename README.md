# PizzaBot
## Setup
You'll need to have node installed on your computer. To do so, you can download it directly at (https://nodejs.org/en/download/) or use your package manager of choice. Once that's done, navigate to pizzabot in terminal and run `npm install` to get the necessary packages (if you're having trouble, you may also need to run `npm install --save babel-cli babel-preset-node6` to get the proper presets). You can then run `npm run pizzabot` to have PizzaBot operate on your inputs of choice - it'll prompt you to enter a grid, in 'NxN' format, then enter coordinates, in (N, N), (N, N) format, after which it'll tell you the naive route and the most efficient route.
You can also run `npm run test` to see if anything's already broken. A number of test cases are covered and logged within test.js, but you can add your own to try and break it by adding `console.log(pizzaBot(NxN, [[x, x], [y, y]]))` or `assert(pizzaBot(NxN, [[x, x], [y, y]]) === 'Whatever You Think It Should Be')` to the test section. 

## About
Given a grid size and a set of coordinates, PizzaBot will calculate the naive route (to each coordinate in order) and the most efficient route (using a breadth-first search algorithm) to drop off each pizza. It's written in JavaScript, using node to run in the terminal, babel to allow for ES6, and the prompt package by npm to allow for the user to input parameters.

## To-Do
I'd like to get a React front-end going for this, but didn't have much time to do so. It could also definitely use some refactoring and streamlining, particularly with both of the path determining algorithms - I was dead set on implementing a breadth-first search and would like to evaluate other options or try to refactor and optimize that. I'd also like to include a thorough build script - I started to wrangle a webpack one but once again, didn't have time.