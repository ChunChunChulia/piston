import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  NgZone
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio implements AfterViewInit, OnDestroy {
  private animaciones = gsap.matchMedia();

  constructor(
    private elemento: ElementRef<HTMLElement>,
    private zona: NgZone
  ) {}

  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollTrigger);

    // El movimiento visual no necesita actualizar los datos de Angular.
    this.zona.runOutsideAngular(() => {
      this.animaciones.add(
        '(prefers-reduced-motion: no-preference)',
        () => {
          const contenedor = this.elemento.nativeElement;
          const seleccionar = gsap.utils.selector(contenedor);

          // Entrada coordinada: fotografía, etiqueta, título y botones.
          const entrada = gsap.timeline({
            defaults: {
              duration: 0.9,
              ease: 'power3.out'
            }
          });

          entrada.from(seleccionar('.hero-imagen'), {
            scale: 1.12,
            duration: 1.6
          });

          entrada.from(seleccionar('.hero .etiqueta'), {
            y: 15,
            autoAlpha: 0
          }, 0.15);

          entrada.from(seleccionar('.hero .texto-linea'), {
            yPercent: 110,
            stagger: 0.14,
            duration: 1
          }, 0.25);

          entrada.from(seleccionar('.hero-inferior p, .hero-inferior .boton'), {
            y: 25,
            autoAlpha: 0,
            stagger: 0.12
          }, 0.85);

          // El manifiesto descubre sus elementos al entrar en pantalla.
          const manifiesto = gsap.timeline({
            scrollTrigger: {
              trigger: seleccionar('.manifiesto')[0],
              start: 'top 80%',
              toggleActions: 'play none none none'
            },
            defaults: {
              duration: 0.8,
              ease: 'power3.out'
            }
          });

          manifiesto.from(seleccionar('.manifiesto .etiqueta'), {
            x: -25,
            autoAlpha: 0
          });

          manifiesto.from(seleccionar('.manifiesto .texto-linea'), {
            yPercent: 110,
            stagger: 0.12
          }, 0.15);

          manifiesto.from(seleccionar('.manifiesto-detalle'), {
            y: 35,
            autoAlpha: 0
          }, 0.4);

          // Segunda escena: título y llamada a la acción.
          const segundaEscena = gsap.timeline({
            scrollTrigger: {
              trigger: seleccionar('.foto-seccion')[0],
              start: 'top 75%',
              toggleActions: 'play none none none'
            },
            defaults: {
              duration: 0.9,
              ease: 'power3.out'
            }
          });

          segundaEscena.from(seleccionar('.foto-seccion .etiqueta'), {
            y: 20,
            autoAlpha: 0
          });

          segundaEscena.from(seleccionar('.foto-seccion .texto-linea'), {
            yPercent: 110,
            stagger: 0.15
          }, 0.15);

          segundaEscena.from(seleccionar('.foto-seccion .boton'), {
            y: 25,
            autoAlpha: 0
          }, 0.65);

          // La flecha de cierre gira al recorrer la franja.
          gsap.from(seleccionar('.franja span:last-child'), {
            rotation: -90,
            ease: 'none',
            scrollTrigger: {
              trigger: seleccionar('.franja')[0],
              start: 'top bottom',
              end: 'bottom 75%',
              scrub: 1
            }
          });
        },
        this.elemento.nativeElement
      );

      // Parallax solo en pantallas grandes y sin movimiento reducido.
      this.animaciones.add(
        '(min-width: 901px) and (prefers-reduced-motion: no-preference)',
        () => {
          const seleccionar = gsap.utils.selector(
            this.elemento.nativeElement
          );

          gsap.fromTo(seleccionar('.hero-imagen'), {
            yPercent: -5
          }, {
            yPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: seleccionar('.hero')[0],
              start: 'top top',
              end: 'bottom top',
              scrub: 1
            }
          });

          gsap.fromTo(seleccionar('.foto-seccion-imagen'), {
            yPercent: -5
          }, {
            yPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: seleccionar('.foto-seccion')[0],
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1
            }
          });
        },
        this.elemento.nativeElement
      );
    });
  }

  ngOnDestroy(): void {
    // Elimina las animaciones de Inicio al cambiar de ruta.
    this.animaciones.revert();
  }
}