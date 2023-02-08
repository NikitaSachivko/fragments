const request = require('supertest')
const app = require('../../../src/app')

describe('Testing successful POST request', () => {

  // Case when all parameters are correct
  test('correct data', async () => {

    const response = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "text/plain")
      .send("This is a fragment")

    console.log(response)

  })

})
