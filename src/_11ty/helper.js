// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
  
exports.groupBy = function(objectArray, property) {
  return objectArray.reduce(function (acc, obj) {
    var key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}

/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
 
exports.shuffle = function(array) {

  var currentIndex = array.length;
  var temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

// https://github.com/11ty/eleventy/issues/426
// Copy paste from Boris Schapira

exports.addPrevNext = function (collectionArray) {
  const l = collectionArray.length;
  for (let p = 0; p < l; p++) {
    if (p > 1)
      collectionArray[p].data.previous = {
        title: collectionArray[p - 1].data.title,
        url: collectionArray[p - 1].url
      };
    if (p < l - 1)
      collectionArray[p].data.next = {
        title: collectionArray[p + 1].data.title,
        url: collectionArray[p + 1].url
      };
  }
  return collectionArray;
}

// Meta Keywords: My own script from Hexo Tutorial
exports.keyJoin = function(tags, keywords) {
  var keys = '';
  var terms = [];

  if (tags) {
    tags.forEach(function(tag){
      terms.push(tag);
    })
  }

  if (keywords) {
    keywords.forEach(function(keyword){
      terms.push(keyword);
    })
  }

  if (terms) {
    keys = terms.join(', ');
  }

  return keys;
}
