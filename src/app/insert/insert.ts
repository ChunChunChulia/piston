import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { gsap } from 'gsap';

interface Marca {
  id_mar: number;
  nom_mar: string;
}

interface Pieza {
  marca: number | null;
  nombre: string;
  precio: number | null;
}

interface RespuestaInsertar {
  mensaje: string;
  id_rec: number;
}

@Component({
  selector: 'app-insert',
  imports: [FormsModule],
  templateUrl: './insert.html',
  styleUrl: './insert.css'
})
export class Insert implements OnInit, AfterViewInit, OnDestroy {
  marcas: Marca[] = [];

  pieza: Pieza = {
    marca: null,
    nombre: '',
    precio: null
  };

  cargandoMarcas = true;
  guardando = false;
  mensaje = '';
  error = '';

  private apiUrl = 'http://localhost/octubre/apis/';
  private animaciones = gsap.matchMedia();

  constructor(
    private elemento: ElementRef<HTMLElement>,
    private zona: NgZone,
    private http: HttpClient,
    private detector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Cargamos las marcas al entrar en la pantalla.
    this.http.get<Marca[]>(this.apiUrl + 'marcas.php').subscribe({
      next: (marcas) => {
        this.marcas = marcas;
        this.cargandoMarcas = false;

        if (marcas.length === 0) {
          this.error = 'No hay marcas registradas.';
        }

        // Avisamos a Angular para actualizar el desplegable.
        this.detector.markForCheck();
      },
      error: () => {
        this.error = 'No se han podido cargar las marcas.';
        this.cargandoMarcas = false;
        this.detector.markForCheck();
      }
    });
  }

  guardarPieza(formulario: NgForm): void {
    // Evitamos enviar datos incompletos o repetir el envío.
    if (
      formulario.invalid ||
      this.cargandoMarcas ||
      this.guardando ||
      this.pieza.marca === null ||
      this.pieza.nombre.trim() === '' ||
      this.pieza.precio === null ||
      !Number.isFinite(this.pieza.precio) ||
      this.pieza.precio < 0
    ) {
      return;
    }

    this.guardando = true;
    this.mensaje = '';
    this.error = '';

    // Usamos los nombres que espera insertar.php.
    const datos = {
      id_mar: this.pieza.marca,
      nom_rec: this.pieza.nombre.trim(),
      precio_rec: this.pieza.precio
    };

    this.http.post<RespuestaInsertar>(
      this.apiUrl + 'insertar.php',
      datos
    ).subscribe({
      next: (respuesta) => {
        this.mensaje = respuesta.mensaje;
        this.guardando = false;

        // Limpiamos los campos después de guardar.
        this.pieza = {
          marca: null,
          nombre: '',
          precio: null
        };

        formulario.resetForm(this.pieza);

        // Actualizamos el mensaje y el estado del botón.
        this.detector.markForCheck();
      },
      error: (respuesta: HttpErrorResponse) => {
        this.error = 'No se ha podido guardar la pieza.';

        if (
          respuesta.error &&
          typeof respuesta.error.mensaje === 'string'
        ) {
          this.error = respuesta.error.mensaje;
        }

        this.guardando = false;
        this.detector.markForCheck();
      }
    });
  }

  ngAfterViewInit(): void {
    this.zona.runOutsideAngular(() => {
      this.animaciones.add(
        '(prefers-reduced-motion: no-preference)',
        () => {
          const seleccionar = gsap.utils.selector(
            this.elemento.nativeElement
          );

          const entrada = gsap.timeline({
            defaults: {
              duration: 0.7,
              ease: 'power3.out'
            }
          });

          // Entrada del título y la descripción.
          entrada.from(seleccionar('.introduccion .etiqueta'), {
            y: 12,
            autoAlpha: 0
          }, 0);

          entrada.from(seleccionar('.introduccion h1'), {
            y: 30,
            autoAlpha: 0
          }, 0.08);

          entrada.from(seleccionar('.descripcion'), {
            y: 15,
            autoAlpha: 0
          }, 0.18);

          // Zoom suave de la fotografía.
          entrada.from(seleccionar('.panel-imagen'), {
            scale: 1.08,
            duration: 1.3,
            ease: 'power2.out'
          }, 0);

          entrada.from(seleccionar('.panel-contenido > *'), {
            y: 20,
            autoAlpha: 0,
            stagger: 0.08
          }, 0.2);

          // Entrada coordinada del formulario.
          entrada.from(seleccionar('.formulario'), {
            y: 20,
            duration: 0.8
          }, 0.15);

          entrada.from(seleccionar('.formulario-cabecera'), {
            y: 15,
            autoAlpha: 0
          }, 0.25);

          entrada.from(seleccionar('.campo'), {
            y: 18,
            autoAlpha: 0,
            stagger: 0.09,
            duration: 0.55
          }, 0.35);

          entrada.from(seleccionar('.acciones'), {
            y: 12,
            autoAlpha: 0,
            duration: 0.5
          }, 0.65);

          entrada.from(seleccionar('.cierre'), {
            autoAlpha: 0,
            duration: 0.5
          }, 0.7);
        },
        this.elemento.nativeElement
      );
    });
  }

  ngOnDestroy(): void {
    // Limpiamos las animaciones al salir de Insertar.
    this.animaciones.revert();
  }
}