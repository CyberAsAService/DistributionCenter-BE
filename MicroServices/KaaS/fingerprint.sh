#!/bin/bash
while getopts a: option
do
case "${option}"
in
	a) rhosts=${OPTARG};;
esac
done
rm -f msf_fingerprint_output.txt
msfconsole -q -x "spool msf_fingerprint_output.txt;\
		use auxiliary/scanner/smb/smb_version;\
		set RHOSTS "$rhosts";\
		set VERBOSE true;\
		set DBGTRACE true;\
		run;exit;spool off;"
grep  "\[[+]\]" ./msf_fingerprint_output.txt | grep -oP "(?<=Host is running).*build:\d*\)"


