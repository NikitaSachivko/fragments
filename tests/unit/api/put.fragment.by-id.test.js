const request = require('supertest')
const app = require('../../../src/app')

describe('Testing PUT fragments', () => {

  test('Correct data', async () => {
    const responsePost = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "text/plain")
      .send("Test Fragment Data")

    const id1 = responsePost.body.fragment.id

    await request(app)
      .put(`/v1/fragments/${id1}`)
      .auth("user1@email.com", "password1")
      .set("Content-Type", "text/plain")
      .send("Test Fragment Data Updated Data")

    const responseGet = await request(app)
      .get(`/v1/fragments/${id1}`)
      .auth("user1@email.com", "password1")


    expect(responseGet.text).toBe("Test Fragment Data Updated Data")
    expect(responseGet.header['content-length']).toBe("31")
    expect(responseGet.header['content-type']).toContain("text/plain")

  })

  test('Trying to change content type', async () => {
    const responsePost = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "text/plain")
      .send("Test Fragment Data")

    const id1 = responsePost.body.fragment.id

    const responsePut = await request(app)
      .put(`/v1/fragments/${id1}`)
      .auth("user1@email.com", "password1")
      .set("Content-Type", "application/json")
      .send("Test Fragment Data Updated Data")

    const responseGet = await request(app)
      .get(`/v1/fragments/${id1}`)
      .auth("user1@email.com", "password1")

    expect(responsePut.body.status).toBe("error")
    expect(responsePut.body.error.message).toBe("Cannot change existing type")
    expect(responsePut.body.error.code).toBe(404)
    expect(responseGet.text).toBe("Test Fragment Data")
    expect(responseGet.header['content-length']).toBe("18")
    expect(responseGet.header['content-type']).toContain("text/plain")

  })
})
