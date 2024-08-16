import assert from 'assert';
import app from './testapp/app.mjs'
import http from 'http'
import phantom from 'phantom'
import 'es6-shim'

describe('integration', function () {
  var server;
  var sitepage = null;
  var phInstance = null;

  before(function (done) {
    server = app.listen(3001, function () {
      done();
    });
  });

  after(function () {
    server.close();
    sitepage.close();
    phInstance.exit();
  });

  it('should have API Documentation hosted at /api-docs', function (done) {
    this.timeout(30000);
    phantom.create()
      .then(function (instance) {
        phInstance = instance;
        return instance.createPage();
      })
      .then(function (page) {
        sitepage = page;
        return page.open('http://localhost:3001/api-docs');
      })
      .then(function (status) {
        setTimeout(function () {
          assert.equal('success', status);
          done();
        }, 100);
      })
      .catch(function (err) {
        done(err);
      });
  });

  it('should contain the expected elements on the page', function (done) {
    sitepage.property('title')
      .then(function (title) {
        assert.equal('Swagger UI', title);
        return sitepage.evaluate(function () {
          return document.querySelector('.swagger-ui').innerHTML;
        });
      })
      .then(function (html) {
        console.log(html);
        assert.ok(html);
        assert.notEqual(html.indexOf('id="operations-/test-index"'), -1);
        assert.notEqual(html.indexOf('id="operations-/test-impossible"'), -1);
        done();
      })
      .catch(function (err) {
        done(err);
      });
  });

  it('should have API Documentation hosted at /api-docs-from-url', function (done) {
    sitepage.open('http://localhost:3001/api-docs-from-url')
      .then(function (status) {
        setTimeout(function () {
          assert.equal('success', status);
          done();
        }, 100);
      })
      .catch(function (err) {
        done(err);
      });
  });

  it('should contain the expected elements on the page', function (done) {
    sitepage.property('title')
      .then(function (title) {
        assert.equal('Swagger UI', title);
        return sitepage.evaluate(function () {
          return document.querySelector('.swagger-ui').innerHTML;
        });
      })
      .then(function (html) {
        assert.ok(html);
        assert.notEqual(html.indexOf('id="operations-/test-index"'), -1);
        assert.notEqual(html.indexOf('id="operations-/test-impossible"'), -1);
        done();
      })
      .catch(function (err) {
        done(err);
      });
  });

  it('should have API Documentation hosted at /api-docs-using-object', function (done) {
    sitepage.open('http://localhost:3001/api-docs-using-object')
      .then(function (status) {
        setTimeout(function () {
          assert.equal('success', status);
          done();
        }, 100);
      })
      .catch(function (err) {
        done(err);
      });
  });

  it('should contain the expected elements on the page for api-docs-using-object', function (done) {
    sitepage.property('title')
      .then(function (title) {
        assert.equal('Swagger UI', title);
        return sitepage.evaluate(function () {
          return document.querySelector('.swagger-ui').innerHTML;
        });
      })
      .then(function (html) {
        assert.ok(html);
        assert.notEqual(html.indexOf('id="operations-/test-index"'), -1);
        assert.notEqual(html.indexOf('id="operations-/test-impossible"'), -1);
        done();
      })
      .catch(function (err) {
        done(err);
      });
  });

  // Restify does static file hosting differently then Express. They prepend the mount point to the
  // static directory which seems ok from some points of view but means you can't have virtual paths
  // and in the case of this module we need a virtual path. In Restify v5 and up they add the option
  // to not prepend the mount path but seems it loses it in the relative URLs so I had to add a new
  // option to setup() so we can add the mount path to the HTML to fix the relative URLs. That does
  // mean that the case where the options is null is no longer valid so I'm commenting this case out.
  //
  // it('should have API Documentation hosted at /api-docs-with-null', function(done) {
  //   sitepage.open('http://localhost:3001/api-docs-with-null')
  //     .then(function(status) {
  //       setTimeout(function() {
  //         assert.equal('success', status);
  //         done();
  //       }, 100);
  //     })
  //     .catch(function(err) {
  //       done(err);
  //     });
  // });

  // it('should contain the expected elements on the page for api-docs-with-null', function(done) {
  //   sitepage.property('title')
  //     .then(function(title) {
  //       assert.equal('Swagger UI', title);
  //       return sitepage.evaluate(function() {
  //         return document.querySelector('.swagger-ui').innerHTML;
  //       });
  //     })
  //     .then(function(html) {
  //       assert.ok(html);
  //       assert.notEqual(html.indexOf('id="operations-/test-index"'), -1);
  //       assert.notEqual(html.indexOf('id="operations-/test-impossible"'), -1);
  //       done();
  //     })
  //     .catch(function(err) {
  //       done(err);
  //     });
  // });
});
