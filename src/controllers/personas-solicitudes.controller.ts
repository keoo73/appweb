import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Personas,
  Solicitudes,
} from '../models';
import {PersonasRepository} from '../repositories';

export class PersonasSolicitudesController {
  constructor(
    @repository(PersonasRepository) protected personasRepository: PersonasRepository,
  ) { }

  @get('/personas/{id}/solicitudes', {
    responses: {
      '200': {
        description: 'Array of Personas has many Solicitudes',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Solicitudes)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Solicitudes>,
  ): Promise<Solicitudes[]> {
    return this.personasRepository.solicitudes(id).find(filter);
  }

  @post('/personas/{id}/solicitudes', {
    responses: {
      '200': {
        description: 'Personas model instance',
        content: {'application/json': {schema: getModelSchemaRef(Solicitudes)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Personas.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Solicitudes, {
            title: 'NewSolicitudesInPersonas',
            exclude: ['id'],
            optional: ['personasId']
          }),
        },
      },
    }) solicitudes: Omit<Solicitudes, 'id'>,
  ): Promise<Solicitudes> {
    return this.personasRepository.solicitudes(id).create(solicitudes);
  }

  @patch('/personas/{id}/solicitudes', {
    responses: {
      '200': {
        description: 'Personas.Solicitudes PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Solicitudes, {partial: true}),
        },
      },
    })
    solicitudes: Partial<Solicitudes>,
    @param.query.object('where', getWhereSchemaFor(Solicitudes)) where?: Where<Solicitudes>,
  ): Promise<Count> {
    return this.personasRepository.solicitudes(id).patch(solicitudes, where);
  }

  @del('/personas/{id}/solicitudes', {
    responses: {
      '200': {
        description: 'Personas.Solicitudes DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Solicitudes)) where?: Where<Solicitudes>,
  ): Promise<Count> {
    return this.personasRepository.solicitudes(id).delete(where);
  }
}
