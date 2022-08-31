import moment from 'moment';
import { NewCreditGlobalState } from '../../pages/lead/steps/new-credit-application/new-credit-controller';
import auth from '../auth';
import Leads, { Inquiry } from '../../data/models/Leads';
import Client from '../../data/models/Client';
import Quotes from '../../data/models/Quotes';

import {
  currenyFormat,
  calcTotal,
  subTotal,
  calcLegals,
  netType,
} from '../extras';
import { Vehicle } from '../../data/models/Vehicle';
import User from '../../data/models/User';

const templateWorkShop = (
  dataLead: Leads,
  data: Inquiry[],
  client: Client,
  idLead: number,
  //concessionaire?: string,
  dealerData: {
    sucursal: {
      name: string;
      code: string;
    };
    concesionario: {
      name: string;
      code: string;
    };
    name: string;
  }
) => {
  let iquiryData = '';

  const isRedInterna =
    netType(dealerData.concesionario.code).toLowerCase() === 'red interna';
  //console.log({ client, isRedInterna });

  const { user } = auth;
  //console.log({ user });

  data.map((dat) => {
    iquiryData += `<tr>
      <td>
        <b>${
          dat.question === 'clientType' ? 'Tipo de Cliente' : dat.question
        }</b>
      </td>
    </tr>
    <tr>
      <td>
        ${dat.answer === '' ? '--' : dat.answer}
      </td>
    </tr>`;

    return true;
  });

  const template = `
  <table
      style="
        margin: auto;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 10px;
        text-align:left;
        width: 600px;
      "
      bodero="0"
      cellpadding="2"
      cellspacing="0"
    >
   
      <tr>
        <td colspan="2" style="text-align: center;">
        ${
          isRedInterna
            ? `<p
        style="
        text-align: center;
        margin: 20px 0px 10px;
      "
      >
        <img
          src="http://corpCRM.com.ec/wp-content/uploads/2018/08/01-logo-CRM-2.png"
          width="170"
          alt="CRM"
        />
      </p>`
            : ''
        }
          
        </td>
      </tr>
      <tr>
      <th style="  font-size: 16px; text-align: center" colspan="2">
        ${dealerData.concesionario.name}
      </th>
    </tr>
      <tr>
        <td valign="top">
          <table
            style="
              font-size: 10px;
              text-align:left;
            "
          >
            <tr>
              <th style="text-align: left; font-size:14px;">Indagación</th>
            </tr>
            ${iquiryData}
          </table>
        </td>
        <td valign="top">
          <table
            style="
              margin: auto;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 10px;
              text-align:right;
            "
          >
            <tr>
              <td><b>Hoja de trabajo Nro ${idLead}</b></td>
            </tr>
            <tr><td><b>Fecha:</b> ${moment().format(
              'DD-MM-YYYY HH:mm'
            )}</td></tr>
            <tr>
              <td></td>
            </tr>
            <tr>
              <th style="font-size:16px;">Cliente</th>
            </tr>
            <tr>
              <td><b>Nombre:</b> ${client.name} ${client.lastName}</td>
            </tr>
            <tr>
              <td><b>Email:</b> ${client.email}</td>
            </tr>
            <tr>
              <td><b>Celular:</b> ${client.cellphone}</td>
            </tr>
            <tr>
              <td><b>Canal:</b> ${client.chanel}</td>
            </tr>
            <tr>
              <td><b>Campaña:</b> ${dataLead.campaign}</td>
            </tr>
            <tr>
              <td></td>
            </tr>
            <tr>
              <th style="font-size:16px;">Asesor</th>
            </tr>
            <tr>
              <td><b>Nombre:</b> ${user.nombre} ${user.apellido}</td>
            </tr>
            <tr>
              <td><b>Sucursal:</b> ${user.dealer[0].sucursal[0].sucursal}
              </td>
            </tr>
            <tr>
              <td><b>Concesionario:</b> ${user.dealer[0].descripcion}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <hr />
          <p
            style="
              text-align: center;
              margin: 10px 0px 20px;
            "
          >
            Usa esta hoja para tomar apuntes de información importante para poder cerrar el negocio.
          </p>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <table
            style="
              margin: auto;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 10px;
              text-align:left;
              width: 600px;
              height: 600px;
            "
            bodero="0"
            cellpadding="2"
            cellspacing="0"
          >
            <tr>
              <td
                style="
                  border-right: 1px solid black;
                  border-bottom: 1px solid black;
                  width: 50%;
                "
              ></td>
              <td
                style="
                  border-bottom: 1px solid black;
                  width: 50%;
                "
              ></td>
            </tr>
            <tr>
              <td
                style="
                  border-right: 1px solid black;
                "
              ></td>
              <td
                style="
                "
              ></td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  return template;
};

const templateNewCredit = (
  data: NewCreditGlobalState,
  concesionarioCode?: string,
  typeConcessionaire?: string,
  observationsFyI?: string,
  vehicleFleets?: Vehicle[]
) => {
  //console.log('data disponible para imprimir', data);
  let isRedInterna =
    !!concesionarioCode &&
    netType(concesionarioCode).toLowerCase() === 'red interna';

  if (
    typeConcessionaire &&
    typeConcessionaire.toLowerCase() === 'red interna'
  ) {
    isRedInterna = true;
  }

  console.log('vehicleFleets -->', vehicleFleets);
  let vehicleFleetsTemplate = vehicleFleets
    ?.map((vh) => {
      console.log('vehicleF', vh);

      return `<p
        style="
        text-align: left;
        font-size: 13px;
        font-weight: normal;
        padding-left: 20px;
        margin: 10px 0px 10px;
        color: gray;
        line-height: 20px;
        background-color: #F0F2F5;
        border-radius: 10px;
        margin-left: 20px;
      "
      >
        <b>Marca:</b> <span>${vh.brand ?? ''}</span>
        <br />
        <b>Modelo:</b> <span>${vh.model ?? ''}</span>
        <br />
        <b>Versión:</b> <span>${vh.description ?? ''}</span>
        <br />
        <b>Año:</b> <span>${vh.year ?? ''}</span>
        <br />
        <b>Servicios:</b> <span>${
          vh.totalServices
            ? currenyFormat(Number(vh.totalServices), true)
            : currenyFormat(0, true)
        }</span>
        <br />
      
        <b>Accesorios:</b> <span>${
          vh.value
            ? currenyFormat(Number(vh.totalAccesories), true)
            : currenyFormat(0, true)
        }</span>
        <br />
        
        <!--<b>Precio vehículo:</b> <span>${
          vh.value ? currenyFormat(Number(vh.value), true) : ''
        }</span>
        <br />-->
        <b>PVP vehículo:</b> <span>${
          vh.value ? currenyFormat(vh.value * 1.12, true) : ''
        } inc. IVA</span>
        <br />
        <b>Monto a financiar:</b>
        <span>${
          vh.financing ? currenyFormat(Number(vh.financing), true) : ''
        }</span>
        <br />
        <b>Entrada:</b> <span>${
          currenyFormat(Number(vh.entrada), true) ?? ''
        }</span>
        <br />
        <b>Plazo:</b> <span>${vh.plazo ?? ''} meses</span>
        <br />
        <!--<b>Tasa:</b> <span>${vh.tasa ?? ''}%</span>
        <br />
        <b>Cuota mensual:</b>
        <span>${currenyFormat(Number(vh.monthlyPayments), true) ?? ''}</span>-->
    </p>`;
    })
    .reduce((accumulator, currentValue) => accumulator + currentValue, '');

  const totalFlota = vehicleFleets?.reduce((acumulador, valorActual) => {
    return acumulador + (valorActual.financing ?? 0);
  }, 0);

  vehicleFleetsTemplate += `<p 
    style="
      text-align: center;
      font-weight: bold;
      padding-left: 20px;
      margin: 20px 0px 10px;
    "
  > 
    <b>Monto total a financiar:</b> 
    <span>${currenyFormat(Number(totalFlota), true)}
    </span>
  </p>`;
  //console.log('isRedInterna', isRedInterna);
  const template = `<table
  width="600"
  border="0"
  style="
  width: 600px;
  margin: 0 auto 40px;
  font-family: Arial, Helvetica, sans-serif;
  "
  cellpadding="0"
  cellspacing="0"
>
  <tr>
    <td colspan="3">
    ${
      isRedInterna
        ? `<p
    style="
    text-align: center;
    padding-left: 20px;
    margin: 20px 0px 10px;
  "
  >
    <img
      src="http://corpCRM.com.ec/wp-content/uploads/2018/08/01-logo-CRM-2.png"
      width="170"
      alt="CRM"
    />
  </p>`
        : ''
    }
      
    </td>
  </tr>
  <tr>
    <td colspan="3">
      <p
        style="
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        padding-left: 20px;
        margin: 20px 0px 10px;
        color: #f89829;
      "
      >
        Solicitud de crédito
      </p>
    </td>
  </tr>
  <tr>
    
    <td colspan="3">
      <p
        style="
        text-align: left;
        font-size: 13px;
        font-weight: normal;
        padding-left: 20px;
        margin: 20px 0px 10px;
        color: gray;
        line-height: 20px;
      "
      >
        <b>Concesionario:</b>
        <span>${data.applicant.concessionaire ?? ''}</span>
        <br />
        <b>Sucursal:</b>
        <span>${data.applicant.sucursal ?? ''}</span>
        <br />
        <b>Asesor Comercial:</b>
        <span>${data.applicant.businessAdvisor ?? ''}</span>
        <br />
        <b>Lugar y Fecha:</b>
        <span>${data.applicant.placeAndDate ?? ''}</span>
        <br />
        <b>Tipo de solicitd:</b>
        <span>${vehicleFleets ? 'Flota' : 'Cotización'}</span>
      </p>
    </td>
  </tr>
  <tr>
    <td valign="top">
      <p
        style="
        text-align: left;
        font-size: 15px;
        font-weight: bold;
        padding-left: 20px;
        margin: 20px 0px 10px;
        color: black;
        line-height: 20px;
      "
      >
        Datos del Solicitante
      </p>
      <p
        style="
        text-align: left;
        font-size: 13px;
        font-weight: normal;
        padding-left: 20px;
        margin: 10px 0px 10px;
        color: gray;
        line-height: 20px;
      "
      >
        <b>Nombres:</b> <span>${data.applicant.names ?? ''}</span>
        <br />
        <b>Apellidos:</b> <span>${data.applicant.lastNames ?? ''}</span>
        <br />
        <b>Cédula:</b> <span>${data.applicant.identification ?? ''}</span>
        <br />
        <b>Teléfono celular:</b> <span>${
          data.currentAddress.cellPhone ?? ''
        }</span>
        <br />
        <b>Fecha de nacimiento:</b>
        <span>${data.applicant.dateOfBirth ?? ''}</span>
        <br />
        <b>Lugar de nacimiento:</b>
        <span>${data.applicant.placeOfBirth ?? ''}</span>
        <br />
        <b>Nacionalidad:</b>
        <span>${data.applicant.nationality ?? ''}</span>
        <br />
        <b>Estado civil:</b>
        <span>${data.applicant.civilStatus ?? ''}</span>
      </p>
    </td>

    <td valign="top">
      <p
        style="
        text-align: left;
        font-size: 15px;
        font-weight: bold;
        padding-left: 20px;
        margin: 20px 0px 10px;
        color: black;
        line-height: 20px;
      "
      >
        Datos del Vehículo
      </p>
      ${
        vehicleFleets
          ? vehicleFleetsTemplate
          : `
      <p
        style="
        text-align: left;
        font-size: 13px;
        font-weight: normal;
        padding-left: 20px;
        margin: 10px 0px 10px;
        color: gray;
        line-height: 20px;
      "
      >
        <b>Marca:</b> <span>${data.vehicleData.brand ?? ''}</span>
        <br />
        <b>Modelo:</b> <span>${data.vehicleData.model ?? ''}</span>
        <br />
        <b>Versión:</b> <span>${data.vehicleData.description ?? ''}</span>
        <br />
        <b>Año:</b> <span>${data.vehicleData.year ?? ''}</span>
        <br />
        <b>Servicios:</b> <span>${
          data.vehicleData.totalServices
            ? currenyFormat(Number(data.vehicleData.totalServices), true)
            : currenyFormat(0, true)
        }</span>
        <br />
       
        <b>Accesorios:</b> <span>${
          data.vehicleData.value
            ? currenyFormat(Number(data.vehicleData.totalAccesories), true)
            : currenyFormat(0, true)
        }</span>
        <br />
        
        <!--<b>Precio vehículo:</b> <span>${
          data.vehicleData.value
            ? currenyFormat(Number(data.vehicleData.value), true)
            : ''
        }</span>
        <br />-->
        <b>PVP vehículo:</b> <span>${
          data.vehicleData.value
            ? currenyFormat(data.vehicleData.value * 1.12, true)
            : ''
        } inc. IVA</span>
        <!--<br />
        <b>Monto a financiar:</b>
        <span>${
          data.vehicleData.financing
            ? currenyFormat(Number(data.vehicleData.financing), true)
            : ''
        }</span>-->
        <br />
        <b>Entrada:</b> <span>${
          currenyFormat(Number(data.vehicleData.entrada), true) ?? ''
        }</span>
        <br />
        <b>Plazo:</b> <span>${data.vehicleData.plazo ?? ''} meses</span>
        <br />
        <!--<b>Tasa:</b> <span>${data.vehicleData.tasa ?? ''}%</span>
        <br />
        <b>Cuota mensual:</b>
        <span>${
          currenyFormat(Number(data.vehicleData.monthlyPayments), true) ?? ''
        }</span>-->
      </p>
      `
      }
      </td>
</tr>
<tr>
<td colspan="${
    data.applicant.civilStatus !== 'Casado/a' ? '2' : ''
  }" valign="top">
      <p
        style="
        text-align: left;
        font-size: 15px;
        font-weight: bold;
        padding-left: 20px;
        margin: 20px 0px 10px;
        color: black;
        line-height: 20px;
      "
      >
        Empleo / Actividad del Solicitante
      </p>
      <p
        style="
        text-align: left;
        font-size: 13px;
        font-weight: normal;
        padding-left: 20px;
        margin: 10px 0px 10px;
        color: gray;
        line-height: 20px;
      "
      >
        <b>Empresa:</b> <span>${data.applicantActivity.company ?? ''}</span>
        <br />
        <b>Telefono Trabajo:</b>
        <span>${data.applicantActivity.workPhone ?? ''}</span>
        <br />
        <b>Años trabajando:</b>
        <span>${data.applicantActivity.yearsOfWork ?? ''}</span>
        <br />
        <b>Cargo:</b>
        <span>${data.applicantActivity.workPosition ?? ''}</span>
        <br />
        <b>Dirección:</b>
        <span>${data.applicantActivity.workAddress ?? ''}</span>
        <br />
        <b>Tipo de relación laboral:</b>
        <span>${data.applicantActivity.employmentRelationship ?? ''}</span>
      </p>
    </td>
    ${
      data.applicant.civilStatus === 'Casado/a'
        ? `<td valign="top">
      <p
        style="
        text-align: left;
        font-size: 15px;
        font-weight: bold;
        padding-left: 20px;
        margin: 20px 0px 10px;
        color: black;
        line-height: 20px;
      "
      >
        Datos del Cónyuge
      </p>
      <p
        style="
        text-align: left;
        font-size: 13px;
        font-weight: normal;
        padding-left: 20px;
        margin: 10px 0px 10px;
        color: gray;
        line-height: 20px;
      "
      >
        <b>Nombres:</b> <span>${data.spouseData.names ?? ''}</span>
        <br />
        <b>Apellidos:</b> <span>${data.spouseData.lastNames ?? ''}</span>
        <br />
        <b>Cédula:</b> <span>${data.spouseData.identification ?? ''}</span>
        <br />
        <b>Fecha de nacimiento:</b>
        <span>${data.spouseData.dateOfBirth ?? ''}</span>
        <br />
        <b>Lugar de nacimiento:</b>
        <span>${data.spouseData.placeOfBirth ?? ''}</span>
      </p>
      </td>`
        : ''
    }
    </tr>
    <td valign="top">
      <p
        style="
        text-align: left;
        font-size: 15px;
        font-weight: bold;
        padding-left: 20px;
        margin: 20px 0px 10px;
        color: black;
        line-height: 20px;
      "
      >
        Domicilio actual
      </p>
      <p
        style="
        text-align: left;
        font-size: 13px;
        font-weight: normal;
        padding-left: 20px;
        margin: 10px 0px 10px;
        color: gray;
        line-height: 20px;
      "
      >
        <b>Tipo de vivienda:</b>
        <span>${data.currentAddress.typeOfHousing ?? ''}</span>
        <br />
        <b>Dirección:</b>
        <span>${data.currentAddress.houseAddress ?? ''}</span>
        <br />
        <b>Barrio:</b>
        <span>${data.currentAddress.neighborhood ?? ''}</span>
        <br />
        <b>Parroquia:</b> <span>${data.currentAddress.parish ?? ''}</span>
        <br />
        <b>Teléfono:</b> <span>${data.currentAddress.homePhone ?? ''}</span>
        <br />
        <b>Provincia:</b> <span>${data.currentAddress.province ?? ''}</span>
        <br />
        <b>Cantón:</b> <span>${data.currentAddress.canton ?? ''}</span>
      </p>
    </td>
    <td valign="top">
      <p
        style="
        text-align: left;
        font-size: 15px;
        font-weight: bold;
        padding-left: 20px;
        margin: 20px 0px 10px;
        color: black;
        line-height: 20px;
      "
      >
        Ingresos
      </p>
      <p
        style="
        text-align: left;
        font-size: 13px;
        font-weight: normal;
        padding-left: 20px;
        margin: 10px 0px 10px;
        color: gray;
        line-height: 20px;
      "
      >
        <b>Sueldo mensual:</b>
        <span>${
          data.income.monthlySalary
            ? currenyFormat(Number(data.income.monthlySalary), true)
            : currenyFormat(0, true)
        }</span>
        <br />
        <b>Otros ingresos:</b> <span>${
          data.income.otherIncome
            ? currenyFormat(Number(data.income.otherIncome), true)
            : currenyFormat(0, true)
        }</span>
        <br />
        ${
          data.applicant.civilStatus === 'Casado/a'
            ? `<b>Sueldo mensual cónyugue:</b>
          <span>${
            data.income.monthlySpouseSalary
              ? currenyFormat(Number(data.income.monthlySpouseSalary), true)
              : currenyFormat(0, true)
          }</span>
          <br />
          <b>Otros ingresos cónyugue:</b>
          <span>${
            data.income.otherSpouseIncome
              ? currenyFormat(Number(data.income.otherSpouseIncome), true)
              : currenyFormat(0, true)
          }</span>`
            : ''
        }
      </p>
    </td>
</tr>

<tr>
    <td valign="top">
      <p
        style="
        text-align: left;
        font-size: 15px;
        font-weight: bold;
        padding-left: 20px;
        margin: 20px 0px 10px;
        color: black;
        line-height: 20px;
      "
      >
        Referencias Bancarias
      </p>
      <p
        style="
        text-align: left;
        font-size: 13px;
        font-weight: normal;
        padding-left: 20px;
        margin: 10px 0px 10px;
        color: gray;
        line-height: 20px;
      "
      >
        <b>Banco:</b> <span>${data.bankReferences.bank ?? ''}</span>
        <br />
        <b>Nro de cuenta:</b>
        <span>${data.bankReferences.accountNumber ?? ''}</span>
        <br />
        <b>Tipo de cuenta:</b>
        <span>${data.bankReferences.accountType ?? ''}</span>
      </p>
    </td>
    <td valign="top">
      <p
        style="
        text-align: left;
        font-size: 15px;
        font-weight: bold;
        padding-left: 20px;
        margin: 20px 0px 10px;
        color: black;
        line-height: 20px;
      "
      >
        Referencias Comerciales
      </p>
      <p
        style="
        text-align: left;
        font-size: 13px;
        font-weight: normal;
        padding-left: 20px;
        margin: 10px 0px 10px;
        color: gray;
        line-height: 20px;
      "
      >
        <b>Compañía:</b> <span>${data.commercialReferences.company ?? ''}</span>
        <br />
        <b>Sector:</b>
        <span>${data.commercialReferences.sector ?? ''}</span>
        <br />
        <b>Teléfono:</b>
        <span>${data.commercialReferences.phone ?? ''}</span>
        <br />
        <b>Domicilio:</b>
        <span>${data.commercialReferences.placeCompany ?? ''}</span>
        <br />
        <b>Nombre:</b> <span>${
          data.commercialReferences.referenceName ?? ''
        }</span>
        <br />
        <b>Cargo:</b> <span>${data.commercialReferences.position ?? ''}</span>
      </p>
    </td>
</tr>

<tr>
    <td valign="top">
    </td>
    <td valign="top">
      <p
        style="
        text-align: left;
        font-size: 15px;
        font-weight: bold;
        padding-left: 20px;
        margin: 20px 0px 10px;
        color: black;
        line-height: 20px;
      "
      >
        Referencias Personales
      </p>
      <p
        style="
        text-align: left;
        font-size: 13px;
        font-weight: normal;
        padding-left: 20px;
        margin: 10px 0px 10px;
        color: gray;
        line-height: 20px;
      "
      >
        <b>Nombre:</b> <span>${data.personalReferences.names ?? ''}</span>
        <br />
        <b>Apellidos:</b>
        <span>${data.personalReferences.lastNames ?? ''}</span>
        <br />
        <b>Parentesco:</b>
        <span>${data.personalReferences.relationship ?? ''}</span>
        <br />
        <b>Teléfono:</b> <span>${data.personalReferences.phone ?? ''}</span>
      </p>
    </td>
</tr>
<tr>
    <td valign="top">
      <p
        style="
        text-align: left;
        font-size: 15px;
        font-weight: bold;
        padding-left: 20px;
        margin: 20px 0px 10px;
        color: black;
        line-height: 20px;
      "
      >
        Activos
      </p>
      <p
        style="
        text-align: left;
        font-size: 13px;
        font-weight: normal;
        padding-left: 20px;
        margin: 10px 0px 10px;
        color: gray;
        line-height: 20px;
      "
      >
        <b>Casa:</b> <span>${
          data.property.house
            ? currenyFormat(Number(data.property.house), true)
            : currenyFormat(0, true)
        }</span>
        <br />
        <b>Vehículo:</b> <span>${
          data.property.vehicle
            ? currenyFormat(Number(data.property.vehicle), true)
            : currenyFormat(0, true)
        }</span>
        <br />
        <b>Otros:</b> <span>${
          data.property.others
            ? currenyFormat(Number(data.property.others), true)
            : currenyFormat(0, true)
        }</span>
        <br />
        <b>Total:</b>
        <span>
          ${currenyFormat(
            Number(
              data.property.house + data.property.vehicle + data.property.others
            ),
            true
          )}
        </span>
      </p>
    </td>
    <td valign="top">
      <p
        style="
        text-align: left;
        font-size: 15px;
        font-weight: bold;
        padding-left: 20px;
        margin: 20px 0px 10px;
        color: black;
        line-height: 20px;
      "
      >
        Pasivos
      </p>
      <p
        style="
        text-align: left;
        font-size: 13px;
        font-weight: normal;
        padding-left: 20px;
        margin: 10px 0px 10px;
        color: gray;
        line-height: 20px;
      "
      >
        <b>Cuentas por pagar:</b>
        <span>${
          data.passives.debtsToPay
            ? currenyFormat(Number(data.passives.debtsToPay), true)
            : currenyFormat(0, true)
        }</span>
        <br />
        <b>Tarjetas de crédito:</b>
        <span>${
          data.passives.creditCards
            ? currenyFormat(Number(data.passives.creditCards), true)
            : currenyFormat(0, true)
        }</span>
        <br />
        <b>Otros:</b> <span>${
          data.passives.others
            ? currenyFormat(Number(data.passives.others), true)
            : currenyFormat(0, true)
        }</span>
        <br />
        <b>Total:</b>
        <span>
          ${currenyFormat(
            Number(
              data.passives.others +
                data.passives.debtsToPay +
                data.passives.creditCards
            ),
            true
          )}
        </span>
      </p>
    </td>
  <tr>
    <td valign="top">
      <p
        style="
        text-align: left;
        font-size: 15px;
        font-weight: bold;
        padding-left: 20px;
        margin: 20px 0px 10px;
        color: black;
        line-height: 20px;
      "
      >
        Patrimonio
      </p>
      <p
        style="
        text-align: left;
        font-size: 13px;
        font-weight: normal;
        padding-left: 20px;
        margin: 10px 0px 10px;
        color: gray;
        line-height: 20px;
      "
      >
        <b>Activos:</b>
        <span>
          ${currenyFormat(
            Number(
              data.property.house + data.property.vehicle + data.property.others
            ),
            true
          )}
        </span>
        
        <br />
        <b>Pasivos:</b>
        <span>
          ${currenyFormat(
            Number(
              data.passives.others +
                data.passives.debtsToPay +
                data.passives.creditCards
            ),
            true
          )}
        </span>
        <br />
        <b>Total:</b>
        <span>
          ${currenyFormat(
            Number(
              data.property.house +
                data.property.vehicle +
                data.property.others -
                (data.passives.others +
                  data.passives.debtsToPay +
                  data.passives.creditCards)
            ),
            true
          )}
        </span>
      </p>
    </td>
    <td>
      <p
        style="
        text-align: left;
        font-size: 15px;
        font-weight: bold;
        padding-left: 20px;
        margin: 20px 0px 10px;
        color: black;
        line-height: 20px;
      ">
      Observaciones
      </p>
      <p 
        style="
        text-align: left;
        font-size: 13px;
        font-weight: normal;
        padding-left: 20px;
        margin: 10px 0px 10px;
        color: gray;
        line-height: 20px;
      ">
        <span>${observationsFyI && observationsFyI}</span>
      </p>
    </td>
  </tr>
  <tr>
        <td colspan="2" valign="top">
          <p
            style="
            text-align: justify;
            font-size: 9px;
            font-weight: normal;
            padding-left: 20px;
            margin: 10px 0px 10px;
            color: gray;
            line-height: 10px;
          "
        >
            Declaro(amos) bajo juramento que toda la información consignada en la presente solicitud es verdadera, corresponde a la realidad de los hechos y ha sido suministrada de buena fe en consecuencia asumo(imos) cualquier responsabilidad por los daños que pudiere sufrir la compañía ante quien la hemos presentado o sus cesionarios en derecho por la eventual falsedad o imprecisión de la misma.
            Expresamente autorizo(amos), en mi (nuestro) nombre (y el de mi cónyuge), a la compañía receptora de la presente solicitud y sus cesionarios en derecho o a cualquier persona natural o jurídica que éstas autoricen, por intermedio de cualquiera de sus funcionarios y/o trabajadores a verificar la realidad de la información consignada, incluyendo, pero no limitándose a mi (nuestras) referencias personales, comerciales, comportamiento crediticio y bancario y a proporcionar dicha información a cualquier autoridad pública y organismos de control facultados por ley para solicitarla. Expresamente autorizamos la obtención y verificación en la Central de Riesgos y/o burós de información crediticia, de todo tipo de información relacionada en la presente solicitud de crédito, liberando a los consultantes de cualquier responsabilidad civil, penal o de cualquier tipo por esta causa, facultándolos adicionalmente a proveer a estas instituciones la información de nuestro comportamiento crediticio.
            Declaro(amos) bajo juramento que los fondos utilizados para pagar el precio del vehículo automotor que estoy(amos) interesados en adquirir tienen origen lícito, no provienen de ninguna actividad prohibida por la ley, ni son fruto del tráfico de sustancias estupefacientes y psicotrópicas y asumimos cualquier tipo de responsabilidad civil y penal por la veracidad de esta declaración.
          </p>
        </td>
    </tr>
    <tr>
        <td valign="top">
            <div style="margin: 35px;">
                <div style="border-bottom: 1px solid #222;"></div>
                <b>Firma</b>
            </div>
        </td>
        <td valign="top">
            ${
              data.applicant.civilStatus &&
              data.applicant.civilStatus === 'Casado/a'
                ? `<div style="margin: 35px;">
                <div style="border-bottom: 1px solid #222;"></div>
                <b>Firma cónyuge</b>
            </div>`
                : ''
            }
        </td>
    </tr>
</table>
`;
  return template;
};
const templateTestDriver = (data: {
  client: Client;
  listDataDrivers: any[];
  vin?: string;
  brand?: string;
  model?: string;
  user?: string;
  anio?: string;
  color?: string;
  concessionaire?: string;
  startKm?: number;
  endKm?: number;
  concesionarioCode?: string;
}) => {
  //console.log('listDataDrivers', data.listDataDrivers);
  const isRedInterna =
    !!data.concesionarioCode &&
    netType(data.concesionarioCode).toLowerCase() === 'red interna';
  //console.log('Es red interna?:', isRedInterna);
  /* <td>Licencia: ${driver.validLicenses ? 'SI' : 'NO'}</td> */
  let drivers = '';
  if (data.listDataDrivers.length > 0) {
    data.listDataDrivers.map((driver) => {
      drivers += `<tr>
        <td>Conductor: ${driver.name} ${driver.lastName}</td>
        
        <td>Licencia: ${driver.validLicense ? 'SI' : 'NO'}</td>
      </tr>`;
      return true;
    });
  }
  const template = `<table
    width="600"
    border="0"
    style="
      width: 600px;
      margin: 0 auto 40px;
      font-family: Arial, Helvetica, sans-serif;
      border: 1px solid #dedede;
      border-collapse: collapse;
      font-size: 11px;
    "
    cellpadding="5"
    cellspacing="0"
  >
    <tr>
      <th style="border: 1px solid #dedede; font-size: 18px" colspan="2">
      ${
        isRedInterna
          ? `<img
      src="http://corpCRM.com.ec/wp-content/uploads/2018/08/01-logo-CRM-2.png"
      width="140"
      alt="CRM"
    />`
          : ''
      }
        
      </th>
    </tr>
    <tr>
      <th style="border: 1px solid #dedede; font-size: 16px" colspan="2">
        ${data.concessionaire}
      </th>
    </tr>
    <tr>
      <td style="border: 1px solid #dedede">Vendedor: ${data.user}</td>
      <td style="border: 1px solid #dedede">Fecha: ${moment().format(
        'DD-MM-YYYY HH:mm'
      )}</td>
    </tr>
    <tr>
      <th style="border: 1px solid #dedede; font-size: 14px" colspan="2">
        Datos del cliente
      </th>
    </tr>
    <tr>
      <td style="border: 1px solid #dedede">Nombre: ${data.client.name} ${
    data.client.lastName
  } </td>
      <td style="border: 1px solid #dedede">CI: ${
        data.client.identification
      }</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dedede">Email: ${data.client.email}</td>
      <td style="border: 1px solid #dedede">Celular: ${
        data.client.cellphone
      }</td>
    </tr>
    ${
      data.client.phone
        ? `<tr>
      <td style="border: 1px solid #dedede">Teléfono: ${data.client.phone}</td>
      <td style="border: 1px solid #dedede"></td>
    </tr>`
        : ''
    }
    <tr>
      <th style="border: 1px solid #dedede; font-size: 14px" colspan="2">
        Modelo testeado
      </th>
    </tr>
    <tr>
      <td style="border: 1px solid #dedede">
        <div>Marca: ${data.brand}</div>
      </td>
      <td style="border: 1px solid #dedede">
        <div>Modelo: ${data.model}</div>
      </td>
    </tr>
    <tr>
      <td style="border: 1px solid #dedede">
        <div>Año: ${data.anio ?? ''}</div>
      </td>
      <td style="border: 1px solid #dedede">
        <div>Color: ${data.color ?? ''}</div>
      </td>
    </tr>
    <tr>
      <td style="border: 1px solid #dedede">
        <div>Kilometraje inicial: ${data.startKm ?? ''}</div>
      </td>
      <td style="border: 1px solid #dedede">
        <div>Kilometraje final: ${data.endKm ?? ''}</div>
      </td>
    </tr>
    <tr>
       <td style="border: 1px solid #dedede">Vin: ${data.vin ?? ''}</td>
       <td style="border: 1px solid #dedede"></td>
    </tr>
    <tr>
      <th style="border: 1px solid #dedede; font-size: 14px" colspan="2">
        Conductores
      </th>
    </tr>
    <tr>
      <td style="border: 1px solid #dedede" colspan="2">
        <table
          width="600"
          border="0"
          style="
            width: 600px;
            font-family: Arial, Helvetica, sans-serif;
            border-collapse: collapse;
            font-size: 12px;
          "
          cellpadding="5"
          cellspacing="0"
        >
          ${drivers}
        </table>
      </td>
    </tr>
    <tr>
      <th style="border: 1px solid #dedede; font-size: 14px" colspan="2">
        Responsabilidad civil
      </th>
    </tr>
    <tr>
      <td style="border: 1px solid #dedede" colspan="2">
        Para asegurar que la actividad se desarrolle con total normalidad y que todos disfrutemos del placer de evaluar el producto, debemos cumplir con las siguientes normas de comportamiento y seguridad:
      </td>
    </tr>
    <tr>
      <th style="border: 1px solid #dedede; font-size: 14px" colspan="2">
        Términos de responsabilidades
      </th>
    </tr>
    <tr>
      <th style="border: 1px solid #dedede" colspan="2">
        (Lea Atentamente y Firme el Acuerdo Antes de Comenzar la Actividad)
      </th>
    </tr>
    <tr>
      <td style="border: 1px solid #dedede" colspan="2">
        <ol>
          <li style="margin-bottom: 10px">
            Todas las personas que van a participar del test drive deben firmar esta Responsabilidad Civil.
          </li>
          <li style="margin-bottom: 10px">
            Colocarse el cinturón de seguridad en todos los asientos, en todo momento de la prueba.
          </li>
          <li style="margin-bottom: 10px">
            Acatar atentamente las indicaciones del Asesor Comercial que conduce el vehículo o acompaña.
          </li>
          <li style="margin-bottom: 10px">
            Al bajarse del vehículo poner atención a los vehículos que circulan y No alejarse.
          </li>
          <li style="margin-bottom: 10px">
            Los daños ocasionados a los vehículos, producto de negligencia, mal uso, mal trato del producto por el participante durante de la prueba, serán de su responsabilidad.
          </li>
          <li style="margin-bottom: 10px">
            Los participantes asumen total responsabilidad por los daños y perjuicios que pudiere ocasionarles la participación en el test drive.
          </li>
          <li style="margin-bottom: 10px">
            El concesionario, no se responsabilizará por los daños y perjuicios que pudieran ocasionarle a los participantes, producto del mal uso de los vehículos y/o la omisión de las presentes normas de comportamiento.
          </li>
          <li style="margin-bottom: 10px">
            El participante declara estar en condiciones físicas y psíquicas de salud, para participar en una prueba de test-drive en circuitos off-road.
          </li>
          <li style="margin-bottom: 10px">
            El conductor debe cumplir con las leyes y normativas de Tránsito vigentes  y en caso de que se ocasionen incumplimientos y el vehículo sea multado, debe cubrir el valor de la misma.
          </li>
        </ol>
      </td>
    </tr>
    <tr>
      <th style="border: 1px solid #dedede" colspan="2">
        Declaro haber leído y comprendido la presente Responsabilidad Civil.
      </th>
    </tr>
    <tr>
      <td style="padding: 0;" colspan="2">
        <table
            width="600"
            border="0"
            style="
              width: 100%;
              font-family: Arial, Helvetica, sans-serif;
              border-collapse: collapse;
              font-size: 12px;
            "
            cellpadding="5"
            cellspacing="0"
          >
            <tr>
              <td>
                <div style="display: flex; align-items: flex-end; height: 50px;"><span>Firma conductor</span></div>
              </td>
              <td style="border-right: 1px solid #dedede; border-left: 1px solid #dedede;">
                <div style="display: flex; align-items: flex-end; height: 50px;"><span>Firma Vendedor</span></div>
              </td>
              <td>
                <div style="display: flex; align-items: flex-end; height: 50px;"><span>Firma del Guardia</span></div>
              </td>
            </tr>
        </table>
      </td>
    </tr>
    <tr>
      <th style="border: 1px solid #dedede; font-size: 14px" colspan="2">
        Impresiones sobre el test drive
      </th>
    </tr>
    <tr>
      <td style="border: 1px solid #dedede" colspan="2">
        <table
          width="600"
          border="0"
          style="
            width: 600px;
            font-family: Arial, Helvetica, sans-serif;
            border-collapse: collapse;
            font-size: 12px;
          "
          cellpadding="5"
          cellspacing="0"
        >
          <tr>
            <td>
              Satisfacción General
            </td>
            <td>Malo</td>
            <td>Regular</td>
            <td>Bueno</td>
            <td>Óptimo</td>
            <td>Excelente</td>
          </tr>
          <tr rowspan="2">
            <td style="">Observaciones</td>
            <td style="height: 40px" colspan="5" valign="bottom"><hr /></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="border: 1px solid #dedede">
        ¿El Test drive fue realizado con el modelo deseado?
      </td>
      <td style="border: 1px solid #dedede">Si / No</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dedede" colspan="2">
        ¿Cuáles fueron los atributos más valorados?
      </td>
    </tr>
    <tr>
      <td style="height: 10px" colspan="2"></td>
    </tr>
    <tr>
      <td style="height: 0px" colspan="2"><hr /></td>
    </tr>
    <tr>
      <td style="height: 10px" colspan="2"></td>
    </tr>
    <tr>
      <td style="height: 0px" colspan="2"><hr /></td>
    </tr>
    <tr>
      <td style="border: 1px solid #dedede">Nota para el test drive:</td>
      <td style="border: 1px solid #dedede">Nombre del concesionario: ${
        data.concessionaire
      }</td>
    </tr>
  </table>`;
  return template;
};

const templateQuote = (
  client: Client,
  quote: Quotes,
  forMail: boolean,
  concesionarioCode: string
) => {
  const { user } = auth;
  //console.log('User para imprimir', user);
  //console.log('quote para imprimir', quote);

  let vehiculosRender = '';
  let legals = 0;
  let totalRen = 0;
  let subtotal = 0;
  let pdfrender = '';

  //CALCULO EL VALOR EXTRA DE LOS ACCESORIOS CON EL PARAMETRO es_kit = 1
  let AccesoriesRender = '';
  let valueExtraToPVP = 0;

  //console.log('quote imprimir', quote)
  const accesoriesRen = quote.idAccesories?.map((accesorie) => {
    //console.log('accesorie', accesorie)
    if (accesorie.es_kit !== 1) {
      //console.log('entro 1', accesorie.es_kit)
      AccesoriesRender += `<tr>
        <td style="border: 1px solid #dedede;">
          ${accesorie.name}
        </td>
        ${
          /* <td style="border: 1px solid #dedede;">
          ${accesorie.brand}
        </td> */ ''
        }
        <td style="border: 1px solid #dedede;">
          ${accesorie.quantity}
        </td>
        <td style="border: 1px solid #dedede;">
          ${currenyFormat(Number(accesorie.cost), true)}
        </td>
        <td style="border: 1px solid #dedede;">
          ${currenyFormat(Number(accesorie.cost! * accesorie.quantity!), true)}
        </td>
      </tr>`;
    } else {
      //console.log('entro 2', accesorie.es_kit);
      valueExtraToPVP += accesorie.cost
        ? accesorie.cost * accesorie.quantity!
        : 0;
    }

    return true;
  });
  //console.log('valueExtraToPVP', valueExtraToPVP);

  const vehicleren = quote.vehiculo?.map((vehicule) => {
    if (quote.type === 'credit') {
      legals = calcLegals(vehicule?.pvp!, true);
    }
    //console.log('vhPVP', vehicule?.pvp!);
    const insuranceCarrierAmmount = quote!.insuranceCarrier!
      ? quote!.insuranceCarrier!.cost!
      : 0;
    const totalBase =
      vehicule?.pvp! +
      //valueExtraToPVP + //valor extra de accesorios
      (quote!.accesoriesValue! - valueExtraToPVP) +
      quote!.servicesValue! +
      (legals - (legals - legals / 1.12)) +
      insuranceCarrierAmmount +
      (quote.registration! ? quote.registration! : 0);

    totalRen = calcTotal(
      totalBase,
      vehicule?.pvp!,
      quote.registration!,
      insuranceCarrierAmmount,
      !!quote.exonerated
    );
    subtotal = subTotal(totalBase, insuranceCarrierAmmount);

    if (vehicule.pdf) {
      vehicule.pdf.map((pdf, index) => {
        pdfrender += `<td>
          <a style="
          font-size: 12px;
          padding: 5px;
          color: #fff;
          background-color: #1890ff;
          border-color: #1890ff;
          border-radius: 6px;
          " href="${pdf.link}" target="_blank">Ver pdf ${index + 1}</a>
        <td>`;
        return pdf;
      });
    }

    vehiculosRender += `<tr>
        <td
          style="
            padding-top: 20px;
            font-size: 18px;
          "
          valign="top"
        >
          <b>${vehicule.brand} ${vehicule.description} ${vehicule.year}</b>
          <br/>  
          <img 
            src="${
              vehicule.imgs !== ''
                ? vehicule.imgs === '/img/no-image-found-360x250.png'
                  ? 'https://guc.it-zam.com/img/no-image-found-360x250.png'
                  : vehicule.imgs
                : '/img/no-image-found-360x250.png'
            }" 
            alt="vehicle Img"
            style="width:300px;"
            width="300"
          />
          ${
            forMail
              ? `<table>
            <tr>
              ${pdfrender || ''}
            </tr>
          </table>`
              : ''
          }
        </td>
        <td 
          style="
            padding-top: 20px;
          "
          valign="top"
        >
          <table
            style="
              width:280px;
              font-size: 10px;
              margin-left: 19px;
            "
          >
            <tr>
              <td><b>Cantidad:</b> ${vehicule.cantidad}<td>
            <tr>
            <tr>
              <td><b>Descripción:</b> ${vehicule.description}<td>
            <tr>
            <tr>
              <td><b>Puertas:</b> ${vehicule.doors}<td>
            <tr>
            <tr>
              <td><b>Pasajeros:</b> ${vehicule.numPassengers}<td>
            <tr>
            <tr>
              <td><b>Combustible:</b> ${vehicule.fuel}<td>
            <tr>
            <tr>
              <td><b>Precio:</b> ${currenyFormat(vehicule.pvp!, true)}<td>
            <tr>
            <tr>
              <td><b>PVP:</b> ${currenyFormat(
                vehicule.pvp! * (quote.exonerated ? 1 : 1.12),
                true
              )} ${!quote.exonerated ? 'Inc. IVA' : 'Exonerado'}<td>
            <tr>
            <tr>
              <td><b>Observaciones:</b> ${
                quote.observations ? quote.observations : ''
              }<td>
            <tr>
          </table>
        </td>
      </tr>`;

    return true;
  });

  let ServicesRender = '';
  // eslint-disable-next-line no-unused-expressions
  quote.services?.forEach((service) => {
    if (service) {
      service.items!.forEach((itemServ) => {
        ServicesRender += `
          <tr>
            <td style="border: 1px solid #dedede;">
              ${itemServ.descripcion}
            </td>
            <td style="border: 1px solid #dedede;">
              ${service.nombre}
            </td>
            ${
              /* <td style="border: 1px solid #dedede;">
              ${itemServ.marcas}
            </td> */ ''
            }
            <td style="border: 1px solid #dedede;">
              ${currenyFormat(itemServ.valor, true)}
            </td>
          </tr>`;
      });
    }
  });

  const quotes = `<table
      style="
        margin: auto;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 10px;
        width: 600px;
      "
      cellpadding="0"
    >
      ${vehiculosRender}
      ${
        quote.idAccesories &&
        Number(quote.accesoriesValue) - valueExtraToPVP !== 0
          ? `<tr>
          <td colspan="2">
            <table
              style="
                width:600px;
                font-size: 10px;
                margin: auto;
                border: 1px solid #dedede;
                border-collapse: collapse;
                margin-top: 20px;
              "
              cellpadding="3"
            >
              <tr>
                <th
                  colspan="7"
                  style="
                    font-size: 15px;
                    text-align: left;
                    border: 1px solid #dedede;
                  "
                >
                  <b>Accesorios</b>
                </th>
              </tr>
              <tr>
                <th style="border: 1px solid #dedede;">Nombre</th>
                
                <th style="border: 1px solid #dedede;">Cantidad</th>
                <th style="border: 1px solid #dedede;">Costo/u</th>
                <th style="border: 1px solid #dedede;">Subtotal</th>
              </tr>
              ${AccesoriesRender}
              <tr>
                <td 
                  colspan="7"
                  style="
                    text-align: right;
                    border: 1px solid #dedede;
                  "
                >
                  Subtotal Accesorios: ${currenyFormat(
                    Number(quote.accesoriesValue) - valueExtraToPVP,
                    true
                  )}
                </td>
              </tr>
              <tr>
                <td 
                  colspan="7"
                  style="
                    text-align: right;
                    border: 1px solid #dedede;
                  "
                >
                  Total Accesorios: ${currenyFormat(
                    (Number(quote.accesoriesValue) - valueExtraToPVP) * 1.12,
                    true
                  )}
                </td>
              </tr>
            </table>
          </td>
        </tr>`
          : ''
      }
      ${
        quote.services
          ? `<tr>
        <td colspan="2">
          <table
            style="
              width:600px;
              font-size: 10px;
              margin: auto;
              border: 1px solid #dedede;
              border-collapse: collapse;
              margin-top: 20px;
            "
            cellpadding="3"
          >
            <tr>
              <th
                style="
                  font-size: 15px;
                  text-align: left;
                  border: 1px solid #dedede;
                "
                colspan="4"
              >
                Servicios
              </th>
            </tr>
            <tr>
              <th style="border: 1px solid #dedede;">Nombre</th>
              <th style="border: 1px solid #dedede;">Categoría</th>
              
              <th style="border: 1px solid #dedede;">Subtotal</th>
            </tr>
            ${ServicesRender}
            <tr>
            <td 
              colspan="7"
              style="
                text-align: right;
                border: 1px solid #dedede;
              "
            >
              Subtotal servicios: ${currenyFormat(
                Number(quote.servicesValue),
                true
              )}
            </td>
          </tr>
            <tr>
              <td 
                colspan="7"
                style="
                  text-align: right;
                  border: 1px solid #dedede;
                "
              >
                Total servicios: ${currenyFormat(
                  Number(quote.servicesValue) * 1.12,
                  true
                )}
              </td>
            </tr>
          </table>
        </td>
      </tr>`
          : ''
      }
      ${
        quote.mechanicalAppraisalQuote
          ? `<tr>
          <td colspan="2">
            <table
              style="
                width:600px;
                font-size: 10px;
                margin: auto;
                border-collapse: collapse;
                border: 1px solid #dedede;
                margin-top: 20px;
              "
              cellpadding="3"
            >
              <tr>
                <th
                  colspan="7"
                  style="
                    font-size: 15px;
                    text-align: left;
                    border: 1px solid #dedede;
                  "
                >
                  <b>Auto como parte de pago</b>
                </th>
              </tr>
              <tr>
                <th style="border: 1px solid #dedede;">Marca</th>
                <th style="border: 1px solid #dedede;">Modelo</th>
                <th style="border: 1px solid #dedede;">Precio deseado</th>
                <th style="border: 1px solid #dedede;">Kilometraje</th>
                <th style="border: 1px solid #dedede;">año</th>
              </tr>
              <tr>
                <th style="border: 1px solid #dedede;">${quote.mechanicalAppraisalQuote.brand}</th>
                <th style="border: 1px solid #dedede;">${quote.mechanicalAppraisalQuote.model}</th>
                <th style="border: 1px solid #dedede;">${quote.mechanicalAppraisalQuote.desiredPrice}</th>
                <th style="border: 1px solid #dedede;">${quote.mechanicalAppraisalQuote.mileage}</th>
                <th style="border: 1px solid #dedede;">${quote.mechanicalAppraisalQuote.year}</th>
              </tr>
            </table>
          </td>
        </tr>`
          : ''
      } 
      ${
        quote.insuranceCarrier
          ? `<tr>
        <td
          colspan="2"
          style="
            font-size: 15px;
            text-align: left;
            padding-top: 20px;
          "
        >
          <b>Aseguradora</b>
        </td>
      </tr>
      <tr>
        <td>
          <b>Aseguradora:</b> ${quote.insuranceCarrier.name}
        </td>
        ${
          /* <td>
          <b>Costo mensual:</b> ${currenyFormat(
            Number(quote.insuranceCarrier.monthlyPayment),
            true
          )}
        </td> */ ''
        }
      </tr>
      <tr>
        <td>
          <b>Años:</b> ${quote.insuranceCarrier.years}
        </td>
        <!--<td>
          <b>Total seguro:</b> ${currenyFormat(
            Number(quote.insuranceCarrier.cost),
            true
          )} inc. IVA
        </td>-->
      </tr>`
          : ''
      }
      <tr>
        <th
          colspan="2"
          style="
            font-size: 15px;
            text-align: left;
            padding-top: 20px;
          "
        >
          <b>Parámetros de pago</b>
        </th>
      </tr>
      <tr>
        <td colspan="2">
          <b>Forma de pago:</b>${
            quote.type === 'counted' ? 'CONTADO' : 'CRÉDITO'
          }
        </td>
      </tr>
      ${
        quote.inputAmount
          ? `<tr>
        <td colspan="2">
          <b>Entrada:</b> ${currenyFormat(Number(quote.inputAmount), true)}
        </td>
      </tr>`
          : ''
      }
      ${
        quote.registration
          ? `<tr>
        <td colspan="2">
          <b>Valor matrícula:</b> ${currenyFormat(
            Number(quote.registration),
            true
          )}
        </td>
      </tr>`
          : ''
      }
      ${
        quote.type === 'credit'
          ? `<tr>
        <td colspan="2">
          <b>Meses plazo:</b> ${quote.months}
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <b>Tasa:</b> ${quote.rate}%
        </td>
      </tr>
      <tr>
        <td 
          colspan="2"
          style="
            font-size: 15px;
            text-align: left;
            padding-top: 10px;
          "
        >
          <b>Cuota:</b> ${currenyFormat(Number(quote.monthly), true)}
        </td>
      </tr>`
          : ''
      }
      ${
        /*
        quote.type === 'credit'
          ? `<tr>
          <td 
            colspan="2"
            style="
              font-size: 15px;
              text-align: left;
              padding-top: 10px;
            "
          >
            <b>Total a financiar:</b> ${currenyFormat(
              totalRen - quote.inputAmount! - quote.registration!,
              true
            )}
          </td>
        </tr>`
          : ''
            */ ''
      }
      <tr>
        <td 
          colspan="2"
          style="
            font-size: 18px;
            text-align: left;
            padding-top: 10px;
          "
        >
          <!--<b>Subtotal:</b> ${currenyFormat(subtotal, true)}-->
        </td>
      </tr>
      <tr>
        <td 
          colspan="2"
          style="
            font-size: 18px;
            text-align: left;
            padding-top: 10px;
          "
        >
        <!--<b>Total:</b> ${currenyFormat(totalRen, true)}--> <!--${
    !quote.exonerated ? '<span>Inc. IVA</span> ' : '<div>Vehículo sin IVA</div>'
  }-->
        </td>
      </tr>
    </table>`;

  const isRedInterna =
    netType(concesionarioCode).toLowerCase() === 'red interna';
  const template = `<table
    width="600"
    border="0"
    style="
    margin: 0 auto 40px;
    font-family: Arial, Helvetica, sans-serif;
    "
    cellpadding="0"
    cellspacing="0"
  >
    <tr>
      <td colspan="2" style="text-align: center;">
        <p
          style="
          text-align: left;
          margin: 20px 0px 10px;
        "
        >${
          isRedInterna
            ? ` <img
        src="http://corpCRM.com.ec/wp-content/uploads/2018/08/01-logo-CRM-2.png"
        width="170"
        alt="CRM"
      />`
            : ''
        }
         
        </p>
        <p
          style="
            text-align: right;
            margin: 20px 0px 10px;
            font-size: 22px;
            font-weight: bold;
          "
        >
          Cotización
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <table
          width="600"
          style="
            margin: auto;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 10px;
            border: 1px solid #dedede;
            border-collapse: collapse;
            width: 600px;
          "
          cellpadding="3"
        >
          <tr>
            <td style="width: 100px; border: 1px solid #dedede;"><b>Asesor:</b></td>
            <td style="width: 200px; border: 1px solid #dedede;">${
              user.nombre
            } ${user.apellido}</td>
            <td style="width: 100px; border: 1px solid #dedede;"><b>Concesionario:</b></td>
            <td style="width: 200px; border: 1px solid #dedede;">${
              user.dealer[0].descripcion
            }</td>
          </tr>
          <tr>
            <td style="width: 100px; border: 1px solid #dedede;"><b>Email Asesor:</b></td>
            <td style="width: 200px; border: 1px solid #dedede;">${
              user.email ?? ''
            }</td>
            <td style="width: 100px; border: 1px solid #dedede;"><b>Celular Asesor:</b></td>
            <td style="width: 200px; border: 1px solid #dedede;">${
              user.phone ?? ''
            }</td>
          </tr>
        </table>
        <br />
      </td>
    </tr>
    <tr>
      <td>
        <table
          width="600"
          style="
            margin: auto;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 10px;
            border: 1px solid #dedede;
            border-collapse: collapse;
            width: 600px;
          "
          cellpadding="3"
        >
          <tr>
            <td style="width: 100px; border: 1px solid #dedede;"><b>Nombre:</b></td>
            <td style="width: 200px; border: 1px solid #dedede;">${
              client.name
            } ${client.lastName}</td>
            <td style="width: 100px; border: 1px solid #dedede;"><b>Fecha:</b></td>
            <td style="width: 200px; border: 1px solid #dedede;">${moment().format(
              'MM-DD-YYYY'
            )}</td>
          </tr>
          <tr>
            <td style="width: 100px; border: 1px solid #dedede;"><b>Email:</b></td>
            <td style="width: 200px; border: 1px solid #dedede;">${
              client.email
            }</td>
            <td style="width: 100px; border: 1px solid #dedede;"><b>Celular:</b></td>
            <td style="width: 200px; border: 1px solid #dedede;">${
              client.cellphone
            }</td>
          </tr>
          <tr>
            <td style="width: 100px; border: 1px solid #dedede;"><b>Canal:</b></td>
            <td style="width: 200px; border: 1px solid #dedede;">${
              client.chanel
            }</td>
            <td style="width: 100px; border: 1px solid #dedede;"><b>Campaña:</b></td>
            <td style="width: 200px; border: 1px solid #dedede;">${
              client.campaign
            }</td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        ${quotes}
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <div style="font-size: 10px; margin-top: 20px;">
          <h3>Notas legales:</h3>
          <ul> 
            <li>Validez de la oferta hasta el ${moment()
              .add(8, 'days')
              .calendar()}, sujeto disponibilidad de inventario.</li>
            <li>Se dispone de financiación a través de compañías de financiamiento comercial y entidades del sistema financiero.</li> 
            <li>Los vehículos vendidos a través del Concesionario, están amparados bajos los términos de la garantía de la marca.</li>
            <li>Plazo de entrega: a convenir. Ningún vehículo será entregado sin contar con la correspondiente matrícula y placas.</li>
            <li>Todos los términos del financiamiento son definidos por las compañías de financiamiento comercial y entidades del sistema financiero, que lo otorguen, en lo cual ${
              isRedInterna ? 'Corporación CRM' : user.dealer[0].descripcion
            } no tiene injerencia alguna.</li>
            <li>Los valores del seguro son aproximados mensuales y son definidos por la entidad aseguradora acorde a los factores que estime pertinentes, en lo cual ${
              isRedInterna ? 'Corporación CRM' : user.dealer[0].descripcion
            } no tiene injerencia alguna.</li>
            <li>Los colores de los vehículos son una referencia, el color final es el observado en la sala de ventas, sujeto a inventario.</li>
            <li>Los precios de productos y servicios como accesorios, seguros y demás conceptos relacionados en la presente cotización son adicionales al valor del vehículo y por ello no están incluidos como valor de la máquina.</li>
          </ul>
          <p>“El presente documento constituye únicamente un material con fin informativo y bajo ninguna circunstancia se la debe considerar como una oferta vinculante por parte de ${
            isRedInterna ? 'Corporación CRM' : user.dealer[0].descripcion
          }. Fotografías referencias, accesorios se venden por separado. Las especificaciones y detalles descritos están sujetos a cambio sin previo aviso y pueden variar. Para los datos precisos consulte a su concesionario”</p>
          
          <p>El presente documento es una cotización. No conforma aprobación alguna de la transacción cotizada. El concesionario no procederá con la facturación el vehículo hasta no recibir los formularios de prevención de lavado de activos y financiamiento del terrorismo, de acuerdo a la normativa vigente.</p>
        </div>
      </td>
    </tr>
  </table>
`;
  return template;
};

const templateQuotePublicCatalog = (
  client: Client,
  user: User,
  quote: Quotes,
  forMail: boolean,
  concesionarioCode: string
) => {
  console.log(
    'datos en template mail🔥🌎',
    client,
    user,
    quote,
    forMail,
    concesionarioCode
  );
  //console.log('User para imprimir', user);
  //console.log('quote para imprimir', quote);

  let vehiculosRender = '';
  let legals = 0;
  let totalRen = 0;
  let subtotal = 0;
  let pdfrender = '';

  //CALCULO EL VALOR EXTRA DE LOS ACCESORIOS CON EL PARAMETRO es_kit = 1
  let AccesoriesRender = '';
  let valueExtraToPVP = 0;

  //console.log('quote imprimir', quote)
  const accesoriesRen = quote.idAccesories?.map((accesorie) => {
    //console.log('accesorie', accesorie)
    if (accesorie.es_kit !== 1) {
      //console.log('entro 1', accesorie.es_kit)
      AccesoriesRender += `<tr>
        <td style="border: 1px solid #dedede;">
          ${accesorie.name}
        </td>
        ${
          /* <td style="border: 1px solid #dedede;">
          ${accesorie.brand}
        </td> */ ''
        }
        <td style="border: 1px solid #dedede;">
          ${accesorie.quantity}
        </td>
        <td style="border: 1px solid #dedede;">
          ${currenyFormat(Number(accesorie.cost), true)}
        </td>
        <td style="border: 1px solid #dedede;">
          ${currenyFormat(Number(accesorie.cost! * accesorie.quantity!), true)}
        </td>
      </tr>`;
    } else {
      //console.log('entro 2', accesorie.es_kit);
      valueExtraToPVP += accesorie.cost
        ? accesorie.cost * accesorie.quantity!
        : 0;
    }

    return true;
  });
  //console.log('valueExtraToPVP', valueExtraToPVP);

  const vehicleren = quote.vehiculo?.map((vehicule) => {
    if (quote.type === 'credit') {
      legals = calcLegals(vehicule?.pvp!, true);
    }
    //console.log('vhPVP', vehicule?.pvp!);
    const insuranceCarrierAmmount = quote!.insuranceCarrier!
      ? quote!.insuranceCarrier!.cost!
      : 0;
    const totalBase =
      vehicule?.pvp! +
      //valueExtraToPVP + //valor extra de accesorios
      (quote!.accesoriesValue! - valueExtraToPVP) +
      quote!.servicesValue! +
      (legals - (legals - legals / 1.12)) +
      insuranceCarrierAmmount +
      (quote.registration! ? quote.registration! : 0);

    totalRen = calcTotal(
      totalBase,
      vehicule?.pvp!,
      quote.registration!,
      insuranceCarrierAmmount,
      !!quote.exonerated
    );
    subtotal = subTotal(totalBase, insuranceCarrierAmmount);

    if (vehicule.pdf) {
      vehicule.pdf.map((pdf, index) => {
        pdfrender += `<td>
          <a style="
          font-size: 12px;
          padding: 5px;
          color: #fff;
          background-color: #1890ff;
          border-color: #1890ff;
          border-radius: 6px;
          " href="${pdf.link}" target="_blank">Ver pdf ${index + 1}</a>
        <td>`;
        return pdf;
      });
    }

    vehiculosRender += `<tr>
        <td
          style="
            padding-top: 20px;
            font-size: 18px;
          "
          valign="top"
        >
          <b>${vehicule.brand} ${vehicule.description} ${vehicule.year}</b>
          <br/>  
          <img 
            src="${
              vehicule.imgs !== ''
                ? vehicule.imgs === '/img/no-image-found-360x250.png'
                  ? 'https://guc.it-zam.com/img/no-image-found-360x250.png'
                  : vehicule.imgs
                : '/img/no-image-found-360x250.png'
            }" 
            alt="vehicle Img"
            style="width:300px;"
            width="300"
          />
          ${
            forMail
              ? `<table>
            <tr>
              ${pdfrender || ''}
            </tr>
          </table>`
              : ''
          }
        </td>
        <td 
          style="
            padding-top: 20px;
          "
          valign="top"
        >
          <table
            style="
              width:280px;
              font-size: 10px;
              margin-left: 19px;
            "
          >
            <tr>
              <td><b>Cantidad:</b> ${vehicule.cantidad}<td>
            <tr>
            <tr>
              <td><b>Descripción:</b> ${vehicule.description}<td>
            <tr>
            <tr>
              <td><b>Puertas:</b> ${vehicule.doors}<td>
            <tr>
            <tr>
              <td><b>Pasajeros:</b> ${vehicule.numPassengers}<td>
            <tr>
            <tr>
              <td><b>Combustible:</b> ${vehicule.fuel}<td>
            <tr>
            <tr>
              <td><b>Precio:</b> ${currenyFormat(vehicule.pvp!, true)}<td>
            <tr>
            <tr>
              <td><b>PVP:</b> ${currenyFormat(
                vehicule.pvp! * (quote.exonerated ? 1 : 1.12),
                true
              )} ${!quote.exonerated ? 'Inc. IVA' : 'Exonerado'}<td>
            <tr>
            <tr>
              <td><b>Observaciones:</b> ${
                quote.observations ? quote.observations : ''
              }<td>
            <tr>
          </table>
        </td>
      </tr>`;

    return true;
  });

  let ServicesRender = '';
  // eslint-disable-next-line no-unused-expressions
  quote.services?.forEach((service) => {
    if (service) {
      service.items!.forEach((itemServ) => {
        ServicesRender += `
          <tr>
            <td style="border: 1px solid #dedede;">
              ${itemServ.descripcion}
            </td>
            <td style="border: 1px solid #dedede;">
              ${service.nombre}
            </td>
            ${
              /* <td style="border: 1px solid #dedede;">
              ${itemServ.marcas}
            </td> */ ''
            }
            <td style="border: 1px solid #dedede;">
              ${currenyFormat(itemServ.valor, true)}
            </td>
          </tr>`;
      });
    }
  });

  const quotes = `<table
      style="
        margin: auto;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 10px;
        width: 600px;
      "
      cellpadding="0"
    >
      ${vehiculosRender}
      ${
        quote.idAccesories &&
        Number(quote.accesoriesValue) - valueExtraToPVP !== 0
          ? `<tr>
          <td colspan="2">
            <table
              style="
                width:600px;
                font-size: 10px;
                margin: auto;
                border: 1px solid #dedede;
                border-collapse: collapse;
                margin-top: 20px;
              "
              cellpadding="3"
            >
              <tr>
                <th
                  colspan="7"
                  style="
                    font-size: 15px;
                    text-align: left;
                    border: 1px solid #dedede;
                  "
                >
                  <b>Accesorios</b>
                </th>
              </tr>
              <tr>
                <th style="border: 1px solid #dedede;">Nombre</th>
                
                <th style="border: 1px solid #dedede;">Cantidad</th>
                <th style="border: 1px solid #dedede;">Costo/u</th>
                <th style="border: 1px solid #dedede;">Subtotal</th>
              </tr>
              ${AccesoriesRender}
              <tr>
                <td 
                  colspan="7"
                  style="
                    text-align: right;
                    border: 1px solid #dedede;
                  "
                >
                  Subtotal Accesorios: ${currenyFormat(
                    Number(quote.accesoriesValue) - valueExtraToPVP,
                    true
                  )}
                </td>
              </tr>
              <tr>
                <td 
                  colspan="7"
                  style="
                    text-align: right;
                    border: 1px solid #dedede;
                  "
                >
                  Total Accesorios: ${currenyFormat(
                    (Number(quote.accesoriesValue) - valueExtraToPVP) * 1.12,
                    true
                  )}
                </td>
              </tr>
            </table>
          </td>
        </tr>`
          : ''
      }
      ${
        quote.services
          ? `<tr>
        <td colspan="2">
          <table
            style="
              width:600px;
              font-size: 10px;
              margin: auto;
              border: 1px solid #dedede;
              border-collapse: collapse;
              margin-top: 20px;
            "
            cellpadding="3"
          >
            <tr>
              <th
                style="
                  font-size: 15px;
                  text-align: left;
                  border: 1px solid #dedede;
                "
                colspan="4"
              >
                Servicios
              </th>
            </tr>
            <tr>
              <th style="border: 1px solid #dedede;">Nombre</th>
              <th style="border: 1px solid #dedede;">Categoría</th>
              
              <th style="border: 1px solid #dedede;">Subtotal</th>
            </tr>
            ${ServicesRender}
            <tr>
            <td 
              colspan="7"
              style="
                text-align: right;
                border: 1px solid #dedede;
              "
            >
              Subtotal servicios: ${currenyFormat(
                Number(quote.servicesValue),
                true
              )}
            </td>
          </tr>
            <tr>
              <td 
                colspan="7"
                style="
                  text-align: right;
                  border: 1px solid #dedede;
                "
              >
                Total servicios: ${currenyFormat(
                  Number(quote.servicesValue) * 1.12,
                  true
                )}
              </td>
            </tr>
          </table>
        </td>
      </tr>`
          : ''
      }
      ${
        quote.mechanicalAppraisalQuote
          ? `<tr>
          <td colspan="2">
            <table
              style="
                width:600px;
                font-size: 10px;
                margin: auto;
                border-collapse: collapse;
                border: 1px solid #dedede;
                margin-top: 20px;
              "
              cellpadding="3"
            >
              <tr>
                <th
                  colspan="7"
                  style="
                    font-size: 15px;
                    text-align: left;
                    border: 1px solid #dedede;
                  "
                >
                  <b>Auto como parte de pago</b>
                </th>
              </tr>
              <tr>
                <th style="border: 1px solid #dedede;">Marca</th>
                <th style="border: 1px solid #dedede;">Modelo</th>
                <th style="border: 1px solid #dedede;">Precio deseado</th>
                <th style="border: 1px solid #dedede;">Kilometraje</th>
                <th style="border: 1px solid #dedede;">año</th>
              </tr>
              <tr>
                <th style="border: 1px solid #dedede;">${quote.mechanicalAppraisalQuote.brand}</th>
                <th style="border: 1px solid #dedede;">${quote.mechanicalAppraisalQuote.model}</th>
                <th style="border: 1px solid #dedede;">${quote.mechanicalAppraisalQuote.desiredPrice}</th>
                <th style="border: 1px solid #dedede;">${quote.mechanicalAppraisalQuote.mileage}</th>
                <th style="border: 1px solid #dedede;">${quote.mechanicalAppraisalQuote.year}</th>
              </tr>
            </table>
          </td>
        </tr>`
          : ''
      } 
      ${
        quote.insuranceCarrier
          ? `<tr>
        <td
          colspan="2"
          style="
            font-size: 15px;
            text-align: left;
            padding-top: 20px;
          "
        >
          <b>Aseguradora</b>
        </td>
      </tr>
      <tr>
        <td>
          <b>Aseguradora:</b> ${quote.insuranceCarrier.name}
        </td>
        ${
          /* <td>
          <b>Costo mensual:</b> ${currenyFormat(
            Number(quote.insuranceCarrier.monthlyPayment),
            true
          )}
        </td> */ ''
        }
      </tr>
      <tr>
        <td>
          <b>Años:</b> ${quote.insuranceCarrier.years}
        </td>
        <!--<td>
          <b>Total seguro:</b> ${currenyFormat(
            Number(quote.insuranceCarrier.cost),
            true
          )} inc. IVA
        </td>-->
      </tr>`
          : ''
      }
      <tr>
        <th
          colspan="2"
          style="
            font-size: 15px;
            text-align: left;
            padding-top: 20px;
          "
        >
          <b>Parámetros de pago</b>
        </th>
      </tr>
      <tr>
        <td colspan="2">
          <b>Forma de pago:</b>${
            quote.type === 'counted' ? 'CONTADO' : 'CRÉDITO'
          }
        </td>
      </tr>
      ${
        quote.inputAmount
          ? `<tr>
        <td colspan="2">
          <b>Entrada:</b> ${currenyFormat(Number(quote.inputAmount), true)}
        </td>
      </tr>`
          : ''
      }
      ${
        quote.registration
          ? `<tr>
        <td colspan="2">
          <b>Valor matrícula:</b> ${currenyFormat(
            Number(quote.registration),
            true
          )}
        </td>
      </tr>`
          : ''
      }
      ${
        quote.type === 'credit'
          ? `<tr>
        <td colspan="2">
          <b>Meses plazo:</b> ${quote.months}
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <b>Tasa:</b> ${quote.rate}%
        </td>
      </tr>
      <tr>
        <td 
          colspan="2"
          style="
            font-size: 15px;
            text-align: left;
            padding-top: 10px;
          "
        >
          <b>Cuota:</b> ${currenyFormat(Number(quote.monthly), true)}
        </td>
      </tr>`
          : ''
      }
      ${
        /*
        quote.type === 'credit'
          ? `<tr>
          <td 
            colspan="2"
            style="
              font-size: 15px;
              text-align: left;
              padding-top: 10px;
            "
          >
            <b>Total a financiar:</b> ${currenyFormat(
              totalRen - quote.inputAmount! - quote.registration!,
              true
            )}
          </td>
        </tr>`
          : ''
            */ ''
      }
      <tr>
        <td 
          colspan="2"
          style="
            font-size: 18px;
            text-align: left;
            padding-top: 10px;
          "
        >
          <!--<b>Subtotal:</b> ${currenyFormat(subtotal, true)}-->
        </td>
      </tr>
      <tr>
        <td 
          colspan="2"
          style="
            font-size: 18px;
            text-align: left;
            padding-top: 10px;
          "
        >
        <!--<b>Total:</b> ${currenyFormat(totalRen, true)}--> <!--${
    !quote.exonerated ? '<span>Inc. IVA</span> ' : '<div>Vehículo sin IVA</div>'
  }-->
        </td>
      </tr>
    </table>`;

  const isRedInterna = 'red interna';
  const template = `<table
    width="600"
    border="0"
    style="
    margin: 0 auto 40px;
    font-family: Arial, Helvetica, sans-serif;
    "
    cellpadding="0"
    cellspacing="0"
  >
    <tr>
      <td colspan="2" style="text-align: center;">
        <p
          style="
          text-align: left;
          margin: 20px 0px 10px;
        "
        >${
          isRedInterna
            ? ` <img
        src="http://corpCRM.com.ec/wp-content/uploads/2018/08/01-logo-CRM-2.png"
        width="170"
        alt="CRM"
      />`
            : ''
        }
         
        </p>
        <p
          style="
            text-align: right;
            margin: 20px 0px 10px;
            font-size: 22px;
            font-weight: bold;
          "
        >
          Cotización
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <table
          width="600"
          style="
            margin: auto;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 10px;
            border: 1px solid #dedede;
            border-collapse: collapse;
            width: 600px;
          "
          cellpadding="3"
        >
          <tr>
            <td style="width: 100px; border: 1px solid #dedede;"><b>Asesor:</b></td>
            <td style="width: 200px; border: 1px solid #dedede;">${
              user.nombre
            } ${user.apellido}</td>
          </tr>
          <tr>
            <td style="width: 100px; border: 1px solid #dedede;"><b>Email Asesor:</b></td>
            <td style="width: 200px; border: 1px solid #dedede;">${
              user.email ?? ''
            }</td>
            <td style="width: 100px; border: 1px solid #dedede;"><b>Celular Asesor:</b></td>
            <td style="width: 200px; border: 1px solid #dedede;">${
              user.phone ?? ''
            }</td>
          </tr>
        </table>
        <br />
      </td>
    </tr>
    <tr>
      <td>
        <table
          width="600"
          style="
            margin: auto;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 10px;
            border: 1px solid #dedede;
            border-collapse: collapse;
            width: 600px;
          "
          cellpadding="3"
        >
          <tr>
            <td style="width: 100px; border: 1px solid #dedede;"><b>Nombre:</b></td>
            <td style="width: 200px; border: 1px solid #dedede;">${
              client.name
            } ${client.lastName}</td>
            <td style="width: 100px; border: 1px solid #dedede;"><b>Fecha:</b></td>
            <td style="width: 200px; border: 1px solid #dedede;">${moment().format(
              'MM-DD-YYYY'
            )}</td>
          </tr>
          <tr>
            <td style="width: 100px; border: 1px solid #dedede;"><b>Email:</b></td>
            <td style="width: 200px; border: 1px solid #dedede;">${
              client.email
            }</td>
            <td style="width: 100px; border: 1px solid #dedede;"><b>Celular:</b></td>
            <td style="width: 200px; border: 1px solid #dedede;">${
              client.cellphone
            }</td>
          </tr>
          <tr>
            <td style="width: 100px; border: 1px solid #dedede;"><b>Canal:</b></td>
            <td style="width: 200px; border: 1px solid #dedede;">${
              client.chanel
            }</td>
            <td style="width: 100px; border: 1px solid #dedede;"><b>Campaña:</b></td>
            <td style="width: 200px; border: 1px solid #dedede;">${
              client.campaign
            }</td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        ${quotes}
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <div style="font-size: 10px; margin-top: 20px;">
          <h3>Notas legales:</h3>
          <ul> 
            <li>Validez de la oferta hasta el ${moment()
              .add(8, 'days')
              .calendar()}, sujeto disponibilidad de inventario.</li>
            <li>Se dispone de financiación a través de compañías de financiamiento comercial y entidades del sistema financiero.</li> 
            <li>Los vehículos vendidos a través del Concesionario, están amparados bajos los términos de la garantía de la marca.</li>
            <li>Plazo de entrega: a convenir. Ningún vehículo será entregado sin contar con la correspondiente matrícula y placas.</li>
            <li>Todos los términos del financiamiento son definidos por las compañías de financiamiento comercial y entidades del sistema financiero, que lo otorguen, en lo cual Corporación CRM no tiene injerencia alguna.</li>
            <li>Los valores del seguro son aproximados mensuales y son definidos por la entidad aseguradora acorde a los factores que estime pertinentes, en lo cual Corporación CRM  no tiene injerencia alguna.</li>
            <li>Los colores de los vehículos son una referencia, el color final es el observado en la sala de ventas, sujeto a inventario.</li>
            <li>Los precios de productos y servicios como accesorios, seguros y demás conceptos relacionados en la presente cotización son adicionales al valor del vehículo y por ello no están incluidos como valor de la máquina.</li>
          </ul>
          <p>“El presente documento constituye únicamente un material con fin informativo y bajo ninguna circunstancia se la debe considerar como una oferta vinculante por parte de Corporación CRM. Fotografías referencias, accesorios se venden por separado. Las especificaciones y detalles descritos están sujetos a cambio sin previo aviso y pueden variar. Para los datos precisos consulte a su concesionario”</p>
          
          <p>El presente documento es una cotización. No conforma aprobación alguna de la transacción cotizada. El concesionario no procederá con la facturación el vehículo hasta no recibir los formularios de prevención de lavado de activos y financiamiento del terrorismo, de acuerdo a la normativa vigente.</p>
        </div>
      </td>
    </tr>
  </table>
`;
  return template;
};
export {
  templateNewCredit,
  templateWorkShop,
  templateTestDriver,
  templateQuote,
  templateQuotePublicCatalog,
};
