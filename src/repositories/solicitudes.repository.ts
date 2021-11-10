import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasOneRepositoryFactory} from '@loopback/repository';
import {MongodbAppDataSource} from '../datasources';
import {Solicitudes, SolicitudesRelations, Personas, Vehiculos} from '../models';
import {PersonasRepository} from './personas.repository';
import {VehiculosRepository} from './vehiculos.repository';

export class SolicitudesRepository extends DefaultCrudRepository<
  Solicitudes,
  typeof Solicitudes.prototype.id,
  SolicitudesRelations
> {

  public readonly personas: BelongsToAccessor<Personas, typeof Solicitudes.prototype.id>;

  public readonly vehiculos: HasOneRepositoryFactory<Vehiculos, typeof Solicitudes.prototype.id>;

  constructor(
    @inject('datasources.mongodbApp') dataSource: MongodbAppDataSource, @repository.getter('PersonasRepository') protected personasRepositoryGetter: Getter<PersonasRepository>, @repository.getter('VehiculosRepository') protected vehiculosRepositoryGetter: Getter<VehiculosRepository>,
  ) {
    super(Solicitudes, dataSource);
    this.vehiculos = this.createHasOneRepositoryFactoryFor('vehiculos', vehiculosRepositoryGetter);
    this.registerInclusionResolver('vehiculos', this.vehiculos.inclusionResolver);
    this.personas = this.createBelongsToAccessorFor('personas', personasRepositoryGetter,);
    this.registerInclusionResolver('personas', this.personas.inclusionResolver);
  }
}
