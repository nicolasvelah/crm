import { gql } from '@apollo/client';

export const QUERY_GET_WALLET_BY_ID = gql`
  query GetWalletById($id: Int!) {
    getWalletById(id: $id) {
      id
      prospect {
        name
        lastName
        phone
        cellphone
        typeIdentification
        chanel
        campaign
        socialRazon
        email
        identification
      }
      product {
        name
        marca
        modelo
        version
        anio
        color
        chassis
        motor
        cilindraje
        clase
        ramv
        ubicacionfisica
        origen
        tipo
        urlPhoto
        valorunidad
        descuentoporcentaje
        descuentovalor
        cantidad
        subtotal
        iva
        total
      }
      state
      values {
        valortotalvehiculos
        valortotalseguro
        valortotaldeposito
        valortotalaccesorios
        valortotalmantenimientos
        valortotalotros
        valortotal
        margen
        descuento
        margenfinalvalor
        margenfinalporcentaje
      }
      invoices {
        url
        name
        invoice
        walletState
      }
      ids {
        idLead
        idPrebill
      }
    }
  }
`;

export const QUERY_GET_ALL_WALLETS = gql`
  query {
    getWallets {
      id
      prospect {
        name
        lastName
        phone
        cellphone
        typeIdentification
        chanel
        campaign
        socialRazon
        email
        identification
      }
      product {
        name
        marca
        modelo
        version
        anio
        color
        chassis
        motor
        cilindraje
        clase
        ramv
        ubicacionfisica
        origen
        tipo
        urlPhoto
        valorunidad
        descuentoporcentaje
        descuentovalor
        cantidad
        subtotal
        iva
        total
      }
      state
      values {
        valortotalvehiculos
        valortotalseguro
        valortotaldeposito
        valortotalaccesorios
        valortotalmantenimientos
        valortotalotros
        valortotal
        margen
        descuento
        margenfinalvalor
        margenfinalporcentaje
      }

      ids {
        idLead
        idPrebill
      }
      createdAt
    }
  }
`;

export default class WalletQueryProvider {}
