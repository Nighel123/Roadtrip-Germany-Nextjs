export let sum = function (...args: number[]): number {
  let sum = 0;
  for (var i = 0; i < args.length; i++) {
    sum += args[i];
  }
  return sum;
};

let avarage = function (...args: number[]): number {
  let n = arguments.length,
    s = sum.apply(null, args);
  return s / n;
};

let max = function (...args: number[]): number {
  var max = Number.NEGATIVE_INFINITY;
  // Loop through the arguments, looking for, and remembering, the biggest.
  for (var i = 0; i < args.length; i++) if (args[i] > max) max = args[i]; // Return the biggest
  return max;
};

let min = function (...args: number[]): number {
  var min = Number.POSITIVE_INFINITY;
  // Loop through the arguments, looking for, and remembering, the smallest.
  for (var i = 0; i < args.length; i++) if (args[i] < min) min = args[i]; // Return the smallest
  return min;
};

export const linearRegression = function (args: google.maps.Point[]): {
  slope: number;
  yIntercept: number;
} {
  var n = args.length,
    arg = args,
    xArray = (function () {
      let array: number[] = [];
      for (var i = 0; i < n; i++) {
        array.push(arg[i].x);
      }
      return array;
    })(),
    yArray = (function () {
      let array: number[] = [];
      for (var i = 0; i < n; i++) {
        array.push(arg[i].y);
      }
      return array;
    })(),
    xAvarage = avarage.apply(null, xArray),
    yAvarage = avarage.apply(null, yArray);

  var numerator = function () {
      let array: number[] = [];
      for (var i = 0; i < n; i++) {
        array.push((xArray[i] - xAvarage) * (yArray[i] - yAvarage));
      }
      return sum.apply(null, array);
    }.apply(null, []),
    denominator = function () {
      var array = new Array();
      for (var i = 0; i < n; i++) {
        array.push(Math.pow(xArray[i] - xAvarage, 2));
      }
      return sum.apply(null, array);
    }.apply(null, []);

  var slope = numerator / denominator,
    yIntercept = yAvarage - slope * xAvarage;

  return { slope, yIntercept };
};
