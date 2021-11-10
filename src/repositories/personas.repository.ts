import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbAppDataSource} from '../datasources';
import {Personas, PersonasRelations, Solicitudes} from '../models';
import {SolicitudesRepository} from './solicitudes.repository';

export class PersonasRepository extends DefaultCrudRepository<
  Personas,
  typeof Personas.prototype.id,
  PersonasRelations
> {

  public readonly solicitudes: HasManyRepositoryFactory<Solicitudes, typeof Personas.prototype.id>;

  constructor(
    @inject('datasources.mongodbApp') dataSource: MongodbAppDataSource, @repository.getter('SolicitudesRepository') protected solicitudesRepositoryGetter: Getter<SolicitudesRepository>,
  ) {
    super(Personas, dataSource);
    this.solicitudes = this.createHasManyRepositoryFactoryFor('solicitudes', solicitudesRepositoryGetter,);
    this.registerInclusionResolver('solicitudes', this.solicitudes.inclusionResolver);
  }
}
