# DestributionCenter
## A new approach for the IT software distribution task
### This program makes software distribution and managment easy by implementing an Agentless* approach , a ForceDeploy* approach and some network EntityDiscovery* methods.

* Agentless - No external service or process needed(Note that some Psexec alternatives like wmi do require Windows pre-exsisting services to run).
             Every action is performed remotely using a high privleged Domain/Local user.
* ForceDeploy - This approach acknowledge the fact that no matter how capable your sysadmins are, it is bound that you will have *some* endpoints with misconfigurations.
               This means that in allmost any network you can expect to find *some* endpoints with domain connectivity, whom wont be configured properly.
               Those endpoint usually intails some changes to the endpoint configuration should be made by a sysadmin on the endpoint locally.
This Approach Automates a fix to this problem by running a 4 steps program:
  1. The Program tries to run on the endpoint with it's strong user
  1. 1If failed, the program tries to get the local admin for the endpoint from the ad by ldap, then tries to connect with him
  1. If failed, the program tries to BruteForce a local admin of the endpoint, then if succeded, tries to connect with him
  1. If failed, the program uses Os Fingerprinting technuiqes to get the os of the endpoint, then tries to use CVE's accordingly to connect to the device
* EntityDiscovery - This approach acknoledge that some devices in the internal endpoint are bound to be unmanaged by the domain, yet having access to it.
                   This approach maps the network for it's communications and creating a heat map of the network, marking the diffrent devices for their diffrent
                   attributes(managed by Ad, managed by this program, alive or dead, percentage of distribution compliance, etc...)


#### Networking Requirements:
  SMB access to all of the network devices(In order to use KaaS and Psexec/other remote shell solutions)
AD permission Requirements:
  One user with Admin Access to all endpoints whom are managed by the domain
  one user with Admin Access to all (but DC's and other HIGH RISK FACTOR servers) servers whom are managed by the domain
  
  ![alt text](https://github.com/Talanger/DistributionCenter/master/Architecture/sequence-diagram.jpg?raw=true)
