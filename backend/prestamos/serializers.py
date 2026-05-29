from rest_framework import serializers
from .models import Book, Loan


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["isbn", "titulo", "area_conocimiento", "ejemplares_disponibles"]


class BookAvailabilitySerializer(serializers.ModelSerializer):
    disponible = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ["isbn", "titulo", "ejemplares_disponibles", "disponible"]

    def get_disponible(self, obj):
        return obj.ejemplares_disponibles > 0


class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = [
            "id",
            "isbn",
            "identificacion_usuario",
            "fecha_prestamo",
            "fecha_vencimiento",
            "estado",
        ]
        read_only_fields = ["id", "fecha_prestamo", "estado"]

    def validate_isbn(self, value):
        try:
            Book.objects.get(pk=value)
        except Book.DoesNotExist:
            raise serializers.ValidationError("El libro con este ISBN no existe.")
        return value

    def validate_fecha_vencimiento(self, value):
        from datetime import date

        if value <= date.today():
            raise serializers.ValidationError(
                "La fecha de vencimiento debe ser posterior a hoy."
            )
        return value


class CreateLoanSerializer(serializers.Serializer):
    isbn = serializers.CharField(max_length=13)
    identificacion_usuario = serializers.CharField(max_length=50)
    fecha_vencimiento = serializers.DateField()
