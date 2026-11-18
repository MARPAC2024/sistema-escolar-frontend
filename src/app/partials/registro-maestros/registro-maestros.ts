import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { MaestrosService } from '../../services/maestros-service';

@Component({
  selector: 'app-registro-maestros',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS
  ],
  templateUrl: './registro-maestros.html',
  styleUrl: './registro-maestros.scss'
})
export class RegistroMaestros implements OnInit {
  @Input() rol: string = "";
  @Input() datos_user: any = {};

  public maestro: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public token: string = "";

  // Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  // Opciones para el select de Área de investigación
  public areas: any[] = [
    { value: '1', viewValue: 'Desarrollo Web' },
    { value: '2', viewValue: 'Programación' },
    { value: '3', viewValue: 'Bases de Datos' },
    { value: '4', viewValue: 'Redes' },
    { value: '5', viewValue: 'Matemáticas' }
  ];

  // Opciones para los checkboxes de Materias
  public materias: any[] = [
    { value: '1', nombre: 'Aplicaciones Web' },
    { value: '2', nombre: 'Programación 1' },
    { value: '3', nombre: 'Bases de datos' },
    { value: '4', nombre: 'Tecnologías Web' },
    { value: '5', nombre: 'Minería de datos' },
    { value: '6', nombre: 'Desarrollo móvil' },
    { value: '7', nombre: 'Estructuras de datos' },
    { value: '8', nombre: 'Administración de redes' },
    { value: '9', nombre: 'Ingeniería de Software' },
    { value: '10', nombre: 'Administración de S.O.' }
  ];

  constructor(
    private location: Location,
    private router: Router,
    private maestrosService: MaestrosService
  ) {}

  ngOnInit(): void {
    this.maestro = this.maestrosService.esquemaMaestro();
    this.maestro.rol = this.rol;
    console.log("Datos maestro: ", this.maestro);
  }

  public regresar() {
    this.location.back();
  }

  public registrar() {
    this.errors = {};
    this.errors = this.maestrosService.validarMaestro(this.maestro, this.editar);
    if (Object.keys(this.errors).length > 0) {
      return false;
    }

    if (this.maestro.password === this.maestro.confirmar_password) {
      alert("Validación exitosa: Maestro listo para registrarse");
      console.log("Maestro a registrar: ", this.maestro);
      // Aquí irá la llamada al servicio HTTP en la siguiente práctica
    } else {
      alert("Las contraseñas no coinciden");
      this.maestro.password = "";
      this.maestro.confirmar_password = "";
    }
    return true;
  }

  public actualizar() {
    // Lógica de actualización
  }

  // Manejo de checkboxes de materias
  public checkboxChange(event: any) {
    if (event.checked) {
      this.maestro.materias_json.push(event.source.value);
    } else {
      this.maestro.materias_json.forEach((materia: any, i: number) => {
        if (materia === event.source.value) {
          this.maestro.materias_json.splice(i, 1);
        }
      });
    }
    console.log("Array materias: ", this.maestro.materias_json);
  }

  public revisarSeleccion(nombre: string) {
    if (this.maestro.materias_json) {
      const busqueda = this.maestro.materias_json.find((element: any) => element === nombre);
      return busqueda !== undefined;
    }
    return false;
  }

  public changeFecha(event: any) {
    this.maestro.fecha_nacimiento = event.value.toISOString().split("T")[0];
  }

  showPassword() {
    if (this.inputType_1 === 'password') {
      this.inputType_1 = 'text';
      this.hide_1 = true;
    } else {
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  showPwdConfirm() {
    if (this.inputType_2 === 'password') {
      this.inputType_2 = 'text';
      this.hide_2 = true;
    } else {
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (
      !(charCode >= 65 && charCode <= 90) &&
      !(charCode >= 97 && charCode <= 122) &&
      charCode !== 32
    ) {
      event.preventDefault();
    }
  }
}
