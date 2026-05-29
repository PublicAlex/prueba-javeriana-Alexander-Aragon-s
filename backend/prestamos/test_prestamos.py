import pytest
from datetime import date, timedelta
from django.db import transaction
from .models import Book, Loan
from .services import crear_prestamo, devolver_prestamo, listar_prestamos_vencidos
from .services import BookNotAvailableError, LoanAlreadyReturnedError


@pytest.fixture
def libro():
    return Book.objects.create(
        isbn="9781234567890",
        titulo="Python para Todos",
        area_conocimiento="Ciencias de la Computación",
        ejemplares_disponibles=3,
    )


@pytest.fixture
def libro_sin_stock():
    return Book.objects.create(
        isbn="9780987654321",
        titulo="Libro Agotado",
        area_conocimiento="Matemáticas",
        ejemplares_disponibles=0,
    )


@pytest.mark.django_db
class TestCrearPrestamo:
    def test_crear_prestamo_exitoso(self, libro):
        loan = crear_prestamo(
            isbn="9781234567890",
            identificacion_usuario="12345",
            fecha_vencimiento=date.today() + timedelta(days=14),
        )
        assert loan.estado == Loan.Estado.ACTIVO
        assert loan.identificacion_usuario == "12345"
        libro.refresh_from_db()
        assert libro.ejemplares_disponibles == 2

    def test_sin_stock_lanza_error(self, libro_sin_stock):
        with pytest.raises(BookNotAvailableError):
            crear_prestamo(
                isbn="9780987654321",
                identificacion_usuario="12345",
                fecha_vencimiento=date.today() + timedelta(days=14),
            )

    def test_libro_no_existe_lanza_error(self):
        with pytest.raises(BookNotAvailableError):
            crear_prestamo(
                isbn="0000000000000",
                identificacion_usuario="12345",
                fecha_vencimiento=date.today() + timedelta(days=14),
            )


@pytest.mark.django_db
class TestDevolverPrestamo:
    def test_devolucion_exitosa(self, libro):
        loan = Loan.objects.create(
            isbn=libro,
            identificacion_usuario="12345",
            fecha_vencimiento=date.today() + timedelta(days=14),
        )
        devuelto = devolver_prestamo(loan.id)
        assert devuelto.estado == Loan.Estado.DEVUELTO
        libro.refresh_from_db()
        assert libro.ejemplares_disponibles == 4

    def test_devolver_ya_devuelto_lanza_error(self, libro):
        loan = Loan.objects.create(
            isbn=libro,
            identificacion_usuario="12345",
            fecha_vencimiento=date.today() + timedelta(days=14),
            estado=Loan.Estado.DEVUELTO,
        )
        with pytest.raises(LoanAlreadyReturnedError):
            devolver_prestamo(loan.id)

    def test_devolver_inexistente_lanza_error(self):
        with pytest.raises(LoanAlreadyReturnedError):
            devolver_prestamo(9999)


@pytest.mark.django_db
class TestListarVencidos:
    def test_filtra_solo_vencidos_activos(self, libro):
        hoy = date.today()
        prestamo_vencido = Loan.objects.create(
            isbn=libro,
            identificacion_usuario="1",
            fecha_vencimiento=hoy - timedelta(days=1),
        )
        prestamo_activo = Loan.objects.create(
            isbn=libro,
            identificacion_usuario="2",
            fecha_vencimiento=hoy + timedelta(days=10),
        )
        prestamo_devuelto_vencido = Loan.objects.create(
            isbn=libro,
            identificacion_usuario="3",
            fecha_vencimiento=hoy - timedelta(days=5),
            estado=Loan.Estado.DEVUELTO,
        )
        vencidos = list(listar_prestamos_vencidos())
        assert prestamo_vencido in vencidos
        assert prestamo_activo not in vencidos
        assert prestamo_devuelto_vencido not in vencidos


@pytest.mark.django_db
class TestAPIEndpoints:
    def test_listar_libros(self, client, libro):
        response = client.get("/api/libros/")
        assert response.status_code == 200
        assert len(response.json()) == 1

    def test_consultar_disponibilidad(self, client, libro):
        response = client.get("/api/libros/9781234567890/disponibilidad/")
        assert response.status_code == 200
        data = response.json()
        assert data["disponible"] is True
        assert data["ejemplares_disponibles"] == 3

    def test_consultar_disponibilidad_no_existe(self, client):
        response = client.get("/api/libros/0000000000000/disponibilidad/")
        assert response.status_code == 404

    def test_registrar_prestamo(self, client, libro):
        response = client.post(
            "/api/prestamos/",
            {
                "isbn": "9781234567890",
                "identificacion_usuario": "12345",
                "fecha_vencimiento": str(date.today() + timedelta(days=14)),
            },
            content_type="application/json",
        )
        assert response.status_code == 201
        data = response.json()
        assert data["estado"] == "ACTIVO"
        assert data["identificacion_usuario"] == "12345"

    def test_registrar_prestamo_sin_stock(self, client, libro_sin_stock):
        response = client.post(
            "/api/prestamos/",
            {
                "isbn": "9780987654321",
                "identificacion_usuario": "12345",
                "fecha_vencimiento": str(date.today() + timedelta(days=14)),
            },
            content_type="application/json",
        )
        assert response.status_code == 409

    def test_devolver_prestamo(self, client, libro):
        loan = Loan.objects.create(
            isbn=libro,
            identificacion_usuario="12345",
            fecha_vencimiento=date.today() + timedelta(days=14),
        )
        response = client.post(f"/api/prestamos/{loan.id}/devolver/")
        assert response.status_code == 200
        assert response.json()["estado"] == "DEVUELTO"

    def test_devolver_prestamo_ya_devuelto(self, client, libro):
        loan = Loan.objects.create(
            isbn=libro,
            identificacion_usuario="12345",
            fecha_vencimiento=date.today() + timedelta(days=14),
            estado=Loan.Estado.DEVUELTO,
        )
        response = client.post(f"/api/prestamos/{loan.id}/devolver/")
        assert response.status_code == 400

    def test_listar_vencidos(self, client, libro):
        hoy = date.today()
        Loan.objects.create(
            isbn=libro,
            identificacion_usuario="1",
            fecha_vencimiento=hoy - timedelta(days=1),
        )
        response = client.get("/api/prestamos/vencidos/")
        assert response.status_code == 200
        assert len(response.json()) == 1
