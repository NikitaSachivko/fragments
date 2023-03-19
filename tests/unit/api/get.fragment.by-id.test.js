const request = require('supertest')
const app = require('../../../src/app')
const postFragmentTest = require('./post.fragment.test')

describe('Testing GET request', () => {

  let responsePost
  let responsePostMd

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

    responsePostMd = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "text/markdown")
      .send("Test *Fragment* **Data**")
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
    expect(responseGet.body.error.message).toContain("Type text/plain can not be converted to: \".html\"")
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


  // Checking content length
  test('Wrong content-type test', async () => {
    const responseGet = await request(app)
      .get(`/v1/fragments/${responsePost.body.fragment.id}.txt`)
      .auth("user1@email.com", "password1")

    expect(responseGet.headers).toHaveProperty("content-length", "18") // checking if size = 18
  })


  // Checking type convertation from .md to .html
  test('Convertation from .md type to .html', async () => {
    const responseGet = await request(app)
      .get(`/v1/fragments/${responsePostMd.body.fragment.id}.html`)
      .auth("user1@email.com", "password1")

    expect(responseGet.text).toContain("<p>Test <em>Fragment</em> <strong>Data</strong></p>")
    expect(responseGet.headers).toHaveProperty("content-length", "52") // checking if size = 18
  })


  // Wrong convert: trying to convert .html back to .md
  // We don't support this right now
  test('Wrong convert: Convertation from .html type to .md', async () => {
    await request(app)
      .get(`/v1/fragments/${responsePostMd.body.fragment.id}.html`)
      .auth("user1@email.com", "password1")

    const responseGetHtml = await request(app)
      .get(`/v1/fragments/${responsePostMd.body.fragment.id}.md`)
      .auth("user1@email.com", "password1")

    expect(responseGetHtml.body.error.code).toEqual(415)
    expect(responseGetHtml.body.error.message).toContain('Type text/html can not be converted to: ".md"')
  })


  // If don't need to convert if user prompted same type as we currently have
  test('Convertation from .html type to .html', async () => {
    const responseGet = await request(app)
      .get(`/v1/fragments/${responsePostMd.body.fragment.id}. md`)
      .auth("user1@email.com", "password1")

    expect(responseGet.text).toBe("Test *Fragment* **Data**")
  })
})
