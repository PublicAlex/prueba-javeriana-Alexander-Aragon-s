from django.urls import path
from . import views

urlpatterns = [
    path("libros/", views.listar_libros, name="listar-libros"),
    path(
        "libros/<str:isbn>/disponibilidad/",
        views.consultar_disponibilidad,
        name="consultar-disponibilidad",
    ),
    path("prestamos/", views.registrar_prestamo, name="registrar-prestamo"),
    path(
        "prestamos/<int:loan_id>/devolver/",
        views.devolver_prestamo,
        name="devolver-prestamo",
    ),
    path(
        "prestamos/vencidos/",
        views.listar_vencidos,
        name="listar-vencidos",
    ),
]
