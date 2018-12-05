'use strict'

var fs = require('fs');
var restify = require('restify');
var swaggerUi = require('swagger-ui-dist');

var favIconHtml = '<link rel="icon" type="image/png" href="./favicon-32x32.png" sizes="32x32" />' +
                  '<link rel="icon" type="image/png" href="./favicon-16x16.png" sizes="16x16" />'

var swaggerInit

var generateHTML = function (swaggerDoc, opts, options, customCss, customfavIcon, swaggerUrl, customeSiteTitle) {
  var isExplorer
  var customJs
  var swaggerUrls
  var baseURL = '.'

  if (opts && typeof opts === 'object') {
    options = opts.swaggerOptions
    customCss = opts.customCss
    customJs = opts.customJs
    customfavIcon = opts.customfavIcon
    swaggerUrl = opts.swaggerUrl
    swaggerUrls = opts.swaggerUrls
    isExplorer = opts.explorer || !!swaggerUrls
    customeSiteTitle = opts.customSiteTitle
    baseURL = opts.baseURL
  } else {
    //support legacy params based function
    isExplorer = opts
  }
	options = options || {};
  var explorerString = isExplorer ? '' : '.swagger-ui .topbar .download-url-wrapper { display: none }';
    customCss = explorerString + ' ' + customCss || explorerString;
    customfavIcon = customfavIcon || false;
    customeSiteTitle = customeSiteTitle || 'Swagger UI';
	var html = fs.readFileSync(__dirname + '/indexTemplate.html');
    try {
    	fs.unlinkSync(__dirname + '/index.html');
    } catch (e) {

    }

    var favIconString = customfavIcon ? '<link rel="icon" href="' + customfavIcon + '" />' : favIconHtml;
    var htmlWithBaseURL = html.toString().replace(/{BASEURL}/g, baseURL);
    var htmlWithCustomCss = htmlWithBaseURL.replace('<% customCss %>', customCss);
    var htmlWithFavIcon = htmlWithCustomCss.replace('<% favIconString %>', favIconString);
    var htmlWithCustomJs = htmlWithFavIcon.replace('<% customJs %>', customJs ? `<script src="${customJs}"></script>` : '');

    var initOptions = {
      swaggerDoc: swaggerDoc || undefined,
      customOptions: options,
      swaggerUrl: swaggerUrl || undefined,
      swaggerUrls: swaggerUrls || undefined
    }
    var js = fs.readFileSync(__dirname + '/swagger-ui-init.js');
    swaggerInit = js.toString().replace('<% swaggerOptions %>', stringify(initOptions))
    return htmlWithCustomJs.replace('<% title %>', customeSiteTitle)
}

var setup = function (swaggerDoc, opts, options, customCss, customfavIcon, swaggerUrl, customeSiteTitle) {
    var htmlWithOptions = generateHTML(swaggerDoc, opts, options, customCss, customfavIcon, swaggerUrl, customeSiteTitle)
    return function (req, res) {
      res.writeHead(200, {
        'Content-Length': Buffer.byteLength(htmlWithOptions),
        'Content-Type': 'text/html'
      });
      res.write(htmlWithOptions);
      res.end();
     };
};

function swaggerInitFn (req, res, next) {
  if (req.url.endsWith('/swagger-ui-init.js')) {
    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(swaggerInit),
      'Content-Type': 'application/javascript'
    });
    res.write(swaggerInit);
    res.end();

  } else {
    next()
  }
}

var swaggerInitFunction = function (swaggerDoc, opts) {
  var js = fs.readFileSync(__dirname + '/swagger-ui-init.js');
  var swaggerInitFile = js.toString().replace('<% swaggerOptions %>', stringify(opts))
  return function (req, res, next) {
    if (req.url.endsWith('/swagger-ui-init.js')) {
      res.writeHead(200, {
        'Content-Length': Buffer.byteLength(swaggerInitFile),
        'Content-Type': 'application/javascript'
      });
      res.write(swaggerInitFile);
      res.end();
    } else {
      next()
    }
  }
}

var swaggerAssetMiddleware = (options = {}) => {
  var staticServer = restify.plugins.serveStatic(Object.assign({ directory: swaggerUi.getAbsoluteFSPath(), appendRequestPath: false }, options));

  return (req, res, next) => {
    if(/(\/|index\.html)$/.test(req.path)) {
      return next()
    } else {
      return staticServer(req, res, next)
    }
  }
}

var serveFiles = function (swaggerDoc, opts) {
  opts = opts || {}
  var initOptions = {
    swaggerDoc: swaggerDoc || undefined,
    customOptions: opts.swaggerOptions || {},
    swaggerUrl: opts.swaggerUrl || {},
    swaggerUrls: opts.swaggerUrls || undefined
  }
  var swaggerInitWithOpts = swaggerInitFunction(swaggerDoc, initOptions)

  return [swaggerInitWithOpts, swaggerAssetMiddleware()]
}

var serve = [swaggerInitFn, swaggerAssetMiddleware()];
var serveWithOptions = options => [swaggerInitFn, swaggerAssetMiddleware(options)];

var stringify = function (obj, prop) {
  var placeholder = '____FUNCTIONPLACEHOLDER____';
  var fns = [];
  var json = JSON.stringify(obj, function (key, value) {
    if (typeof value === 'function') {
      fns.push(value);
      return placeholder;
    }
    return value;
  }, 2);
  json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function (_) {
    return fns.shift();
  });
  return 'var options = ' + json + ';';
};

module.exports = {
	setup: setup,
	serve: serve,
  serveWithOptions: serveWithOptions,
  generateHTML: generateHTML,
  serveFiles: serveFiles
};
