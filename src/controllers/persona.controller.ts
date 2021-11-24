import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Llaves} from '../config/Llaves';
import {Credenciales, Personas} from '../models';
import {PersonasRepository} from '../repositories';
import {AutenticacionService} from '../services';

const fetch = require('node-fetch');

export class PersonaController {
  constructor(
    @repository(PersonasRepository)
    public personasRepository: PersonasRepository,
    //importando servicio de autenticacion
    @service(AutenticacionService)
    public servicioAutenticacion: AutenticacionService,
  ) {}

  @post('/identificarPersona', {
    responses: {
      '200': {
        description: 'Identificacion de usuarios',
      },
    },
  })
  async identificarPersona(@requestBody() credenciales: Credenciales) {
    const p = await this.servicioAutenticacion.identificarPersona(
      credenciales.usuario,
      credenciales.contrasenia,
    );
    if (p) {
      const token = this.servicioAutenticacion.generarTokenJWT(p);
      return {
        datos: {
          nombre: p.nombres,
          correo: p.correoElectronico,
          id: p.id,
        },
        tk: token,
      };
    } else {
      throw new HttpErrors[401]('Datos Inválidos');
    }
  }

  @post('/personas')
  @response(200, {
    description: 'Personas model instance',
    content: {'application/json': {schema: getModelSchemaRef(Personas)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Personas, {
            title: 'NewPersonas',
            exclude: ['id'],
          }),
        },
      },
    })
    personas: Omit<Personas, 'id'>,
  ): Promise<Personas> {
    const contrasenia = this.servicioAutenticacion.generarContrasenia();
    const contraseniaCifrada =
      this.servicioAutenticacion.cifrarContrasenia(contrasenia);
    personas.contrasenia = contraseniaCifrada;

    //return this.personasRepository.create(personas);
    const p = await this.personasRepository.create(personas);

    //Notificacion al usuario
    const destino = personas.correoElectronico;
    const asunto = 'Registro en la app Pedidos';
    const contenido = `Hola, ${personas.nombres}, su nombre de usuario es: ${personas.correoElectronico} y la contraseña para el acceso a la app es: ${personas.contrasenia}`;

    fetch(
      `${Llaves.urlServiceNotificaciones}/envio-correo?correo_destino = ${destino}&asunto = ${asunto}&contenido = ${contenido}`,
    ).then((data: any) => {
      console.log(data);
    });

    return p;
  }

  @get('/personas/count')
  @response(200, {
    description: 'Personas model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Personas) where?: Where<Personas>): Promise<Count> {
    return this.personasRepository.count(where);
  }

  @get('/personas')
  @response(200, {
    description: 'Array of Personas model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Personas, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Personas) filter?: Filter<Personas>,
  ): Promise<Personas[]> {
    return this.personasRepository.find(filter);
  }

  @patch('/personas')
  @response(200, {
    description: 'Personas PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Personas, {partial: true}),
        },
      },
    })
    personas: Personas,
    @param.where(Personas) where?: Where<Personas>,
  ): Promise<Count> {
    return this.personasRepository.updateAll(personas, where);
  }

  @get('/personas/{id}')
  @response(200, {
    description: 'Personas model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Personas, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Personas, {exclude: 'where'})
    filter?: FilterExcludingWhere<Personas>,
  ): Promise<Personas> {
    return this.personasRepository.findById(id, filter);
  }

  @patch('/personas/{id}')
  @response(204, {
    description: 'Personas PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Personas, {partial: true}),
        },
      },
    })
    personas: Personas,
  ): Promise<void> {
    await this.personasRepository.updateById(id, personas);
  }

  @put('/personas/{id}')
  @response(204, {
    description: 'Personas PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() personas: Personas,
  ): Promise<void> {
    await this.personasRepository.replaceById(id, personas);
  }

  @del('/personas/{id}')
  @response(204, {
    description: 'Personas DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.personasRepository.deleteById(id);
  }
}
