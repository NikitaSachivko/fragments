const request = require('supertest')
const app = require('../../../src/app')
const postFragmentTest = require('./post.fragment.test')

describe('Testing GET request', () => {

  let responsePost

  // Checking is all tests for POST are completed successfully
  beforeAll(async () => {
    await postFragmentTest
  })

  beforeEach(async () => {
    responsePost = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "text/plain")
      .send("Test Fragment Data")
  })


  // Case when all parameters are correct
  test('Correct data', async () => {
    const responseGet = await request(app)
      .get(`/v1/fragments/${responsePost.body.fragment.id}`)
      .auth("user1@email.com", "password1")

    expect(responseGet.text).toEqual("Test Fragment Data")
    expect(responseGet.headers["content-type"]).toContain("text/plain")
    expect(Number(responseGet.headers["content-length"])).toBe(18)
  })


  // Trying access with wrong email
  test('Wrong email test', async () => {
    const responseGet = await request(app)
      .get(`/v1/fragments/${responsePost.body.fragment.id}`)
      .auth("wrong_email", "password1")

    expect(responseGet.statusCode).toEqual(401)
  })


  // Trying access with wrong password test
  test('Wrong password test', async () => {
    const responseGet = await request(app)
      .get(`/v1/fragments/${responsePost.body.fragment.id}`)
      .auth("user1@email.com", "wrong_password")

    expect(responseGet.statusCode).toEqual(401)
  })


  // Trying to get fragment with wrong content-type
  test('Wrong content-type test', async () => {
    const responseGet = await request(app)
      .get(`/v1/fragments/${responsePost.body.fragment.id}.html`)
      .auth("user1@email.com", "password1")

    expect(responseGet.body.error.code).toEqual(415)
    expect(responseGet.body.error.message).toContain("Unsupported Content-Type")
  })


  // Checking if supports .txt extension (text/plain)
  test('Wrong content-type test', async () => {
    const responseGet = await request(app)
      .get(`/v1/fragments/${responsePost.body.fragment.id}.txt`)
      .auth("user1@email.com", "password1")

    expect(responseGet.text).toEqual("Test Fragment Data")
    expect(responseGet.headers["content-type"]).toContain("text/plain")
    expect(Number(responseGet.headers["content-length"])).toBe(18)
  })
})
