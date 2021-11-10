import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbAppDataSource} from '../datasources';
import {Personas, PersonasRelations, Solicitudes, Vehiculos} from '../models';
import {SolicitudesRepository} from './solicitudes.repository';
import {VehiculosRepository} from './vehiculos.repository';

export class PersonasRepository extends DefaultCrudRepository<
  Personas,
  typeof Personas.prototype.id,
  PersonasRelations
> {

  public readonly solicitudes: HasManyRepositoryFactory<Solicitudes, typeof Personas.prototype.id>;

  public readonly vehiculos: HasManyRepositoryFactory<Vehiculos, typeof Personas.prototype.id>;

  constructor(
    @inject('datasources.mongodbApp') dataSource: MongodbAppDataSource, @repository.getter('SolicitudesRepository') protected solicitudesRepositoryGetter: Getter<SolicitudesRepository>, @repository.getter('VehiculosRepository') protected vehiculosRepositoryGetter: Getter<VehiculosRepository>,
  ) {
    super(Personas, dataSource);
    this.vehiculos = this.createHasManyRepositoryFactoryFor('vehiculos', vehiculosRepositoryGetter,);
    this.registerInclusionResolver('vehiculos', this.vehiculos.inclusionResolver);
    this.solicitudes = this.createHasManyRepositoryFactoryFor('solicitudes', solicitudesRepositoryGetter,);
    this.registerInclusionResolver('solicitudes', this.solicitudes.inclusionResolver);
  }
}
