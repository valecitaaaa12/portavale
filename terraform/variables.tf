variable "tenancy_ocid" {
  type        = string
  description = "OCID del tenancy de Oracle Cloud"
}

variable "user_ocid" {
  type        = string
  description = "OCID del usuario de OCI con permisos"
}

variable "fingerprint" {
  type        = string
  description = "Fingerprint de la API key"
}

variable "private_key_path" {
  type        = string
  description = "Ruta al archivo de la clave privada de la API"
  default     = "oci_api_key.pem"
}

variable "region" {
  type        = string
  description = "Región de Oracle Cloud"
  default     = "us-ashburn-1"
}

variable "compartment_ocid" {
  type        = string
  description = "OCID del compartment donde se crea la VM"
}

variable "ssh_public_key" {
  type        = string
  description = "Clave pública SSH para acceder a la VM"
}

variable "instance_shape" {
  type        = string
  description = "Shape de la instancia (E2.1.Micro es Always Free)"
  default     = "VM.Standard.E2.1.Micro"
}

variable "vcn_cidr" {
  type        = string
  default     = "10.0.0.0/16"
}

variable "subnet_cidr" {
  type        = string
  default     = "10.0.1.0/24"
}

variable "vm_display_name" {
  type    = string
  default = "portafolio-vm"
}

variable "project_name" {
  type    = string
  default = "portafolio-personal"
}
