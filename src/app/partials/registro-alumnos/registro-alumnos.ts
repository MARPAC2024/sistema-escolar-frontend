import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { AlumnosService } from '../../services/alumnos-service';

@Component({
  selector: 'app-registro-alumnos',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS
  ],
  templateUrl: './registro-alumnos.html',
  styleUrl: './registro-alumnos.scss'
})
export class RegistroAlumnos implements OnInit {
  @Input() rol: string = "";
  @Input() datos_user: any = {};

  public alumno: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public token: string = "";

  // Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  constructor(
    private location: Location,
    private router: Router,
    private alumnosService: AlumnosService
  ) {}

  ngOnInit(): void {
    this.alumno = this.alumnosService.esquemaAlumno();
    this.alumno.rol = this.rol;
    console.log("Datos alumno: ", this.alumno);
  }

  public regresar() {
    this.location.back();
  }

  public registrar() {
    this.errors = {};
    this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);
    if (Object.keys(this.errors).length > 0) {
      return false;
    }

    // Validar coincidencia de contraseñas
    if (this.alumno.password === this.alumno.confirmar_password) {
      alert("Validación exitosa: Alumno listo para registrarse");
      console.log("Alumno a registrar: ", this.alumno);
      // Aquí irá la llamada al servicio HTTP en la siguiente práctica
    } else {
      alert("Las contraseñas no coinciden");
      this.alumno.password = "";
      this.alumno.confirmar_password = "";
    }
    return true;
  }

  public actualizar() {
    // Lógica de actualización
  }

  // Funciones para password
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

  // Función para detectar el cambio de fecha del Datepicker
  public changeFecha(event: any) {
    console.log(event);
    this.alumno.fecha_nacimiento = event.value.toISOString().split("T")[0];
  }

  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 32                         // Espacio
    ) {
      event.preventDefault();
    }
  }
}
