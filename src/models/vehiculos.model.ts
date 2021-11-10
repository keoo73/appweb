import {Entity, model, property, hasMany, belongsTo} from '@loopback/repository';
import {Solicitudes} from './solicitudes.model';
import {Personas} from './personas.model';

@model()
export class Vehiculos extends Entity {
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
  matricula: string;

  @property({
    type: 'string',
    required: true,
  })
  marca: string;

  @property({
    type: 'string',
    required: true,
  })
  modelo: string;

  @property({
    type: 'string',
    required: true,
  })
  categoria: string;

  @property({
    type: 'number',
    required: true,
  })
  precio: number;

  @property({
    type: 'string',
    required: true,
  })
  tipoOferta: string;

  @property({
    type: 'string',
    required: true,
  })
  encargado: string;

  @property({
    type: 'string',
    required: true,
  })
  contactoEncargado: string;

  @property({
    type: 'string',
    required: true,
  })
  foto: string;

  @property({
    type: 'string',
    required: true,
  })
  video: string;

  @property({
    type: 'string',
    required: true,
  })
  estado: string;
  @hasMany(() => Solicitudes)
  solicitudes: Solicitudes[];

  @property({
    type: 'string',
  })
  solicitudesId?: string;

  @belongsTo(() => Personas)
  personasId: string;

  constructor(data?: Partial<Vehiculos>) {
    super(data);
  }
}

export interface VehiculosRelations {
  // describe navigational properties here
}

export type VehiculosWithRelations = Vehiculos & VehiculosRelations;
