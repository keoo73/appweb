import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Solicitudes,
  Personas,
} from '../models';
import {SolicitudesRepository} from '../repositories';

export class SolicitudesPersonasController {
  constructor(
    @repository(SolicitudesRepository)
    public solicitudesRepository: SolicitudesRepository,
  ) { }

  @get('/solicitudes/{id}/personas', {
    responses: {
      '200': {
        description: 'Personas belonging to Solicitudes',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Personas)},
          },
        },
      },
    },
  })
  async getPersonas(
    @param.path.string('id') id: typeof Solicitudes.prototype.id,
  ): Promise<Personas> {
    return this.solicitudesRepository.personas(id);
  }
}
