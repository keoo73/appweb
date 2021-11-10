import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'DatasourceApp',
  connector: 'mongodb',
  url: 'mongodb+srv://prog_web:123@clusterprogweb.mzuza.mongodb.net/Inmobiliaria?retryWrites=true&w=majority',
  host: '',
  port: 0,
  user: '',
  password: '',
  database: '',
  useNewUrlParser: true,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DatasourceAppDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'DatasourceApp';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.DatasourceApp', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
