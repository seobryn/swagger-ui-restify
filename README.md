# Swagger UI Restify

Adds middleware to your restify app to serve the Swagger UI bound to your Swagger document. This acts as living documentation for your API hosted from within your app.

Updated to Swagger 3.13.0

## Usage

In app's `package.json`

    "swagger-ui-restify": "latest" // or desired version

Restify setup `app.js`
```javascript
const restify = require('restify');
const app = restify.createServer();
const swaggerUi = require('swagger-ui-restify');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

Open http://`<app_host>`:`<app_port>`/api-docs in your browser to view the documentation.

### [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc)

If you are using swagger-jsdoc simply pass the swaggerSpec into the setup function:

```javascript
// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

### Swagger Explorer

By default the Swagger Explorer bar is hidden, to display it pass true as the 'explorer' property of the options to the setup function:

```javascript
const restify = require('restify');
const app = restify.createServer();
const swaggerUi = require('swagger-ui-restify');
const swaggerDocument = require('./swagger.json');

var options = {
  explorer : true
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
```

### Custom swagger options

To pass custom options e.g. validatorUrl, to the SwaggerUi client pass an object as the 'swaggerOptions' property of the options to the setup function:

```javascript
const restify = require('restify');
const app = restify.createServer();
const swaggerUi = require('swagger-ui-restify');
const swaggerDocument = require('./swagger.json');

var options = {
	swaggerOptions: {
    validatorUrl : null
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
```

### Custom CSS styles

To customize the style of the swagger page, you can pass custom CSS as the 'customCss' property of the options to the setup function.

E.g. to hide the swagger header:

```javascript
const restify = require('restify');
const app = restify.createServer();
const swaggerUi = require('swagger-ui-restify');
const swaggerDocument = require('./swagger.json');

var options = {
  customCss: '.swagger-ui .topbar { display: none }'
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
```


### Custom JS

If you would like to have full control over your HTML you can  provide your own javascript file, value accepts absolute or relative path

```javascript
const restify = require('restify');
const app = restify.createServer();
const swaggerUi = require('swagger-ui-restify');
const swaggerDocument = require('./swagger.json');

var options = {
  customJs: '/custom.js'
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
```

### Load swagger from url

To load your swagger from a url instead of injecting the document, pass `null` as the first parameter, and pass the relative or absolute URL as the 'swaggerUrl' property of the options to the setup function.

```javascript
const restify = require('restify');
const app = restify.createServer();
const swaggerUi = require('swagger-ui-restify');

const swaggerDocument = require('./swagger.json');

var options = {
  swaggerUrl: 'http://petstore.swagger.io/v2/swagger.json'
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, options));
```

### Load swagger from yaml file

To load your swagger specification yaml file you need to use a module able to convert yaml to json ; for instance `yamljs`.

    npm install --save yamljs

```javascript
const restify = require('restify');
const app = restify.createServer();
const swaggerUi = require('swagger-ui-restify');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```


## Requirements

* Node v6.9.1 or above
* Restify 5 or above

## Testing

Install phantom
npm install
npm test
