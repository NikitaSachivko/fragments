const request = require('supertest')
const app = require('../../src/app')

describe("Test for triggering a 404 error", () => {
  test('Calling the wrong route', async () => {
    const res = await request(app).get('/wrong_route')
    expect(res.statusCode).toBe(404)
  }
  )
})
