---
title: "Running Ubuntu Desktop in Google Cloud Platform"
meta_title: "Ubuntu Desktop on GCP"
description: "Set up a virtual Ubuntu Desktop environment on Google Cloud Platform's Compute Engine"
date: 2025-03-27T00:00:00Z
image: "/images/solutions/running-ubuntu-desktop-gcp.png"
categories: ["How To"]
author: "Chris"
tags: ["gcp", "ubuntu", "cloud", "remote-desktop"]
draft: false
---

<script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="kilpen" data-color="#FFDD00" data-emoji=""  data-font="Cookie" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#ffffff" ></script>

SKILL LEVEL:  Intermediate.

Let's setup a virtual Ubuntu Desktop computer using Google Cloud Platform (GCP)  Compute Engine.

## Create a new GCP Project for this work

1.  Head over to https://console.cloud.google.com/projectcreate
2.  Enter a Project Name click ***Create***

## Create a new Ubuntu VM 
1. Make sure you're in the newly created project
2. Head over to https://console.cloud.google.com/compute/instancesAdd
3. Enter a name for the VM.  I'll use `ubuntu-desktop`
4. Select the desired compute resources.  I'll stick with a General Purpose machine of series E2.  This will cost about $25 per month to run.
5. On the left column, select the ***OS and Storage*** tab.  Click the *Change* button. Change the Operating System to `ubuntu` and change the version to `Ubuntu 20.04 LTS`.  Adjust the disk size if desired.  Click the *Select* button.
6. Click the blue *Create* button on the bottom of the page.

![Creating a GCP VM](/images/solutions/running-ubuntu-desktop-gcp-sc1.png)
![Boot Disk Config in GCP](/images/solutions/running-ubuntu-desktop-gcp-sc2.png)

## Install Chrome Remote Desktop on the new VM
1.  Connect to the VM using SSH.
2.  Update packages
    ```bash sudo apt update && sudo apt upgrade```
3.  Download and .deb installation package.
    ```bash 
    wget https://dl.google.com/linux/direct/chrome-remote-desktop_current_amd64.deb
    ```
    Install the .deb
    ```bash 
    sudo apt-get install --assume-yes ./chrome-remote-desktop_current_amd64.deb
    ```
4.  Install Simply Login Manager (SLiM) to manage the graphical display.
    ```bash
    sudo apt install slim
    ```
5.  Reboot the device
    ```bash
    sudo reboot
    ```
6.  SSH back into the VM and start the SLiM service
    ```bash
    sudo service slim start
    ```
    
## Configure Chrome Remote Desktop service
1.  Using the Chrome Browser, head on over to https://remotedesktop.google.com/headless
2.  We're going to ***Set up another computer***, so click the *Begin* button.
3.  You'll be presented instructions on installing Chrome Remote Desktop, but we've already done this.  Click *Next*.
4.  Now we need to authorize Chrome Remote Desktop to setup the VM.  Click the blue *Authorize* button.
5.  Finally, you'll be able copy a command that needs to be run on the VM.  Click the copy icon for the *Debian Linux* section.
6.  Head back into the VM using SSH and paste the command.
7.  You'll need to create a 6-digit PIN that is needed to connect to the VM's virtual desktop.  Remember this pin!

## Connect to the Ubuntu Desktop
1.  Using Google Chrome, head on over to https://remotedesktop.google.com/
2.  Ensure you're on the *Remote Access* tab.  You should see the VM listed as a remote device.
3.  Click the remote device and enter the 6-digit pin when prompted.
4.  You're now connected!