# TESTING TXT
# Post text file
POST http://localhost:9000/v1/fragments

Content-Type: text/plain

[BasicAuth]
user1@email.com:password1

`Content`



HTTP/1.1 201

[Asserts]
header "Location" matches "^http:\/\/localhost:9000\/v1\/fragments\/[A-Za-z0-9_-]+$"

[Captures]
url: header "Location"



# Get txt
PUT {{url}}

Content-Type: text/plain

[BasicAuth]
user1@email.com:password1

`New content`



HTTP/1.1 200

[Asserts]
jsonpath "$.fragment.type" == "text/plain"



# Get json
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

[Asserts]
header "Content-Type" contains "text/plain;"
body contains "New content"





# TESTING MD
POST http://localhost:9000/v1/fragments

Content-Type: text/markdown

[BasicAuth]
user1@email.com:password1

`1. Fragment data *content*`



HTTP/1.1 201

[Asserts]
header "Location" matches "^http:\/\/localhost:9000\/v1\/fragments\/[A-Za-z0-9_-]+$"

[Captures]
url: header "Location"


# Get txt
PUT {{url}}

Content-Type: text/markdown

[BasicAuth]
user1@email.com:password1

`New *content*`


# Get json
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

[Asserts]
header "Content-Type" contains "text/markdown;"
body contains "New *content*"
