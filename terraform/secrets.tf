module "secrets_manager" {
  source = "lgallard/secrets-manager/aws"

    secrets = {
        rotate-secret = {
            description = "This is a key/value secret to be rotated"
            secret_key_value = {
                foo = "value1"
                bar = "value2"
            }
        }
        copy-secret = {
            description = "This is a key/value which get a copy from the rotated"
            secret_key_value = {
            }
        }
    }
}
