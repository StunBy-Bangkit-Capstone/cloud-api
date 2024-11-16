provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# Create a custom network
resource "google_compute_network" "custom_network" {
  name                    = "custom-network"
  auto_create_subnetworks = false
}

# Create a subnetwork in the specified region
resource "google_compute_subnetwork" "custom_subnetwork" {
  name          = "custom-subnetwork"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.custom_network.name

  lifecycle {
    prevent_destroy = true
  }
}

# Create a router for NAT Gateway
resource "google_compute_router" "custom_router" {
  name    = "custom-router"
  region  = var.region
  network = google_compute_network.custom_network.name
}

# Create a NAT Gateway for outbound internet access
resource "google_compute_router_nat" "custom_nat" {
  name                               = "custom-nat"
  router                             = google_compute_router.custom_router.name
  region                             = var.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
}

# Allow HTTP/HTTPS traffic from external sources
resource "google_compute_firewall" "allow_http_https" {
  name    = "allow-http-https"
  network = google_compute_network.custom_network.name

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }

  source_ranges = ["0.0.0.0/0"]
}

resource "google_compute_firewall" "allow_8080" {
  name    = "allow-8080"
  network = google_compute_network.custom_network.name

  allow {
    protocol = "tcp"
    ports    = ["8080"]
  }

  source_ranges = ["0.0.0.0/0"] # Allow traffic from all IPs
  target_tags   = ["http-server"] # Target specific VMs
}

# Allow internal traffic within the network
resource "google_compute_firewall" "allow_internal" {
  name    = "allow-internal"
  network = google_compute_network.custom_network.name

  allow {
    protocol = "tcp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "udp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "icmp"
  }

  source_ranges = ["10.0.0.0/24"]
}
resource "google_compute_firewall" "allow_iap_ssh" {
  name    = "allow-iap-ssh"
  network = google_compute_network.custom_network.name

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = ["35.235.240.0/20"] 
  target_tags   = ["allow-ssh"]     
}

# Create a VM instance
resource "google_compute_instance" "vm_instance" {
  name         = "docker-vm-instance"
  machine_type = "e2-micro"
  zone         = var.zone

  tags = ["allow-ssh", "http-server"]

  # Boot disk configuration
  boot_disk {
    initialize_params {
      image = "projects/debian-cloud/global/images/family/debian-11"
    }
  }

  # Network interface with NAT and external access
  network_interface {
    network    = google_compute_network.custom_network.name
    subnetwork = google_compute_subnetwork.custom_subnetwork.name

    access_config {
      # Ephemeral external IP
    }
  }

  # Metadata and startup script to configure Docker and run the container
  metadata = {
    google-logging-enabled = "true"
  }

  service_account {
    scopes = ["https://www.googleapis.com/auth/cloud-platform"]
  }

  metadata_startup_script = <<-EOT
    #!/bin/bash
    apt-get update
    apt-get install -y docker.io
    systemctl start docker
    systemctl enable docker
    gcloud auth configure-docker ${var.region}-docker.pkg.dev -q
    docker run -d -p 80:80 ${var.region}-docker.pkg.dev/${var.project_id}/${var.artifact_registry_name}/${var.docker_image}:latest
  EOT
}

#