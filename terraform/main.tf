provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

resource "google_compute_network" "custom_network" {
  name = "custom-network"
}

resource "google_compute_subnetwork" "custom_subnetwork" {
  name          = "custom-subnetwork"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.custom_network.name
}

resource "google_compute_firewall" "allow_http" {
  name    = "allow-http"
  network = google_compute_network.custom_network.name

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }

  source_ranges = ["0.0.0.0/0"]
}

resource "google_compute_instance" "vm_instance" {
  name         = "docker-vm"
  machine_type = "e2-medium"
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = "projects/debian-cloud/global/images/family/debian-11" 
    }
  }

  network_interface {
    network    = google_compute_network.custom_network.name
    subnetwork = google_compute_subnetwork.custom_subnetwork.name

    access_config {
      # Ephemeral external IP
    }
  }

  metadata = {
    google-logging-enabled = "true"
  }

  service_account {
    scopes = ["https://www.googleapis.com/auth/cloud-platform"]
  }

  metadata_startup_script = <<-EOT
    #! /bin/bash
    apt-get update
    apt-get install -y docker.io
    systemctl start docker
    systemctl enable docker
    gcloud auth configure-docker us-central1-docker.pkg.dev -q
    docker run -d -p 80:80 us-central1-docker.pkg.dev/${var.project_id}/${var.artifact_registry_name}/${var.docker_image}:latest
  EOT
}
