import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbAppDataSource} from '../datasources';
import {Solicitudes, SolicitudesRelations} from '../models';

export class SolicitudesRepository extends DefaultCrudRepository<
  Solicitudes,
  typeof Solicitudes.prototype.id,
  SolicitudesRelations
> {
  constructor(
    @inject('datasources.mongodbApp') dataSource: MongodbAppDataSource,
  ) {
    super(Solicitudes, dataSource);
  }
}
