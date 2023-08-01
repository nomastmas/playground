variable "task_count" {
  type    = number
  default = 1
}

variable "script_name" {
  type    = string
  default = "peak_traffic_read.yaml"
}

variable "aws_access_key_id" {
  type    = string
  default = ""
}

variable "aws_secret_access_key" {
  type    = string
  default = ""
}