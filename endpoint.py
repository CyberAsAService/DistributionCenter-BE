from dataclasses import dataclass


@dataclass
class Endpoint:
    """Class representing endpoint."""
    ip_address: str
    username: str
    password: str
