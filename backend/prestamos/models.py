from django.db import models


class Book(models.Model):
    isbn = models.CharField(max_length=13, primary_key=True)
    titulo = models.CharField(max_length=200)
    area_conocimiento = models.CharField(max_length=100)
    ejemplares_disponibles = models.IntegerField(default=0)

    class Meta:
        verbose_name = "Libro"
        verbose_name_plural = "Libros"

    def __str__(self):
        return f"{self.titulo} ({self.isbn})"


class Loan(models.Model):
    class Estado(models.TextChoices):
        ACTIVO = "ACTIVO", "Activo"
        DEVUELTO = "DEVUELTO", "Devuelto"

    isbn = models.ForeignKey(Book, on_delete=models.CASCADE, db_column="isbn")
    identificacion_usuario = models.CharField(max_length=50)
    fecha_prestamo = models.DateField(auto_now_add=True)
    fecha_vencimiento = models.DateField()
    estado = models.CharField(
        max_length=10, choices=Estado.choices, default=Estado.ACTIVO
    )

    class Meta:
        verbose_name = "Préstamo"
        verbose_name_plural = "Préstamos"

    def __str__(self):
        return f"Préstamo {self.id} - {self.isbn_id}"
