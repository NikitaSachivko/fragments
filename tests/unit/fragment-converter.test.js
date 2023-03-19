
const { convert } = require('../../src/fragmentConverter')

describe("Converter test", () => {

  test('Correct data: Convert .md to html', async () => {
    const output = convert('text/html', "1. This *is a* **fragment**")

    expect(output.replace(/\s/, "").replace(/\n/, ""))
      .toContain("<ol><li>This <em>is a</em> <strong>fragment</strong></li></ol>")
  })

  // This functionality is not supported yet
  // Should return same result
  test('Wrong data: Convert .html to .md', async () => {
    const output = convert('text/md', "<ol><li>This <em>is a</em><strong>fragment</strong></li></ol>")

    expect(output.replace(/\s/, "").replace(/\n/, ""))
      .toContain("<ol><li>This<em>is a</em><strong>fragment</strong></li></ol>")
  })
})
