const app = require('../src/app')
const supertest = require('supertest')

describe('App', () => {
  it('GET / responds with 200 containing "App Test is working"', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'App Test is working')
  })
})