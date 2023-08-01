data "aws_availability_zones" "available_zones" {
  state = "available"
}

resource "aws_vpc" "default" {
  cidr_block = "10.32.0.0/16"
}

resource "aws_subnet" "public" {
  count                   = 2
  cidr_block              = cidrsubnet(aws_vpc.default.cidr_block, 8, 2 + count.index)
  availability_zone       = data.aws_availability_zones.available_zones.names[count.index]
  vpc_id                  = aws_vpc.default.id
  map_public_ip_on_launch = true
}

resource "aws_internet_gateway" "gateway" {
  vpc_id = aws_vpc.default.id
}

resource "aws_route" "internet_access" {
  route_table_id         = aws_vpc.default.main_route_table_id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.gateway.id
}

resource "aws_eip" "gateway" {
  count      = 2
  vpc        = true
  depends_on = [aws_internet_gateway.gateway]
}

resource "aws_security_group" "public" {
  name   = "loadtest-security-group"
  vpc_id = aws_vpc.default.id

  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ssm_parameter" "aws_access_key_id" {
  name        = "/loadtest/aws_access_key_id"
  description = "access key id"
  type        = "SecureString"
  value       = var.aws_access_key_id
}

resource "aws_ssm_parameter" "aws_secret_access_key" {
  name        = "/loadtest/secret_access_key"
  description = "secret_access_key"
  type        = "SecureString"
  value       = var.aws_secret_access_key
}

data "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"
}

resource "aws_iam_policy" "parameterstore_get_policy" {
  name = "loadtest_parameterstore_policy"

  policy = <<-EOF
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": [
          "ssm:GetParameters"
        ],
        "Effect": "Allow",
        "Resource": [
          "${aws_ssm_parameter.aws_access_key_id.arn}",
          "${aws_ssm_parameter.aws_secret_access_key.arn}"
        ]
      }
    ]
  }
  EOF
}

resource "aws_iam_role_policy_attachment" "attach_ecs_task_policy" {
  role = data.aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.parameterstore_get_policy.arn
}

resource "aws_ecs_task_definition" "loadtest_def" {
  family                   = "loadtest-task-def"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 1024
  memory                   = 2048
  execution_role_arn       = data.aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = data.aws_iam_role.ecs_task_execution_role.arn

  runtime_platform {
    operating_system_family = "LINUX"
  }

  container_definitions = jsonencode([{
    image : "${image_uri}",
    name : "loadtest-container",
    networkMode : "awsvpc",
    logConfiguration : {
      logDriver : "awslogs",
      options : {
        awslogs-group : aws_cloudwatch_log_group.loadtest_log_group.name,
        awslogs-region : "us-east-1",
        awslogs-stream-prefix : "ecs"
      }
    }
    environment : [
      {
        name : "SCRIPT",
        value : "${var.script_name}"
      }
    ],
    secrets : [
      {
        name : "AWS_ACCESS_KEY_ID",
        valueFrom : "${aws_ssm_parameter.aws_access_key_id.arn}"
      },
      {
        name : "AWS_SECRET_ACCESS_KEY",
        valueFrom : "${aws_ssm_parameter.aws_secret_access_key.arn}"
      }
    ]
  }])
}

resource "aws_cloudwatch_log_group" "loadtest_log_group" {
  name              = "/ecs/loadtest-fargate"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_stream" "loadtest_log_stream" {
  name           = "loadtest-log-stream"
  log_group_name = aws_cloudwatch_log_group.loadtest_log_group.name
}

resource "aws_ecs_cluster" "main" {
  name = "loadtest-cluster"
}

data "aws_ecs_task_execution" "main" {
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.loadtest_def.arn
  desired_count   = var.task_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.public[*].id
    security_groups  = [aws_security_group.public.id]
    assign_public_ip = true
  }
}
