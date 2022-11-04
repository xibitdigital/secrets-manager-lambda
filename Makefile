.PHONY: up install-role

all: install localstack-down localstack-up create-role create-secret _zip-solution _create-function

install:
	pip3 install awscli-local
	pip3 install terraform-local
	npm i

localstack-up:
	docker-compose up -d

localstack-down:
	docker-compose down

create-role:
	awslocal iam create-role \
	--role-name lambda-ex \
	--assume-role-policy-document '{"Version": "2012-10-17","Statement": [{ "Effect": "Allow", "Principal": {"Service": "lambda.amazonaws.com"}, "Action": "sts:AssumeRole"}]}'

create-secret:
	awslocal secretsmanager create-secret \
    --name my_test_secret \
    --description "My test secret created with the CLI." \
    --secret-string "{\"user\":\"foo\",\"password\":\"bar\"}"

get-secret:
	awslocal secretsmanager get-secret-value \
    --secret-id my_test_secret

_create-function:
	awslocal lambda create-function \
    --function-name worker \
    --zip-file fileb://index.zip \
    --handler index.handler \
	--runtime nodejs16.x \
	--role arn:aws:iam::000000000000:role/lambda-ex \
	--environment "Variables={REGION=:us-east-1,COMMANDS='[{"action":"rotate","secretArn":"my_test_secret","keys":["pass"]}]'}"

_zip-solution:
	rm -rf ./index.zip
	zip ./index.zip  ./src/*.js

_delete-function:
	awslocal lambda delete-function \
    --function-name worker

upload-function:
	$(MAKE) _zip-solution
	$(MAKE) _delete-function
	$(MAKE) _create-function

run-function:
	awslocal lambda invoke --function-name worker /dev/stdout
