import { gql } from '@apollo/client';
import apolloClient from '..';
import { ReturnCreateTracing } from '../../../repositories-interfaces/tracings-repository-interface';

export interface TracingInput {
  type: string;
  motive: string;
  priority: string;
  executionDate: string;
  closeDate: string | null;
  openingNote: string | null;
  closeNote: string | null;
}

export interface TracingInputUpdate {
  closeDate: string | null;
  closeNote: string | null;
}

export const MUTATION_CREATE_TRACING = gql`
  mutation CreatTracing(
    $idUser: Int!
    $identificationClient: String!
    $TracingInsert: TracingInput!
    $idLead: Int!
  ) {
    creatTracing(
      TracingInsert: $TracingInsert
      identificationClient: $identificationClient
      idUser: $idUser
      idLead: $idLead
    ){
      idTracing
      linksOffice365 {
        link
      }
    }
  }
`;

export const MUTATION_CLOSE_TRACING = gql`
  mutation CloseTracing($idInput: Int!, $TracingUpdate: TracingInputUpdate!) {
    closeTracing(idInput: $idInput, TracingUpdate: $TracingUpdate)
  }
`;

export default class TracingMutationProvider {
  creatTracing = async (
    tracingInsert: TracingInput,
    identificationClient: string,
    idUser: number,
    idLead: number
  ): Promise<{ ok: boolean; message: string; respTracing?: ReturnCreateTracing }> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_CREATE_TRACING,
        variables: {
          TracingInsert: tracingInsert,
          identificationClient,
          idUser,
          idLead,
        },
      });
      if (errors) return { ok: false, message: errors[0].message };
      //console.log('Creat Tracing', data);
      return { ok: true, message: 'ok', respTracing: data.creatTracing };
    } catch (error) {
      //console.log('Error en create tracing', error.message);
      return { ok: false, message: error.message };
    }
  };

  closeTracing = async (
    idInput: number,
    tracingUpdate: TracingInputUpdate
  ): Promise<string> => {
    const { errors, data } = await apolloClient.mutate({
      variables: {
        idInput,
        TracingUpdate: tracingUpdate,
      },
      mutation: MUTATION_CLOSE_TRACING,
    });
    if (errors) return 'Error al cerrar seguimiento';
    //console.log('Close Tracing', data);
    return 'Seguimiento Cerrado';
  };
}
