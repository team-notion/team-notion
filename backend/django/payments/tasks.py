from celery import shared_task
from.utils import async_initialize_payment


@shared_task
def async_initialize_payment_task(payment_id):
    async_initialize_payment(payment_id)
