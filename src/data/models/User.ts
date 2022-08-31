import Leads from './Leads';

export interface ConsesionarioInterface {
  codigo: string;
  descripcion: string;
  id_cot_cliente: number;
  id_lista_precio: number;
  sucursal: Array<{ id_sucursal: number; sucursal: string; ciudad: string }>;
}

export enum UserType {
  JEFE_VENTAS = 'JEFE DE VENTAS',
  ASESOR = 'ASESOR COMERCIAL',
  CALLCENTER = 'CALL CENTER',
  F_Y_I = 'F&I',
  CARTERA = 'CARTERA',
  ADMINISTRADOR = 'ADMINISTRADOR',
  GERENTE = 'GERENTE DE MARCA',
}
export default interface User {
  id?: number;

  chiefs?: Number[];

  codUsuario?: string;

  nombre?: string;

  apellido?: string;

  dealer?: Array<ConsesionarioInterface>;

  role?: string;

  concessionaire?: string;

  concesionario?: string[];

  sucursal?: string[];

  brand?: string[];

  CRMTransactionToken?: string;

  timeExpiration?: string;

  empresa?: string;

  updateAt?: string;

  createdAt?: string;

  leads?: Leads[];

  typeConcessionaire?: { code?: string; type?: string };

  available?: boolean;

  email?: string;

  phone?: string;
}
