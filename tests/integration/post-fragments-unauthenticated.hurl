POST http://localhost:9000/v1/fragments

Content-Type: text/nomatch

[BasicAuth]
user1@email.com:wrongpassword

`This is a fragment!`

HTTP/1.1 401

[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"
