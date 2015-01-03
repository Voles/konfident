(function () {
  'use strict';

  angular.module('kf')
    .service('CompareImages', function ($q, CompareImageDataWorker) {
      function compareImageData(firstImageSrc, firstImageData, secondImageData, width, height) {
        var hiddenCanvas  = document.createElement('canvas');

        hiddenCanvas.width = width;
        hiddenCanvas.height = height;

        var context = hiddenCanvas.getContext('2d');
        var imgd = context.createImageData(width, height);
        var info = {
          id: firstImageSrc,
          imgd: imgd,
          width: width,
          height: height,
          dataOne: firstImageData,
          dataTwo: secondImageData
        };

        return CompareImageDataWorker.start(info)
          .then(function (data) {
            context.putImageData(data.imgd, 0, 0);
            data.imageDataUrl = hiddenCanvas.toDataURL('image/png');
            return data;
          });
      }

      function imageSrcToInfo(imageSrc) {
        var defer         = $q.defer(),
            img           = new Image(),
            hiddenCanvas  = document.createElement('canvas'),
            context       = hiddenCanvas.getContext('2d');

        img.onload = function () {
          hiddenCanvas.width = img.naturalWidth;
          hiddenCanvas.height = img.naturalHeight;
          context.drawImage(img, 0, 0);

          var response = {
            data: context.getImageData(0, 0, img.naturalWidth, img.naturalHeight).data,
            width: img.naturalWidth,
            height: img.naturalHeight
          };

          defer.resolve(response);
        };

        img.src = imageSrc;

        return defer.promise;
      }

      return {
        compare: function (firstImageSrc, secondImageSrc) {
          var firstImageInfo, secondImageInfo;

          return imageSrcToInfo(firstImageSrc)
            .then(function (imageInfo) {
              firstImageInfo = imageInfo;
              return imageSrcToInfo(secondImageSrc);
            })
            .then(function (imageInfo) {
              secondImageInfo = imageInfo;

              // detect biggest image
              var width = Math.max(firstImageInfo.width, secondImageInfo.width);
              var height = Math.max(firstImageInfo.height, secondImageInfo.height);

              return compareImageData(firstImageSrc, firstImageInfo.data, secondImageInfo.data, width, height);
            });
        }
      };
    });

}());