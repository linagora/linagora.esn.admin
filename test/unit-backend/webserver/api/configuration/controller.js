'use strict';

const expect = require('chai').expect;

describe('The configuration API controller', function() {
  let getController, authJwtMock;

  beforeEach(function() {
    authJwtMock = {};
    this.moduleHelpers.addDep('auth', { jwt: authJwtMock });

    getController = () => require(this.moduleHelpers.modulesPath + '/backend/webserver/api/configuration/controller')(this.moduleHelpers.dependencies);
  });

  describe('The generateJwtKeyPair fn', function() {
    it('should respond 200 with generated keys on success', function(done) {
      var keys = {
        publicKey: 'publicKey',
        privateKey: 'privateKey'
      };

      authJwtMock.generateKeyPair = function(callback) {
        callback(null, keys);
      };

      var req = {};
      var res = {
        status: function(code) {
          expect(code).to.equal(200);

          return {
            json: function(json) {
              expect(json).to.deep.equal(keys);
              done();
            }
          };
        }
      };

      getController().generateJwtKeyPair(req, res);
    });

    it('should respond 500 on failure', function(done) {
      authJwtMock.generateKeyPair = function(callback) {
        callback(new Error('some_error'));
      };

      var req = {};
      var res = {
        status: function(code) {
          expect(code).to.equal(500);

          return {
            json: function(json) {
              expect(json).to.deep.equal({
                error: {
                  code: 500,
                  message: 'Server Error',
                  details: 'Cannot generate RSA keypair'
                }
              });
              done();
            }
          };
        }
      };

      getController().generateJwtKeyPair(req, res);
    });
  });
});
