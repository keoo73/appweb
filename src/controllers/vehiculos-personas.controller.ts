import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Vehiculos,
  Personas,
} from '../models';
import {VehiculosRepository} from '../repositories';

export class VehiculosPersonasController {
  constructor(
    @repository(VehiculosRepository)
    public vehiculosRepository: VehiculosRepository,
  ) { }

  @get('/vehiculos/{id}/personas', {
    responses: {
      '200': {
        description: 'Personas belonging to Vehiculos',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Personas)},
          },
        },
      },
    },
  })
  async getPersonas(
    @param.path.string('id') id: typeof Vehiculos.prototype.id,
  ): Promise<Personas> {
    return this.vehiculosRepository.personas(id);
  }
}
