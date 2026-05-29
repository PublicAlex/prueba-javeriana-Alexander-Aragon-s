from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Book, Loan
from .serializers import (
    BookSerializer,
    BookAvailabilitySerializer,
    LoanSerializer,
    CreateLoanSerializer,
)
from .services import crear_prestamo as service_crear_prestamo
from .services import devolver_prestamo as service_devolver_prestamo
from .services import listar_prestamos_vencidos as service_listar_vencidos
from .services import BookNotAvailableError, LoanAlreadyReturnedError


@api_view(["GET"])
def listar_libros(request):
    libros = Book.objects.all()
    serializer = BookSerializer(libros, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def consultar_disponibilidad(request, isbn):
    libro = get_object_or_404(Book, pk=isbn)
    serializer = BookAvailabilitySerializer(libro)
    return Response(serializer.data)


@api_view(["POST"])
def registrar_prestamo(request):
    serializer = CreateLoanSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        loan = service_crear_prestamo(
            isbn=serializer.validated_data["isbn"],
            identificacion_usuario=serializer.validated_data[
                "identificacion_usuario"
            ],
            fecha_vencimiento=serializer.validated_data["fecha_vencimiento"],
        )
    except BookNotAvailableError as e:
        return Response({"error": str(e)}, status=status.HTTP_409_CONFLICT)

    output = LoanSerializer(loan)
    return Response(output.data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
def devolver_prestamo(request, loan_id):
    try:
        loan = service_devolver_prestamo(loan_id)
    except LoanAlreadyReturnedError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    output = LoanSerializer(loan)
    return Response(output.data)


@api_view(["GET"])
def listar_vencidos(request):
    loans = service_listar_vencidos()
    serializer = LoanSerializer(loans, many=True)
    return Response(serializer.data)
