
const { convert } = require('../../src/fragmentConverter')

describe("Converter test", () => {

  test('Correct data: Convert .md to html', async () => {
    const buffer = Buffer.from("This *is a* **fragment**", 'utf-8')
    const output = await convert('text/markdown', 'text/html', buffer)
    const stringFromBuffer = output.toString('utf8')

    expect(stringFromBuffer)
      .toContain("<p>This <em>is a</em> <strong>fragment</strong></p>")
  })

  // This functionality is not supported yet
  // Should return same result
  test('Correct data: Convert .md to .txt', async () => {
    const buffer = Buffer.from("This *is a* **fragment**", 'utf-8')
    const output = await convert('text/markdown', 'text/plain', buffer)
    const stringFromBuffer = output.toString('utf8')

    expect(stringFromBuffer)
      .toContain("This is a fragment")
  })



})
