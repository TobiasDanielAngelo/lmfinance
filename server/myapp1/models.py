from . import fields


class Report(fields.CustomModel):
    month_year = fields.MonthYearField(unique=True)
    beginning_balance = fields.AmountField()
    ending_balance = fields.AmountField()
    beginning_cash_on_hand = fields.AmountField()
    beginning_cash_on_bank = fields.AmountField()
    ending_cash_on_hand = fields.AmountField()
    ending_cash_on_bank = fields.AmountField()
    hand_additions = fields.AmountField()
    bank_additions = fields.AmountField()
    created_at = fields.AutoCreatedAtField()


class Member(fields.CustomModel):
    first_name = fields.ShortCharField(display=True)
    last_name = fields.ShortCharField(display=True)
    date_added = fields.DefaultTodayField()
    is_active = fields.DefaultBooleanField(True)

    class Meta:
        unique_together = ("first_name", "last_name")


class Collection(fields.CustomModel):
    collection_date = fields.DefaultTodayField()
    member = fields.SetNullOptionalForeignKey("Member")
    receipt_number = fields.ShortCharField(display=True, unique=True, blank=False)
    created_at = fields.AutoCreatedAtField()
    start_month = fields.MonthYearField()
    end_month = fields.MonthYearField()
    amount = fields.AmountField()


class Income(fields.CustomModel):
    date_added = fields.DefaultTodayField()
    amount = fields.AmountField()
    notes = fields.LongCharField()


class Expense(fields.CustomModel):
    date_added = fields.DefaultTodayField()
    amount = fields.AmountField()
    notes = fields.LongCharField()


class Transfer(fields.CustomModel):
    date_added = fields.DefaultTodayField()
    amount = fields.AmountField()
    to_bank = fields.DefaultBooleanField(True)
    notes = fields.LongCharField()


class Setting(fields.CustomModel):
    key = fields.ShortCharField(unique=True, display=True)
    value = fields.LongCharField()
    description = fields.MediumCharField()
