var largeImageThreshold = 1200;
var ignoreAntialiasing = false;
var ignoreColors = false;

var pixelTransparency = 1,
  tolerance = { // between 0 and 255
    red: 10,
    green: 10,
    blue: 10,
    alpha: 10,
    minBrightness: 16,
    maxBrightness: 240
  },
  errorPixelColor = { // Color for Error Pixels. Between 0 and 255.
    red: 255,
    green: 0,
    blue: 255,
    alpha: 255
  };

var errorPixelTransform = {
  flat : function (d1, d2){
    return {
      r: errorPixelColor.red,
      g: errorPixelColor.green,
      b: errorPixelColor.blue,
      a: errorPixelColor.alpha
    }
  },
  movement: function (d1, d2){
    return {
      r: ((d2.r*(errorPixelColor.red/255)) + errorPixelColor.red)/2,
      g: ((d2.g*(errorPixelColor.green/255)) + errorPixelColor.green)/2,
      b: ((d2.b*(errorPixelColor.blue/255)) + errorPixelColor.blue)/2,
      a: d2.a
    }
  },
  flatDifferenceIntensity: function (d1, d2){
    return {
      r: errorPixelColor.red,
      g: errorPixelColor.green,
      b: errorPixelColor.blue,
      a: colorsDistance(d1, d2)
    }
  },
  movementDifferenceIntensity: function (d1, d2){
    var ratio = colorsDistance(d1, d2)/255 * 0.8;
    return {
      r: ((1-ratio)*(d2.r*(errorPixelColor.red/255)) + ratio*errorPixelColor.red),
      g: ((1-ratio)*(d2.g*(errorPixelColor.green/255)) + ratio*errorPixelColor.green),
      b: ((1-ratio)*(d2.b*(errorPixelColor.blue/255)) + ratio*errorPixelColor.blue),
      a: d2.a
    }
  }
};

var errorPixelTransformer = errorPixelTransform.flat;

function colorsDistance(c1, c2) {
  return (Math.abs(c1.r - c2.r) + Math.abs(c1.g - c2.g) + Math.abs(c1.b - c2.b))/3;
}

function loop(x, y, callback) {
  var i,j;

  for (i=0;i<x;i++){
    for (j=0;j<y;j++){
      callback(i, j);
    }
  }
}

function addBrightnessInfo(data) {
  data.brightness = getBrightness(data.r,data.g,data.b); // 'corrected' lightness
}

function addHueInfo(data) {
  data.h = getHue(data.r,data.g,data.b);
}

function isAntialiased(sourcePix, data, cacheSet, verticalPos, horizontalPos, width) {
  var offset;
  var targetPix;
  var distance = 1;
  var i;
  var j;
  var hasHighContrastSibling = 0;
  var hasSiblingWithDifferentHue = 0;
  var hasEquivilantSibling = 0;

  addHueInfo(sourcePix);

  for (i = distance*-1; i <= distance; i++){
    for (j = distance*-1; j <= distance; j++){

      if(i===0 && j===0){
        // ignore source pixel
      } else {

        offset = ((verticalPos+j)*width + (horizontalPos+i)) * 4;
        targetPix = getPixelInfo(data, offset, cacheSet);

        if(targetPix === null){
          continue;
        }

        addBrightnessInfo(targetPix);
        addHueInfo(targetPix);

        if( isContrasting(sourcePix, targetPix) ){
          hasHighContrastSibling++;
        }

        if( isRGBSame(sourcePix,targetPix) ){
          hasEquivilantSibling++;
        }

        if( Math.abs(targetPix.h - sourcePix.h) > 0.3 ){
          hasSiblingWithDifferentHue++;
        }

        if( hasSiblingWithDifferentHue > 1 || hasHighContrastSibling > 1){
          return true;
        }
      }
    }
  }

  if (hasEquivilantSibling < 2){
    return true;
  }

  return false;
}

function getHue(r,g,b) {
  r = r / 255;
  g = g / 255;
  b = b / 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h;
  var d;

  if (max == min){
    h = 0; // achromatic
  } else{
    d = max - min;
    switch(max){
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return h;
}

function isContrasting(d1, d2) {
  return Math.abs(d1.brightness - d2.brightness) > tolerance.maxBrightness;
}

function isColorSimilar(a, b, color) {
  var absDiff = Math.abs(a - b);

  if(typeof a === 'undefined'){
    return false;
  }
  if(typeof b === 'undefined'){
    return false;
  }

  if(a === b){
    return true;
  } else if ( absDiff < tolerance[color] ) {
    return true;
  } else {
    return false;
  }
}

function isNumber(n) {
  return !isNaN(parseFloat(n));
}

function isPixelBrightnessSimilar(d1, d2) {
  var alpha = isColorSimilar(d1.a, d2.a, 'alpha');
  var brightness = isColorSimilar(d1.brightness, d2.brightness, 'minBrightness');
  return brightness && alpha;
}

function getBrightness(r,g,b){
  return 0.3*r + 0.59*g + 0.11*b;
}

function isRGBSame(d1,d2){
  var red = d1.r === d2.r;
  var green = d1.g === d2.g;
  var blue = d1.b === d2.b;
  return red && green && blue;
}

function isRGBSimilar(d1, d2){
  var red = isColorSimilar(d1.r,d2.r,'red');
  var green = isColorSimilar(d1.g,d2.g,'green');
  var blue = isColorSimilar(d1.b,d2.b,'blue');
  var alpha = isColorSimilar(d1.a, d2.a, 'alpha');

  return red && green && blue && alpha;
}

function errorPixel(px, offset, data1, data2){
  var data = errorPixelTransformer(data1, data2);
  px[offset] = data.r;
  px[offset + 1] = data.g;
  px[offset + 2] = data.b;
  px[offset + 3] = data.a;
}

function copyPixel(px, offset, data){
  px[offset] = data.r; //r
  px[offset + 1] = data.g; //g
  px[offset + 2] = data.b; //b
  px[offset + 3] = data.a * pixelTransparency; //a
}

function copyGrayScalePixel(px, offset, data){
  px[offset] = data.brightness; //r
  px[offset + 1] = data.brightness; //g
  px[offset + 2] = data.brightness; //b
  px[offset + 3] = data.a * pixelTransparency; //a
}

function getPixelInfo(data, offset, cacheSet) {
  var r;
  var g;
  var b;
  var d;
  var a;

  r = data[offset];

  if(typeof r !== 'undefined'){
    g = data[offset+1];
    b = data[offset+2];
    a = data[offset+3];
    d = {
      r: r,
      g: g,
      b: b,
      a: a
    };

    return d;
  } else {
    return null;
  }
}

function compareImageData(imgd, width, height, dataOne, dataTwo, id) {
  var data          = {},
      mismatchCount = 0,
      time          = Date.now(),
      skip,
      targetPix = imgd.data;

  var data1 = dataOne;
  var data2 = dataTwo;

  if (!!largeImageThreshold && ignoreAntialiasing && (width > largeImageThreshold || height > largeImageThreshold)) {
    skip = 6;
  }

  loop(height, width, function (verticalPos, horizontalPos) {
    if (skip) { // only skip if the image isn't small
      if (verticalPos % skip === 0 || horizontalPos % skip === 0) {
        return;
      }
    }

    var offset = (verticalPos * width + horizontalPos) * 4;
    var pixel1 = getPixelInfo(data1, offset, 1);
    var pixel2 = getPixelInfo(data2, offset, 2);

    if(pixel1 === null || pixel2 === null){
      return;
    }

    if (ignoreColors){

      addBrightnessInfo(pixel1);
      addBrightnessInfo(pixel2);

      if( isPixelBrightnessSimilar(pixel1, pixel2) ){
        copyGrayScalePixel(targetPix, offset, pixel2);
      } else {
        errorPixel(targetPix, offset, pixel1, pixel2);
        mismatchCount++;
      }
      return;
    }

    if (isRGBSimilar(pixel1, pixel2)) {
      copyPixel(targetPix, offset, pixel1, pixel2);
    } else if( ignoreAntialiasing && (
      addBrightnessInfo(pixel1), // jit pixel info augmentation looks a little weird, sorry.
        addBrightnessInfo(pixel2),
        isAntialiased(pixel1, data1, 1, verticalPos, horizontalPos, width) ||
        isAntialiased(pixel2, data2, 2, verticalPos, horizontalPos, width)
      )){

      if( isPixelBrightnessSimilar(pixel1, pixel2) ){
        copyGrayScalePixel(targetPix, offset, pixel2);
      } else {
        errorPixel(targetPix, offset, pixel1, pixel2);
        mismatchCount++;
      }
    } else {
      errorPixel(targetPix, offset, pixel1, pixel2);
      mismatchCount++;
    }

  });

  data.id = id;
  data.misMatchPercentage = (mismatchCount / (height*width) * 100);
  data.analysisTime = Date.now() - time;
  data.imgd = imgd;

  self.postMessage({cmd: 'result', info: data});
}


self.addEventListener('message', function (e) {
  var data = e.data;

  switch (data.cmd) {
    case 'start':
      self.postMessage('WORKER STARTED: ' + data.info);
      compareImageData(data.info.imgd, data.info.width, data.info.height, data.info.dataOne, data.info.dataTwo, data.info.id);
      break;

    case 'stop':
      self.postMessage('WORKER STOPPED');
      self.close(); // Terminates the worker.
      break;

    default:
      self.postMessage('Unknown command: ' + data.msg);
  }

}, false);