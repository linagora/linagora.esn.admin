const request = require('supertest');
const expect = require('chai').expect;
const path = require('path');
const MODULE_NAME = 'linagora.esn.admin';

describe('The update autoconf API: PUT /autoconf', () => {
  let app, deployOptions, domain, admin, user;
  const password = 'secret';

  beforeEach(function(done) {
    this.helpers.modules.initMidway(MODULE_NAME, (err) => {
      if (err) return done(err);

      const adminApp = require(this.testEnv.backendPath + '/webserver/application')(this.helpers.modules.current.deps);
      const api = require(this.testEnv.backendPath + '/webserver/api/autoconf')(this.helpers.modules.current.deps);

      adminApp.use(require('body-parser').json());
      adminApp.use('/api/autoconf', api);

      app = this.helpers.modules.getWebServer(adminApp);
      deployOptions = {
        fixtures: path.normalize(`${__dirname}/../../fixtures/deployments`)
      };

      this.helpers.api.applyDomainDeployment('admin_module_deployment', deployOptions, (err, models) => {
        if (err) {
          return done(err);
        }

        domain = models.domain;
        admin = models.users[0];
        user = models.users[1];

        done();
      });
    });
  });

  afterEach(function(done) {
    this.helpers.mongo.dropDatabase((err) => {
      if (err) return done(err);
      this.testEnv.core.db.mongo.mongoose.connection.close(done);
    });
  });

  it('should return 401 if not logged in', function(done) {
    this.helpers.api.requireLogin(app, 'put', '/api/autoconf', done);
  });

  it('should return 400 if there is no domain_id query', function(done) {
    this.helpers.api.loginAsUser(app, user.emails[0], password, (err, requestAsUser) => {
      expect(err).to.not.exist;
      const req = requestAsUser(request(app).put('/api/autoconf'));

      req.send({});
      req.expect(400);
      req.end((err, res) => {
        expect(err).to.not.exist;
        expect(res.body.error.details).to.equal('missing domain_id in query');

        done();
      });
    });
  });

  it('should return 404 if domain is not found', function(done) {
    const invalidDomain = '599bb6acaaaaaaaaaaaaaaaa';

    this.helpers.api.loginAsUser(app, user.emails[0], password, (err, requestAsUser) => {
      expect(err).to.not.exist;
      const req = requestAsUser(request(app).put(`/api/autoconf?domain_id=${invalidDomain}`));

      req.send({});
      req.expect(404);
      req.end((err, res) => {
        expect(err).to.not.exist;
        expect(res.body.error.details).to.equal(`The domain ${invalidDomain} could not be found`);

        done();
      });
    });
  });

  it('should return 403 if user is not a domain admin', function(done) {
    this.helpers.api.loginAsUser(app, user.emails[0], password, (err, requestAsUser) => {
      expect(err).to.not.exist;
      const req = requestAsUser(request(app).put(`/api/autoconf?domain_id=${domain.id}`));

      req.send({});
      req.expect(403);
      req.end((err) => {
        expect(err).to.not.exist;

        done();
      });
    });
  });

  it('should return 400 if configuration is invalid', function(done) {
    this.helpers.api.loginAsUser(app, admin.emails[0], password, (err, requestAsAdmin) => {
      expect(err).to.not.exist;
      const req = requestAsAdmin(request(app).put(`/api/autoconf?domain_id=${domain.id}`));

      req.send({});
      req.expect(400);
      req.end((err, res) => {
        expect(err).to.not.exist;
        expect(res.body.error.details).to.match(/Bad autoconf format/);

        done();
      });
    });
  });

  it('should return 204 if configuration is valid', function(done) {
    const validConfig = {
      imap: {
        hostName: 'localhost',
        username: '<%= user.preferredEmail %>',
        port: 143,
        socketType: '3'
      },
      smtp: {
        description: 'OpenPaas SMTP (<%= user.preferredEmail %>)',
        hostname: 'localhost',
        port: 587,
        socketType: '2'
      }
    };

    this.helpers.api.loginAsUser(app, admin.emails[0], password, (err, requestAsAdmin) => {
      expect(err).to.not.exist;
      const req = requestAsAdmin(request(app).put(`/api/autoconf?domain_id=${domain.id}`));

      req.send(validConfig);
      req.expect(204);
      req.end((err) => {
        expect(err).to.not.exist;

        done();
      });
    });
  });
});
