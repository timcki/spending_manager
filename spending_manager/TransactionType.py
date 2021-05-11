from enum import IntEnum


class TransactionType(IntEnum):
    EXPENSE = 1
    INCOME = 2
    TRANSFER = 3
    LENT = 4
    BORROWED = 5
