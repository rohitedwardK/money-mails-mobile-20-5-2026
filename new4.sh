        sudo apt update
        sudo apt install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils
        sudo adduser $USER libvirt
        sudo adduser $USER kvm
        