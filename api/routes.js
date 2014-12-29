var fs    = require('fs'),
    glob  = require('glob');

module.exports = function (app) {
  'use strict';

  app.get('/', function (req, res) {
    res.json({ message: 'Konfident API' });
  });

  app.get('/directories', function (req, res) {
    var uploadDir = 'uploaded';

    glob('*/*.*', { cwd: __dirname + '/../' + uploadDir + '/' + req.query.rootDir }, function (err, files) {
      var directoriesMap  = {},
          result          = [],
          directories, i, j;
      
      for (i = files.length - 1; i >= 0; i--) {
        var explode   = files[i].split('/'),
            directory = explode[0],
            file      = explode[1];

        directoriesMap[directory] = directoriesMap[directory] || { pictures: [] };
        directoriesMap[directory].name = directory;
        directoriesMap[directory].src = uploadDir + '/' + req.query.rootDir + '/' + directory;
        directoriesMap[directory].pictures.push(file);
      }

      directories = Object.keys(directoriesMap);
      for (j = directories.length - 1; j >= 0; j--) {
        result.push(directoriesMap[directories[j]]);
      }

      res.json(result);
    });
  });
};
