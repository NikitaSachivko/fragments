POST http://localhost:9000/v1/fragments

Content-Type: text/nomatch

[BasicAuth]
user1@email.com:password1

`This is a fragment!`

HTTP/1.1 415 

[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 415
jsonpath "$.error.message" == "Unsupported Content-Type"
