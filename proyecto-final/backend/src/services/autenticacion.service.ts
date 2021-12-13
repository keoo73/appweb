import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Llaves} from '../config/llaves';
import {Persona} from '../models/persona.model';
import {PersonaRepository} from '../repositories';
const generador = require("password-generator");
const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    @repository(PersonaRepository)
    public personaRepositorio: PersonaRepository
  ) { }

  /*
   * Add service methods here
   */
  //GENERAR CLAVE AUTOMATICAMENTE
  GenerarClave() {                    // es automática
    let clave = generador(8, false); // el primer parametro es cuantos caracteres va a tener el pasword y el segundo si es true convinar alphanumericos y simbolos si es false solo alphanumericos
    return clave;
  }
  // CIFRAR - CODIFICAR ESA CLAVE
  cifrarClave(claveConstruida: string) {
    let claveCifrada = cryptoJS.MD5(claveConstruida).toString();     //se encrypta la contraseña a traves de MD5
    return claveCifrada;
  }

  //AUTENTICACIÓN DE LA PERSONA
  IdentificarPersona(usuario: string, clave: string) {
    //se usa try y catch por si no se conecta a la base de datos, nos muestre el codigo y ai poder resolver
    try {
      // buscamos el usuario y la contraseña
      let personaBuscada = this.personaRepositorio.findOne({where: {correoElectronico: usuario, contrasena: clave}})
      if (personaBuscada) { // si se encuentra la persona se retorna
        return personaBuscada;
      } else { // si no la encuentra retorna un false
        return false;
      }
      // si no se puede conectar a la base de datos retornar un false
    } catch {
      return false;
    }
  }

  //generación del TOKEN
  GenerarTokenJWT(persona: Persona) { // verificar que el modelo persona este importado en est archivo
    let token = jwt.sign({
      data: {// los datos con lo que se va a construir el token
        id: persona.id,
        correo: persona.correoElectronico,
        nombre: persona.nombres + " " + persona.apellidos
      }
    },
      Llaves.claveJWT);
    return token;
  }
  // validación del token
  ValidarTokenJWT(token: string) {
    try {//intenta validar lo que hay en el token en la clave coincidan
      let datos = jwt.verify(token, Llaves.claveJWT)
      return datos;
    } catch {
      return false;
    }
  }
}
