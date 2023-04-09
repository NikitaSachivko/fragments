# Post
POST http://localhost:9000/v1/fragments

Content-Type: text/plain

[BasicAuth]
user1@email.com:password1

`Hello S3!`

HTTP/1.1 201

[Asserts]
header "Location" matches "^http:\/\/localhost:9000\/v1\/fragments\/[A-Za-z0-9_-]+$"

[Captures]
url: header "Location"



# Get
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

[Asserts]
header "Content-Type" contains "text/plain;"
body == "Hello S3!"


# Delete
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200


# Get
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404
