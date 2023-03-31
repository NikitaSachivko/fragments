const request = require('supertest')
const app = require('../../../src/app')

describe('Testing DELETE fragments', () => {

  let responsePost

  beforeEach(async () => {
    responsePost = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "text/plain")
      .send("Test Fragment Data 1")
  })

  test('Successful fragment deletion', async () => {
    const res = await request(app)
      .delete(`/v1/fragments/${responsePost.body.fragment.id}`)
      .auth("user1@email.com", "password1")

    expect(res.status).toBe(200)
  })


  test('Error: deleting nonexisting fragment', async () => {
    const res = await request(app)
      .delete(`/v1/fragments/fdshjkfasdhjsdfajhkasdfjhsdfakhj`)
      .auth("user1@email.com", "password1")

    expect(res.status).toBe(404)
    expect(res.body.status).toBe("error")
    expect(res.body.error.message).toContain('Error deleting fragment with id "fdshjkfasdhjsdfajhkasdfjhsdfakhj"')
  })
})

