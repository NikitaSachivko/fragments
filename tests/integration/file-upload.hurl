# Post text file
POST http://localhost:9000/v1/fragments

Content-Type: text/plain

[BasicAuth]
user1@email.com:password1

file,test_files/test.txt;


HTTP/1.1 201

[Asserts]
header "Location" matches "^http:\/\/localhost:9000\/v1\/fragments\/[A-Za-z0-9_-]+$"

[Captures]
url: header "Location"


# Get txt
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

[Asserts]
header "Content-Type" contains "text/plain;"
body contains "test"






# Post json file
POST http://localhost:9000/v1/fragments

Content-Type: application/json

[BasicAuth]
user1@email.com:password1

file,test_files/test.json;


HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:9000\/v1\/fragments\/[A-Za-z0-9_-]+$"

[Captures]
url: header "Location"



# Get json
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

[Asserts]
header "Content-Type" contains "application/json;"
body contains "test"
body contains "text"








# Post jpg file
POST http://localhost:9000/v1/fragments

Content-Type: image/jpg

[BasicAuth]
user1@email.com:password1

file,test_files/test.jpg;


HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:9000\/v1\/fragments\/[A-Za-z0-9_-]+$"

[Captures]
url: header "Location"



# Get json
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

[Asserts]
header "Content-Type" contains "image/jpg"


