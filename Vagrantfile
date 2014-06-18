# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  
  config.vm.box = "precise32"

  config.vm.box_url = "http://files.vagrantup.com/precise32.box"
  
  #config.vm.network :forwarded_port, guest: 80, host: 8080
  config.vm.network :forwarded_port, guest: 8080, host: 8081
  config.vm.network :forwarded_port, guest: 22, host: 2201, id: "ssh", auto_correct: true
  
  config.vm.synced_folder ".", "/vagrant", :id => "vagrant-root", :owner => "vagrant", :group => "vagrant", :mount_options => ["dmode=777,fmode=777"]

end
