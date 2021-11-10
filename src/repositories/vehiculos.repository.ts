import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {MongodbAppDataSource} from '../datasources';
import {Vehiculos, VehiculosRelations, Solicitudes, Personas} from '../models';
import {SolicitudesRepository} from './solicitudes.repository';
import {PersonasRepository} from './personas.repository';

export class VehiculosRepository extends DefaultCrudRepository<
  Vehiculos,
  typeof Vehiculos.prototype.id,
  VehiculosRelations
> {

  public readonly solicitudes: HasManyRepositoryFactory<Solicitudes, typeof Vehiculos.prototype.id>;

  public readonly personas: BelongsToAccessor<Personas, typeof Vehiculos.prototype.id>;

  constructor(
    @inject('datasources.mongodbApp') dataSource: MongodbAppDataSource, @repository.getter('SolicitudesRepository') protected solicitudesRepositoryGetter: Getter<SolicitudesRepository>, @repository.getter('PersonasRepository') protected personasRepositoryGetter: Getter<PersonasRepository>,
  ) {
    super(Vehiculos, dataSource);
    this.personas = this.createBelongsToAccessorFor('personas', personasRepositoryGetter,);
    this.registerInclusionResolver('personas', this.personas.inclusionResolver);
    this.solicitudes = this.createHasManyRepositoryFactoryFor('solicitudes', solicitudesRepositoryGetter,);
    this.registerInclusionResolver('solicitudes', this.solicitudes.inclusionResolver);
  }
}
