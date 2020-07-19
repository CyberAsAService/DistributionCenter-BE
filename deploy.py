import subprocess
from typing import Union, List, Tuple, Any

from endpoint import Endpoint

from pypsexec.client import Client


def run_command(remote_host: Union[Endpoint, List[Endpoint]], encrypt: bool, process: str, command: str):
    connection = Client(remote_host.ip_address, username=remote_host.username, password=remote_host.password,
                        encrypt=encrypt)
    connection.connect()
    try:
        connection.create_service()
        # After creating the service, you can run multiple exe's without
        # reconnecting

        # run a simple cmd.exe program with arguments
        return (connection.run_executable(process, run_elevated=True,
                                          arguments=command))

    except Exception as err:
        print(err)
    finally:
        connection.remove_service()
        connection.disconnect()


if __name__ == '__main__':
    print(run_command(Endpoint("192.168.182.129", username="Tal", password="babygirl"), encrypt=False,
                process='powershell.exe', command=""""""))
