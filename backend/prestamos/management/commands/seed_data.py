from django.core.management.base import BaseCommand
from prestamos.models import Book


class Command(BaseCommand):
    help = "Carga libros de ejemplo en la base de datos"

    def handle(self, *args, **options):
        books = [
            Book(
                isbn="9780134685991",
                titulo="Estructuras de Datos y Algoritmos",
                area_conocimiento="Ciencias de la Computación",
                ejemplares_disponibles=5,
            ),
            Book(
                isbn="9788426725341",
                titulo="Introducción a la Programación con Python",
                area_conocimiento="Ingeniería de Sistemas",
                ejemplares_disponibles=3,
            ),
            Book(
                isbn="9789587845671",
                titulo="Matemáticas Discretas",
                area_conocimiento="Matemáticas",
                ejemplares_disponibles=0,
            ),
            Book(
                isbn="9788478290513",
                titulo="Física Universitaria",
                area_conocimiento="Física",
                ejemplares_disponibles=2,
            ),
            Book(
                isbn="9788429151331",
                titulo="Química General",
                area_conocimiento="Química",
                ejemplares_disponibles=4,
            ),
        ]
        Book.objects.bulk_create(books, ignore_conflicts=True)
        self.stdout.write(self.style.SUCCESS(f"Se cargaron {len(books)} libros de ejemplo."))
