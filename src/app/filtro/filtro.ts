import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { gsap } from 'gsap';

interface Marca {
  id_mar: number;
  nom_mar: string;
}

interface Recambio {
  id_rec: number;
  id_mar: number;
  nom_mar: string;
  nom_rec: string;
  precio_rec: number;
}

@Component({
  selector: 'app-filtro',
  imports: [FormsModule, DecimalPipe],
  templateUrl: './filtro.html',
  styleUrl: './filtro.css'
})
export class Filtro implements OnInit, AfterViewInit, OnDestroy {
  marcas: Marca[] = [];
  recambios: Recambio[] = [];

  marcaSeleccionada: number | null = null;

  cargandoMarcas = true;
  cargandoRecambios = true;

  errorMarcas = '';
  errorRecambios = '';

  private apiUrl = 'http://localhost/octubre/apis/';
  private animaciones = gsap.matchMedia();

  private peticionMarcas?: Subscription;
  private peticionRecambios?: Subscription;

  constructor(
    private elemento: ElementRef<HTMLElement>,
    private zona: NgZone,
    private http: HttpClient,
    private detector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarMarcas();
    this.buscarRecambios();
  }

  cargarMarcas(): void {
    this.peticionMarcas = this.http.get<Marca[]>(
      this.apiUrl + 'marcas.php'
    ).subscribe({
      next: (marcas) => {
        this.marcas = marcas;
        this.cargandoMarcas = false;
        this.detector.markForCheck();
      },
      error: () => {
        this.errorMarcas = 'No se han podido cargar las marcas.';
        this.cargandoMarcas = false;
        this.detector.markForCheck();
      }
    });
  }

  buscarRecambios(): void {
    // Cancelamos la consulta anterior si se cambia de marca rápidamente.
    this.peticionRecambios?.unsubscribe();

    this.cargandoRecambios = true;
    this.errorRecambios = '';
    this.recambios = [];

    let url = this.apiUrl + 'buscar.php';

    if (this.marcaSeleccionada !== null) {
      url += '?id_mar=' + this.marcaSeleccionada;
    }

    this.detector.markForCheck();

    this.peticionRecambios = this.http.get<Recambio[]>(url).subscribe({
      next: (recambios) => {
        this.recambios = recambios;
        this.cargandoRecambios = false;
        this.detector.markForCheck();
      },
      error: (respuesta: HttpErrorResponse) => {
        this.errorRecambios = 'No se han podido cargar los recambios.';

        if (
          respuesta.error &&
          typeof respuesta.error.mensaje === 'string'
        ) {
          this.errorRecambios = respuesta.error.mensaje;
        }

        this.cargandoRecambios = false;
        this.detector.markForCheck();
      }
    });
  }

  mostrarTodos(): void {
    this.marcaSeleccionada = null;
    this.buscarRecambios();
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

          // Entrada coordinada de la cabecera.
          entrada.from(seleccionar('.etiqueta'), {
            y: 12,
            autoAlpha: 0
          }, 0);

          entrada.from(seleccionar('h1'), {
            y: 25,
            autoAlpha: 0
          }, 0.1);

          entrada.from(seleccionar('.descripcion'), {
            y: 15,
            autoAlpha: 0
          }, 0.2);

          // El filtro y la tabla aparecen sin depender del scroll.
          entrada.from(seleccionar('.barra-filtros'), {
            y: 20,
            autoAlpha: 0
          }, 0.3);

          entrada.from(seleccionar('.resultados'), {
            y: 25,
            autoAlpha: 0
          }, 0.45);
        },
        this.elemento.nativeElement
      );
    });
  }

  ngOnDestroy(): void {
    this.peticionMarcas?.unsubscribe();
    this.peticionRecambios?.unsubscribe();
    this.animaciones.revert();
  }
}