'use strict'

const falcor = require('falcor')
const Router = require('falcor-router')
const _ = require('lodash')

const $ref = falcor.Model.ref
const $atom = falcor.Model.atom
const $error = falcor.Model.error
const $value = falcor.Model.pathValue


let usersById = {
  0: {name: 'User 0', email: 'example1@test.com', phoneNumber: '555-555-5555'},
  1: {name: 'User 1', email: 'example1@test.com', phoneNumber: '555-555-5555'},
  2: {name: 'User 2', email: 'example2@test.com', phoneNumber: '555-555-5555'}
}

let users = [
  $ref(['userById', 0]),
  $ref(['userById', 1]),
  $ref(['userById', 2])
]

const UserRouterBase = Router.createClass([
  {
    route: 'users[{integers:indices}][{keys:props}]',
    get (pathSet) {

      console.log('--- ROUTE: users[{integers:indices}][{keys:props}] ---')

      const userIds = pathSet.indices
      const userProps = pathSet.props

      return _.reduce(userIds, (arr, userId) => {

        const user = usersById[userId]
        const props = _.map(userProps, (prop) => {

          return $value(['users', userId, prop], user[prop])
        })

        return arr.concat(props)
      }, [])
    }
  },
  {
    // matches paths that look like:
    // ['usersById', 'some-user-id', ['id', 'name']]
    route: 'usersById[{keys:userIds}][{keys:userProps}]',
    get (pathSet) {

      console.log('--- ROUTE: usersById[{keys:userIds}][{keys:userProps}] ---')

      const userIds = pathSet.userIds
      const userProps = pathSet.userProps

      return userIds.reduce((arr, userId) => {

        const user = usersById[userId]
        return arr.concat(userProps.reduce((arr, prop) => {

          return arr.concat(
            $value(['usersById', userId, prop], $atom(user[prop]))
          )
        }, []))
      }, [])
    }
  }
])

const UserRouter = function () {

  UserRouterBase.call(this)
}
UserRouter.prototype = Object.create(UserRouterBase.prototype)

module.exports = UserRouter
