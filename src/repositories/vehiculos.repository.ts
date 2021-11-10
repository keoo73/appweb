import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbAppDataSource} from '../datasources';
import {Vehiculos, VehiculosRelations} from '../models';

export class VehiculosRepository extends DefaultCrudRepository<
  Vehiculos,
  typeof Vehiculos.prototype.id,
  VehiculosRelations
> {
  constructor(
    @inject('datasources.mongodbApp') dataSource: MongodbAppDataSource,
  ) {
    super(Vehiculos, dataSource);
  }
}
