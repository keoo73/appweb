import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {AutenticacionService} from '../services';


export class EstrategiaAdministrador implements AuthenticationStrategy {
  name: string = 'admin';

  //metodo constructor
  constructor(
    @service(AutenticacionService) //ve y usa la clase AutenticacionService
    public servicioAutenticacion: AutenticacionService //aqui creo un objeto de tipo servicio de autenticacion para poder acceder a el
  ) { }

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    let token = parseBearerToken(request);//con el token dar autorizaciones
    if (token) {
      let datos = this.servicioAutenticacion.ValidarTokenJWT(token);
      if (datos) {
        let perfil: UserProfile = Object.assign({ // creamos una variable perfil que es dde tipo userprofile, le asignamos un objeto y le damos un nombre
          nombre: datos.data.nombre
        });
        return perfil;
      } else {
        throw new HttpErrors[401]("El token suministrado no es válido") // muestra en pantalla en el frontend
      }
    } else {
      throw new HttpErrors[401]("No hay un token en la solicitud") // muestra en pantalla en el frontend
    }
  }
}
