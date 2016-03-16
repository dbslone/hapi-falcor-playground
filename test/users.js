/*eslint-disable */

const chai = require('chai')
const expect = chai.expect
const assert = chai.assert

const falcor = require('falcor')
const HttpDataSource = require('falcor-http-datasource')

const $ref = falcor.Model.ref

const dataSource = new HttpDataSource('http://localhost:9090/model.json')
const user = new falcor.Model({
  source: dataSource,
  cache: {
    users: {
      1: $ref('usersById[1]')
    },
    usersById: {
      0: {
        name: 'User 0'
      },
      1: {
        name: 'User 1'
      }
   }
  }
})

describe('Users', function() {

  describe('#cache', function() {

    it ('User 1 should be a $ref', function(done) {

      const cache = user.getCache()
      assert.equal(cache.users[1]['$type'], 'ref')
      done()
    })
  })

  describe('#getValue', function() {
    it ('should respond to .getValue', function(done) {

      user.getValue('users[1].name').then(function(res) {
        assert.equal(res, 'User 1')
        done()
      })
    })

    it ('should return email for User 1', function(done) {

      user.getValue('users[1]["email"]').then(function(res) {
        assert.equal(res, 'example1@test.com')
        done()
      })
    })
  })

  describe('#get', function() {
    it('should respond to .get', function(done) {

      user.get('users[1].name').then(function(res) {
        assert.equal(res.json.users[1].name, 'User 1')
        done()
      })
    })

    it('should return name of first two users', function(done) {

      user.get('users[0..1].name').then(function(res) {
        assert.equal(res.json.users[0].name, 'User 0')
        assert.equal(res.json.users[1].name, 'User 1')
        done()
      })
    })

    it('should return name and email of user', function(done) {

      user.get('users[1]["name","email"]').then(function(res) {
        assert.equal(res.json.users[1].name, 'User 1')
        assert.equal(res.json.users[1].email, 'example1@test.com')
        done()
      })
    })

    it('should respond to userById', function(done) {

      user.get('usersById[1].name').then(function(res) {
        assert.equal(res.json.usersById[1].name, 'User 1')
        done()
      })
    })
  })
})

/*eslint-enable */
