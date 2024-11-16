variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The GCP region"
  type        = string
  default     = "asia-southeast2"
}

variable "zone" {
  description = "The GCP zone"
  type        = string
  default     = "asia-southeast2-a"
}

variable "artifact_registry_name" {
  description = "The name of the Artifact Registry repository"
  type        = string
}

variable "docker_image" {
  description = "The Docker image name stored in Artifact Registry"
  type        = string
}
