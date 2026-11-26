output "public_ip" {
  description = "IP pública de la VM del portafolio"
  value       = oci_core_instance.portafolio_vm.public_ip
}

output "instance_id" {
  description = "OCID de la instancia"
  value       = oci_core_instance.portafolio_vm.id
}

output "vcn_id" {
  value = oci_core_vcn.portafolio.id
}

output "subnet_id" {
  value = oci_core_subnet.public.id
}

output "ssh_command" {
  description = "Comando SSH para conectarse a la VM"
  value       = "ssh -i ${var.private_key_path} ubuntu@${oci_core_instance.portafolio_vm.public_ip}"
}
