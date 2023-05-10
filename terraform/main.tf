data "archive_file" "default" {
    type = "zip"

    source_dir = "../src"
    output_path = "../app.zip"
}


module "lambda_function" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "secrets-manager"
  handler       = "index.handler"
  runtime       = "nodejs16.x"

  source_path = "../src/*.js"
  publish = true
  create_package = false
  create_role = false

  local_existing_package = data.archive_file.default.output_path

#   environment_variables = {
#     REGION   = "eu-west-2"
#     COMMANDS = jsonencode([
#         {
#             "action": "rotate",
#             "secretArn": module.secrets_manager.secret_arns[0],
#             "keys": ["FOO"]
#         },
#         {
#             "action": "copy",
#             "secretSourceArn": module.secrets_manager.secret_arns[0],
#             "secretDestination": module.secrets_manager.secret_arns[1],
#             "keys": ["FOO"]
#         }
#     ])
#   }
}