import {Entity, model, property, belongsTo, hasOne} from '@loopback/repository';
import {Personas} from './personas.model';
import {Vehiculos} from './vehiculos.model';

@model()
export class Solicitudes extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  departamento: string;

  @property({
    type: 'string',
    required: true,
  })
  ciudad: string;

  @property({
    type: 'string',
    required: true,
  })
  direccion: string;

  @property({
    type: 'string',
    required: true,
  })
  tipo: string;

  @property({
    type: 'string',
    required: true,
  })
  contratoAceptado: string;

  @property({
    type: 'string',
    required: true,
  })
  contratoCargado: string;

  @belongsTo(() => Personas)
  personasId: string;

  @property({
    type: 'string',
  })
  vehiculosId?: string;

  @hasOne(() => Vehiculos)
  vehiculos: Vehiculos;

  constructor(data?: Partial<Solicitudes>) {
    super(data);
  }
}

export interface SolicitudesRelations {
  // describe navigational properties here
}

export type SolicitudesWithRelations = Solicitudes & SolicitudesRelations;
