from datetime import date
from django.db import transaction
from django.db.models import Q
from .models import Book, Loan


class BookNotAvailableError(Exception):
    pass


class LoanAlreadyReturnedError(Exception):
    pass


def crear_prestamo(isbn: str, identificacion_usuario: str, fecha_vencimiento: date):
    with transaction.atomic():
        try:
            book = Book.objects.select_for_update().get(pk=isbn)
        except Book.DoesNotExist:
            raise BookNotAvailableError("El libro no existe.")

        if book.ejemplares_disponibles < 1:
            raise BookNotAvailableError(
                "No hay ejemplares disponibles para este libro."
            )

        loan = Loan.objects.create(
            isbn=book,
            identificacion_usuario=identificacion_usuario,
            fecha_vencimiento=fecha_vencimiento,
        )
        book.ejemplares_disponibles -= 1
        book.save()
        return loan


def devolver_prestamo(loan_id: int):
    with transaction.atomic():
        try:
            loan = Loan.objects.select_related("isbn").select_for_update().get(pk=loan_id)
        except Loan.DoesNotExist:
            raise LoanAlreadyReturnedError("El préstamo no existe.")

        if loan.estado == Loan.Estado.DEVUELTO:
            raise LoanAlreadyReturnedError("El libro ya fue devuelto.")

        loan.estado = Loan.Estado.DEVUELTO
        loan.save()

        book = loan.isbn
        book.ejemplares_disponibles += 1
        book.save()

        return loan


def listar_prestamos_vencidos():
    return Loan.objects.filter(
        Q(estado=Loan.Estado.ACTIVO) & Q(fecha_vencimiento__lt=date.today())
    ).select_related("isbn")
