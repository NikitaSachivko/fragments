#!/bin/sh

# Setup steps for working with LocalStack and DynamoDB local instead of AWS.
# Assumes aws cli is installed and LocalStack and DynamoDB local are running.

# Setup AWS environment variables
echo "Setting AWS environment variables for LocalStack"

echo "AWS_ACCESS_KEY_ID=test"
export AWS_ACCESS_KEY_ID=ASIASYHUNH5MLSP72AKP

echo "AWS_SECRET_ACCESS_KEY=test"
export AWS_SECRET_ACCESS_KEY=rxM4DstHuX/wZN4ONhdGslTygwNYiX4OHC9NdE1u

echo "AWS_SESSION_TOKEN=test"
export AWS_SESSION_TOKEN=FwoGZXIvYXdzEPr//////////wEaDHAi1lhIlmz9Ig6sNyLBAe/GzfssOuFlisAODx4F+RzySTBwpuzakd7jZwGjcmlOBK8XKoruaTed3obA5s+QY7BB8xZa1eM39FoOYxozt/Rl9AByHEho0SvL0oa/dsO8vfgMp7MwMcmaru8bLRvSDx9aakMxDuQo7Om0tPRFieQpGwIR/CQOQ+clC5xohxx0SIHaAq7cBGJj4HHtuD+ccxMN/gnsITtCxkI6YBL+rQkIT3D0nJnHc1xDGX7XFD5Fpp4RpXE+JX4uiJ+vbRUl21coveamoQYyLS7a3uAJG8s78/4F30kR/ClGIumwcWHjAcUG2ql8kWc5gP0X4rF6DL6DW0HVrg==

echo "AWS_DEFAULT_REGION=us-east-1"
export AWS_DEFAULT_REGION=us-east-1


# Wait for LocalStack to be ready, by inspecting the response from /health, see:
# https://github.com/localstack/localstack/issues/4904#issuecomment-966315170
echo 'Waiting for LocalStack S3...'
until (curl --silent http://localhost:4566/health | grep "\"s3\": \"\(running\|available\)\"" > /dev/null); do
    sleep 5
done
echo 'LocalStack S3 Ready'

# Create our S3 bucket with LocalStack
echo "Creating LocalStack S3 bucket: fragments"
aws --endpoint-url=http://localhost:4566 s3api create-bucket --bucket fragments

# Setup DynamoDB Table with dynamodb-local, see:
# https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/getting-started-step-1.html
echo "Creating DynamoDB-Local DynamoDB table: fragments"
aws --endpoint-url=http://localhost:8000 \
dynamodb create-table \
    --table-name fragments \
    --attribute-definitions \
        AttributeName=ownerId,AttributeType=S \
        AttributeName=id,AttributeType=S \
    --key-schema \
        AttributeName=ownerId,KeyType=HASH \
        AttributeName=id,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=10,WriteCapacityUnits=5

# Wait until the Fragments table exists in dynamodb-local, so we can use it, see:
# https://awscli.amazonaws.com/v2/documentation/api/latest/reference/dynamodb/wait/table-exists.html
aws --endpoint-url=http://localhost:8000 dynamodb wait table-exists --table-name fragments
