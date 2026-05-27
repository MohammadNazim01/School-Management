import uuid


def generate_receipt_number() -> str:
    return f"RCP-{uuid.uuid4().hex[:8].upper()}"


def generate_employee_id(prefix: str = "EMP") -> str:
    return f"{prefix}-{uuid.uuid4().hex[:6].upper()}"


def generate_roll_number(class_name: str, year: int, sequence: int) -> str:
    return f"{class_name[:3].upper()}{year}{sequence:04d}"
