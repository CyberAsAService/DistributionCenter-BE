from dataclasses import dataclass


@dataclass
class Endpoint:
    """Class representing endpoint."""
    address: str
    username: str