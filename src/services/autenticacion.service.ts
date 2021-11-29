import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Llaves} from '../config/Llaves';
import {Personas} from '../models';
import {PersonasRepository} from '../repositories';
const generador = require('password-generator');
const cryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    /* Add @inject to inject parameters */
    @repository(PersonasRepository)
    public personaRepository: PersonasRepository,
  ) {}

  /*
   * Add service methods here
   */

  generarContrasenia() {
    //param1 = longitud de la contraseña
    //param2 = intensidad de la clav, True = mas compleja
    //generador(param1, param2)
    const contrasenia = generador(8, false);
    return contrasenia;
  }

  cifrarContrasenia(contrasenia: string) {
    const contraseniaCifrada = cryptoJS.MD5(contrasenia).toString();
    return contraseniaCifrada;
  }

  identificarPersona(usuario: string, contrasenia: string) {
    try {
      //buscando persona a identificar
      const p = this.personaRepository.findOne({
        where: {correoElectronico: usuario, contrasenia: contrasenia},
      });
      //validando si se encontró
      if (p) {
        //retornar persona
        return p;
      }
      return false;
    } catch {
      return false;
    }
  }

  //fdg
  generarTokenJWT(persona: Personas) {
    const token = jwt.sign(
      {
        data: {
          //creando estructura del token creado
          id: persona.id,
          correo: persona.correoElectronico,
          nombre: persona.nombres + ' ' + persona.apellidos,
          rol: persona.rol,
        },
      },
      Llaves.claveJWT,
    );
    return token;
  }

  validarTokenJWT(token: string) {
    try {
      const datos = jwt.verify(token, Llaves.claveJWT);
      return datos;
    } catch {
      return false;
    }
  }
}
