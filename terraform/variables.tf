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
  default     = "sa-saopaulo-1"
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
  description = "Shape de VM; el valor predeterminado usa VM.Standard.E2.1.Micro, sujeto a capacidad regional"
  default     = "VM.Standard.E2.1.Micro"
}

variable "instance_ocpus" {
  type        = number
  description = "OCPU para shapes flexibles como A1 o E4"
  default     = 2
}

variable "instance_memory_gbs" {
  type        = number
  description = "Memoria para shapes flexibles como A1 o E4"
  default     = 12
}

variable "vcn_cidr" {
  type    = string
  default = "10.20.0.0/16"
}

variable "subnet_cidr" {
  type    = string
  default = "10.20.1.0/24"
}

variable "vm_display_name" {
  type    = string
  default = "portafolio-vm"
}

variable "project_name" {
  type    = string
  default = "portafolio-personal"
}
