import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongodbAppDataSource} from '../datasources';
import {Solicitudes, SolicitudesRelations, Personas} from '../models';
import {PersonasRepository} from './personas.repository';

export class SolicitudesRepository extends DefaultCrudRepository<
  Solicitudes,
  typeof Solicitudes.prototype.id,
  SolicitudesRelations
> {

  public readonly personas: BelongsToAccessor<Personas, typeof Solicitudes.prototype.id>;

  constructor(
    @inject('datasources.mongodbApp') dataSource: MongodbAppDataSource, @repository.getter('PersonasRepository') protected personasRepositoryGetter: Getter<PersonasRepository>,
  ) {
    super(Solicitudes, dataSource);
    this.personas = this.createBelongsToAccessorFor('personas', personasRepositoryGetter,);
    this.registerInclusionResolver('personas', this.personas.inclusionResolver);
  }
}
