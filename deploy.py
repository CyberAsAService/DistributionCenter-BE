import subprocess
from typing import Union, List, Tuple, Any

from endpoint import Endpoint

from pypsexec.client import Client

def run_command(remote_host: Union[Endpoint, List[Endpoint]], process: str, command: str) -> List[Tuple[int, Any]]:
    """
    :param remote_host:
    :param process:
    :param command:
    :return:
    """
    if type(remote_host) == Endpoint:
        remote_host = [remote_host]

    processes = [_run_subprocess(host, process, command) for host in remote_host]
    return [(process.wait(), (*process.communicate())) for process in processes]

if __name__ == '__main__':

    c = Client("192.168.182.129", username="Tal", password="babygirl", encrypt=False)
    c.connect()
    try:
        c.create_service()

        # After creating the service, you can run multiple exe's without
        # reconnecting

        # run a simple cmd.exe program with arguments
        print(c.run_executable("cmd.exe",
                               arguments="/c echo Hello World"))

        # run whoami.exe as the SYSTEM account
        print(c.run_executable("whoami.exe", run_elevated=True))

    finally:
        c.remove_service()
        c.disconnect()
