data "oci_identity_availability_domains" "ads" {
  compartment_id = var.compartment_ocid
}

data "oci_core_images" "ubuntu" {
  compartment_id           = var.compartment_ocid
  operating_system         = "Canonical"
  operating_system_version = "24.04"
  shape                    = var.instance_shape
  sort_by                  = "TIMECREATED"
  sort_order               = "DESC"
}

# ------------------------------------------------------------
# Red: VCN + subnet pública + routing + internet gateway
# ------------------------------------------------------------
resource "oci_core_vcn" "portafolio" {
  compartment_id = var.compartment_ocid
  cidr_block     = var.vcn_cidr
  display_name   = "${var.project_name}-vcn"
  dns_label      = "portafolio"
}

resource "oci_core_internet_gateway" "portafolio" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.portafolio.id
  display_name   = "${var.project_name}-igw"
  enabled        = true
}

resource "oci_core_route_table" "portafolio" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.portafolio.id
  display_name   = "${var.project_name}-rt"

  route_rules {
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_internet_gateway.portafolio.id
  }
}

resource "oci_core_security_list" "portafolio" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.portafolio.id
  display_name   = "${var.project_name}-sl"

  egress_security_rules {
    destination = "0.0.0.0/0"
    protocol    = "all"
  }

  # SSH (22)
  ingress_security_rules {
    source   = "0.0.0.0/0"
    protocol = "6"
    tcp_options {
      min = 22
      max = 22
    }
  }

  # HTTP (80)
  ingress_security_rules {
    source   = "0.0.0.0/0"
    protocol = "6"
    tcp_options {
      min = 80
      max = 80
    }
  }

  # HTTPS (443)
  ingress_security_rules {
    source   = "0.0.0.0/0"
    protocol = "6"
    tcp_options {
      min = 443
      max = 443
    }
  }

  # ICMP (ping)
  ingress_security_rules {
    source   = "0.0.0.0/0"
    protocol = "1"
    icmp_options {
      type = 3
      code = 4
    }
  }
}

resource "oci_core_subnet" "public" {
  compartment_id             = var.compartment_ocid
  vcn_id                     = oci_core_vcn.portafolio.id
  cidr_block                 = var.subnet_cidr
  display_name               = "${var.project_name}-public-subnet"
  dns_label                  = "public"
  security_list_ids          = [oci_core_security_list.portafolio.id]
  route_table_id             = oci_core_route_table.portafolio.id
  prohibit_public_ip_on_vnic = false
}

# ------------------------------------------------------------
# VM Ubuntu 24.04 con IP pública
# ------------------------------------------------------------
resource "oci_core_instance" "portafolio_vm" {
  compartment_id      = var.compartment_ocid
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
  display_name        = var.vm_display_name
  shape               = var.instance_shape

  shape_config {
    ocpus         = var.instance_ocpus
    memory_in_gbs = var.instance_memory_gbs
  }

  create_vnic_details {
    subnet_id        = oci_core_subnet.public.id
    display_name     = "${var.vm_display_name}-vnic"
    assign_public_ip = true
    hostname_label   = "portafolio"
  }

  source_details {
    source_type = "image"
    source_id   = data.oci_core_images.ubuntu.images[0].id
  }

  metadata = {
    ssh_authorized_keys = var.ssh_public_key
  }

  freeform_tags = {
    Project   = var.project_name
    Practica  = "3.2"
    ManagedBy = "Terraform"
  }
}
