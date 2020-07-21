#!/bin/bash
while getopts a: option
do
case "${option}"
in
	a) rhosts=${OPTARG};;
esac
done
results=$(msfconsole -q -x "use auxiliary/scanner/smb/smb_version;\
		set RHOSTS "$rhosts";\
		set VERBOSE true;\
		set DBGTRACE true;\
		run;exit" | grep  "\[[+]\]")
while IFS= read -r line; do
	ip=$(echo $line | grep -oP "\d+\.\d+\.\d+\.\d+")
	os=$(echo $line |grep -oP "(?<=Host is running).*build:\d*\)")
	echo "ip: "$ip" os:"$os""
done <<< "$results"
exit
