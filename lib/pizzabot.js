export function PizzaBot(gridString, points, isTest) {
  //get dimensions
  if (isTest) {
    console.log = function() {}
  }
  var gridArr = gridString.split('x').map(dim => {
    return parseInt(dim);
  });

  //make sure dimensions are in NxN format
  if (!gridArr || gridArr.length != 2) {
    console.log('Dimensions must be in NxN format');
    return false;
  }
  //make sure set of points is given as a properly formatted 2-D array
  // console.log(points[0]);
  if (!points || !points[0] || !typeof points[0][0] === 'number' || points.length <= 0 || points[0].length <= 0 || points[0][0].length <= 0) {
    console.log('Points must be given in (N,N),(N,N) format and must contain numbers for X and Y coordinates')
    return false;
  }

  var pointsAreNums = points.filter(point => {
    return point.filter(p => {
      return isNaN(p);
    }).length > 0;
  });
  if (pointsAreNums.length) {
    console.log('Coordinates must be numbers!')
    return false;
  }
  //make sure provided points exist within the grid provided
  var notPossible = points.filter(point => {
    return point[0] > gridArr[0] || point[1] > gridArr[1];
  });
  if (notPossible.length) {
    console.log('Coordinates ' + notPossible + ' are not possible!');
    return false;
  }
  var currentPoint = [0, 0];
  var returnString = '';
  //simple step iteration through the points to find a path to each one in the order they are given
  points.forEach(point => {
    if (checkEqual(currentPoint, point)) {
        returnString += 'D';
    }
    while (currentPoint[0] < point[0]) {
      currentPoint[0] += 1;
      returnString += 'E';
      if (checkEqual(currentPoint, point)) {``
        returnString += 'D';
      }
    }
    while (currentPoint[1] < point[1]) {
      currentPoint[1] += 1;
      returnString += 'N';
      if (checkEqual(currentPoint, point)) {
        returnString += 'D';
      }
    }
    while (currentPoint[0] > point[0]) {
      currentPoint[0] -= 1;
      returnString += 'W';
      if (checkEqual(currentPoint, point)) {
        returnString += 'D';
      }
    }
    while (currentPoint[1] > point[1]) {
      currentPoint[1] -= 1;
      returnString += 'S';
      if (checkEqual(currentPoint, point)) {
        returnString += 'D';
      }
    }
  });

  //prepare grid for breadth-first search
  var gridSize = gridArr;
  var grid = [];
  //variable to account for length comparison when points array has double deliveries
  //otherwise it would expect the output to have a length of 9 in a scenario where there are 8 unique locations
  //but one of them has two pizzas
  var doubles = 0;
  for (var i=(gridArr[0] -1); i>=0; i--) {
    grid[i] = [];
    for (var j=(gridArr[1] - 1); j>=0; j--) {
    grid[i][j] = 'Empty';
    points.forEach(point => {
      //if there's already a stop at this point and another is listed in the input, assume multiple pizzas to be delivered and change its value accordingly
      if (grid[i][j].includes('Stop') && point[0] === i && point[1] === j) {
        var increment = grid[i][j].split('x')[1]  ? parseInt(grid[i][j].split('x')[1]) + 1 : 2;
        grid[i][j] = 'Stopx' + increment;
        doubles++;
        return;
      } 
      if (point[0] === i && point[1] === j) {
        grid[i][j] = 'Stop';
      }
    })
    }
  }


    var output = { simple: returnString, efficient: findShortestPath([0, 0], grid, points.length - doubles) };
    return output;
}
//check if arrays are equal - in this case, used to compare 2 sets of points
function checkEqual(arr1, arr2) {
  if (arr1.length != arr2.length) {
    return false;
  }
  var eq = arr1.filter((i, n) => {
    return i != arr2[n];
  });
  if (eq.length > 0) {
    return false;
  }
  return true;
}
// Breadth-first search algorithm to determine most efficient path through given grid- thanks are due to http://gregtrowbridge.com/a-basic-pathfinding-algorithm/ for reminding me of the basic structure.
// Start location will be in the following format:
// [x, y]
var findShortestPath = function(startCoordinates, grid, count) {
  var xPosition = startCoordinates[0];
  var yPosition = startCoordinates[1];
  // Each "location" will store its coordinates
  // and the shortest path required to arrive there
  var location = {
    xPosition: xPosition,
    yPosition: yPosition,
    path: [],
    status: 'Start'
  };

  // Initialize the queue with the start location already inside
  var queue = [location];
  var output = [];
  // Loop through the grid searching for the Stop
  while (output.length < count && queue.length > 0) {

    // Take the first location off the queue
    var currentLocation = queue.shift();
    if (locationStatus(currentLocation, grid) === 'Stop') {
      output.push('D');
      grid[currentLocation.xPosition][currentLocation.yPosition] = 'Empty';
    }
    // Try going north
    //FIXME: this section isn't very DRY but it was a tradeoff between a single function with too many inputs,
    // multiple functions that only replace a single line of code and just leaving the code in as is. Would like to find a DRYer way of doing this
    var newLocation = explore(currentLocation, 'N', grid);
    if (newLocation.status.includes('Stop')) {
      if (newLocation.status.split('x')[1]) {
        for(var i = 1; i <= parseInt(newLocation.status.split('x')[1]); i++) {
          newLocation.path.push('D');
        }
      } else {
        //if delivery location, push D to location's path string
        newLocation.path.push('D')
      }
      //send location and path string to output store
      output.push(newLocation.path.join(''));
      //reset function variables for new iteration, remove "stop" from grid
      newLocation.path = [];
      queue = [newLocation]
      grid[newLocation.xPosition][newLocation.yPosition] = 'Empty'

    } else if (newLocation.status === 'Valid') {
      queue.push(newLocation);
    }

    // Try going east
    var newLocation = explore(currentLocation, 'E', grid);
    if (newLocation.status.includes('Stop')) {
      if (newLocation.status.split('x')[1]) {
        for(var i = 1; i <= parseInt(newLocation.status.split('x')[1]); i++) {
          newLocation.path.push('D');
        }
      } else {
        newLocation.path.push('D')
      }
      output.push(newLocation.path.join(''));
      newLocation.path = [];
      queue = [newLocation] 
      grid[newLocation.xPosition][newLocation.yPosition] = 'Empty'

    } else if (newLocation.status === 'Valid') {
      queue.push(newLocation);
    }

    // Try going south
    var newLocation = explore(currentLocation, 'S', grid);
    if (newLocation.status.includes('Stop')) {
      if (newLocation.status.split('x')[1]) {
        for(var i = 1; i <= parseInt(newLocation.status.split('x')[1]); i++) {
          newLocation.path.push('D');
        }
      } else {
        newLocation.path.push('D')
      }
      output.push(newLocation.path.join(''));
      newLocation.path = [];
      queue = [newLocation]
      grid[newLocation.xPosition][newLocation.yPosition] = 'Empty'
    } else if (newLocation.status === 'Valid') {
      queue.push(newLocation);
    }

    // Try going west
    var newLocation = explore(currentLocation, 'W', grid);
    if (newLocation.status.includes('Stop')) {
      if (newLocation.status.split('x')[1]) {
        for(var i = 1; i <= parseInt(newLocation.status.split('x')[1]); i++) {
          newLocation.path.push('D');
        }
      } else {
        newLocation.path.push('D')
      }
      output.push(newLocation.path.join(''));
      newLocation.path = [];
      queue = [newLocation]
      grid[newLocation.xPosition][newLocation.yPosition] = 'Empty'
    } else if (newLocation.status === 'Valid') {
      queue.push(newLocation);
    }
  }

  // Once output is at 
  return output.join('');

};

// This function will check a location's status
// (a location is "valid" if it is on the grid
// Returns "Valid", "Invalid", "Stop", or "StopxN" if there are multiple pizzas to be delivered at one stop
var locationStatus = function(location, grid) {
  var gridSize = grid.length;
  var dfl = location.xPosition;
  var dft = location.yPosition;
  if (location.xPosition < 0 ||
      location.xPosition >= gridSize ||
      location.yPosition < 0 ||
      location.yPosition >= gridSize) {

    // location is not on the grid--return false
    return 'Invalid';
  } else if (grid[dfl][dft] === 'Stop') {
    //deliver pizza here
    return 'Stop';
  } else if (grid[dfl][dft].includes('x')) {
    return grid[dfl][dft];
  } else{
    //otherwise, keep going
    return 'Valid';
  }
};


// Travels in given direction from current location
var explore = function(currentLocation, direction, grid) {
  var newPath = currentLocation.path.slice();
  newPath.push(direction);

  var yPos = currentLocation.yPosition;
  var xPos = currentLocation.xPosition;

  if (direction === 'N') {
    yPos += 1;
  } else if (direction === 'E') {
    xPos += 1;
  } else if (direction === 'S') {
    yPos -= 1;
  } else if (direction === 'W') {
    xPos -= 1;
  }

  var newLocation = {
    yPosition: yPos,
    xPosition: xPos,
    path: newPath,
    status: 'Unknown'
  };
  newLocation.status = locationStatus(newLocation, grid);
  return newLocation;
};
