import {Model, model, property} from '@loopback/repository';

@model()
export class Invitacion extends Model {
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
  correoEmitente: string;

  @property({
    type: 'string',
    required: true,
  })
  correoReceptor: string;

  @property({
    type: 'string',
    required: true,
  })
  asunto: string;

  @property({
    type: 'string',
    required: true,
  })
  contenido: string;


  constructor(data?: Partial<Invitacion>) {
    super(data);
  }
}

export interface InvitacionRelations {
  // describe navigational properties here
}

export type InvitacionWithRelations = Invitacion & InvitacionRelations;
