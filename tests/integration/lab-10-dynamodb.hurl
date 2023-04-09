# Post json object
POST http://localhost:9000/v1/fragments

Content-Type: application/json

[BasicAuth]
user1@email.com:password1

{ "service": "DynamoDB" }

# Capture json object 
HTTP/1.1 201

[Asserts]
header "Location" matches "^http:\/\/localhost:9000\/v1\/fragments\/[A-Za-z0-9_-]+$"

[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"



# Get json object
GET {{fragment1_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

[Asserts]
jsonpath "$.status" == "ok"

jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"

jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"

jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "application/json"

jsonpath "$.fragment.size" == 25



# Post markdown object
POST http://localhost:9000/v1/fragments

Content-Type: text/markdown

[BasicAuth]
user1@email.com:password1

`DynamoDB is **great**`

# Capture json object 
HTTP/1.1 201

[Asserts]
header "Location" matches "^http:\/\/localhost:9000\/v1\/fragments\/[A-Za-z0-9_-]+$"

[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"



# Get markdown object
GET {{fragment2_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

[Asserts]
jsonpath "$.status" == "ok"

jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"

jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"

jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/markdown"

jsonpath "$.fragment.size" == 21



# Get all fragments
GET http://localhost:9000/v1/fragments?expand=1

[BasicAuth]
user1@email.com:password1

HTTP/1.1 200


[Asserts]
jsonpath "$.fragments[*].id" includes "{{fragment1_id}}"
jsonpath "$.fragments[*].id" includes "{{fragment2_id}}"



# Delete first fragment
DELETE http://localhost:9000/v1/fragments/{{fragment1_id}}

[BasicAuth]
user1@email.com:password1

HTTP/1.1 200



# Get first fragment
GET http://localhost:9000/v1/fragments/{{fragment1_id}}

[BasicAuth]
user1@email.com:password1

HTTP/1.1 404


# Get all fragments
GET http://localhost:9000/v1/fragments?expand=1

[BasicAuth]
user1@email.com:password1

HTTP/1.1 200


[Asserts]
jsonpath "$.fragments[*].id" != "{{fragment1_id}}"
jsonpath "$.fragments[*].id" == "{{fragment2_id}}"

