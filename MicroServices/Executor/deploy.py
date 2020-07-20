import subprocess
from typing import Union, List, Tuple, Any

from endpoint import Endpoint

WMI_FORMAT = 'wmic /user:{user} /password:{password} /node:{remote_host} process call create '
PSEXEC_FORMAT = 'PsExec.exe \\\\{remote_host} -u {remote_host}\\{user} -p {password} -accepteula -h {process} \"{command}\" '


def _run_subprocess(remote_host: Endpoint, process: str, command: str) -> subprocess.Popen:
    """
    :param remote_host:
    :param process:
    :param command:
    :return:
    """
    process_command = PSEXEC_FORMAT.format(user=remote_host.username,
                                           password=remote_host.password,
                                           remote_host=remote_host.ip_address,
                                           process=process,
                                           command=command)
    print(process_command)
    return subprocess.Popen(process_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)


def run_command(remote_host: Endpoint, process: str, command: str) -> Tuple[int, Any, Any]:
    """
    :param remote_host:
    :param process:
    :param command:
    :return:
    """

    process = _run_subprocess(remote_host, process, command)
    return process.wait(), (*process.communicate())


if __name__ == '_main_':
    print(run_command(Endpoint('192.168.182.129', 'Tal', 'babygirl'), 'powershell.exe', 'echo kaki > C:\\moshe.txt'))
