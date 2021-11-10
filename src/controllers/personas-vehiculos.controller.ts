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
  Vehiculos,
} from '../models';
import {PersonasRepository} from '../repositories';

export class PersonasVehiculosController {
  constructor(
    @repository(PersonasRepository) protected personasRepository: PersonasRepository,
  ) { }

  @get('/personas/{id}/vehiculos', {
    responses: {
      '200': {
        description: 'Array of Personas has many Vehiculos',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Vehiculos)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Vehiculos>,
  ): Promise<Vehiculos[]> {
    return this.personasRepository.vehiculos(id).find(filter);
  }

  @post('/personas/{id}/vehiculos', {
    responses: {
      '200': {
        description: 'Personas model instance',
        content: {'application/json': {schema: getModelSchemaRef(Vehiculos)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Personas.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vehiculos, {
            title: 'NewVehiculosInPersonas',
            exclude: ['id'],
            optional: ['personasId']
          }),
        },
      },
    }) vehiculos: Omit<Vehiculos, 'id'>,
  ): Promise<Vehiculos> {
    return this.personasRepository.vehiculos(id).create(vehiculos);
  }

  @patch('/personas/{id}/vehiculos', {
    responses: {
      '200': {
        description: 'Personas.Vehiculos PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vehiculos, {partial: true}),
        },
      },
    })
    vehiculos: Partial<Vehiculos>,
    @param.query.object('where', getWhereSchemaFor(Vehiculos)) where?: Where<Vehiculos>,
  ): Promise<Count> {
    return this.personasRepository.vehiculos(id).patch(vehiculos, where);
  }

  @del('/personas/{id}/vehiculos', {
    responses: {
      '200': {
        description: 'Personas.Vehiculos DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Vehiculos)) where?: Where<Vehiculos>,
  ): Promise<Count> {
    return this.personasRepository.vehiculos(id).delete(where);
  }
}
