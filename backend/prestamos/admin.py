from django.contrib import admin
from .models import Book, Loan


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ["isbn", "titulo", "area_conocimiento", "ejemplares_disponibles"]
    search_fields = ["titulo", "isbn"]


@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "isbn",
        "identificacion_usuario",
        "fecha_prestamo",
        "fecha_vencimiento",
        "estado",
    ]
    list_filter = ["estado"]
