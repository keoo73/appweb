import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {AutenticacionService} from '../services';

export class EstrategiaAsesor implements AuthenticationStrategy {
  name = 'asesor';

  /**
   *
   */
  constructor(
    @service(AutenticacionService)
    public servicioAutenticacion: AutenticacionService,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token = parseBearerToken(request);
    if (token) {
      const datos = this.servicioAutenticacion.validarTokenJWT(token);
      if (datos) {
        if (datos.data.rol) {
          //Aquí se podría tener en cuenta el
          const perfil: UserProfile = Object.assign({
            nombre: datos.data.nombres,
            rol: datos.data.rol,
          });
          return perfil;
        }
      } else {
        throw new HttpErrors[401]('El token incluido no es válido');
      }
    } else {
      throw new HttpErrors[401]('No se ha incluido un token en la solicitud');
    }
  }
}
