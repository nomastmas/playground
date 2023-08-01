# Terraform loadtest on AWS

Running terraform will do the following:
* Create all netowork related resources
* Create and attach a policy for getting SSM Parameter Store
* Create and store AWS related secrets
* Create an ECS cluster
* Create a task definition
* Create a container definition
* Execute task
* Run Artillery in container
* Send logs to Cloudwatch
* Send metrics to Cloudwatch

## Install

See instructions [here](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli#install-cli). Homebrew method is preferred as it's the simplest.

## Prerequisites

* valid AWS credentials in `~/.aws/credentials`
* awscli installed (`brew install awscli`)

## To run

To run terraform without any additional changes
```
TF_VAR_aws_access_key_id=`aws configure get default.aws_access_key_id` \
TF_VAR_aws_secret_access_key=`aws configure get default.aws_secret_access_key` \
terraform apply
```

`TF_VAR_aws_access_key_id` and `TF_VAR_aws_secret_access_key` are required for setting the keys in SSM ParameterStore.

### To run with variables in CLI

```
TF_VAR_aws_access_key_id=`aws configure get default.aws_access_key_id` \
TF_VAR_aws_secret_access_key=`aws configure get default.aws_secret_access_key` \
terraform apply -var script_name="foobar.yaml" -var task_count=10
```

`script_name` and `task_count` are variables defined in `variables.tf` and can be set when executing the CLI command.
