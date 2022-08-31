import { netType } from '../extras';

interface VaulesTable {
  dataGeneral: {
    concesionario: string;
    concesionarioCode: string;
    asesorComercial: string;
    date: string;
    hours: string;
  };
  clientData: {
    name: string;
    identification: string;
    phone: string;
  };
  vehicleData: {
    brand: string;
    model: string;
    VIN: string;
    color: string;
  };
  approvedBy?: string;
  dateApproved?: string;
  vehicleInvoice?: string | number;
}

const itemsCheckList = [
  {
    title: 'ITEMS DE SEGURIDAD',
    items: [
      'Frenos ABS y EBD',
      'Air Bags',
      'ESC/ESP y TCS',
      'ISOFIX',
      'Palanca de freno de mano',
      'Cinturón de seguridad delantero / posterior',
      'Llanta emergencia',
      'Herramientas / Gatas / señales de seguridad',
      'Puntos de elevación / gancho remolque',
      'Seguro de puertas posteriores para niños',
      'Sistema de tracción 4x4',
      'Llantas / presión de neumáticos',
    ],
  },
  {
    title: 'ITEMS DE CONFORT',
    items: [
      'Asientos regulación y rebatimiento',
      'Pack elétrico: vidrios, trabas y retrovisores ',
      'Sistema de ventilación y aire acond. /Ventilador',
      'Sistema de audio, multimedia, antena',
      'Sistema de configuración de celular y conexión Bluetooth',
      'Sistema de GPS',
      'Sistema de ignición remota y arranque sin llave / keyless',
      'Sistema de apertura y cierre de puertas sin llave / keyless',
      'Sistema de iluminación externa / faros delanteros, antiniebla, posterior /crepuscular',
      'Computadora de abordo/Control de crucero',
      'Sensores de estacionamiento y cámara de retroceso',
      'Programación de reloj',
      'Limpiaparabrisas y luneta trasera',
      'Tapiceria / alfonbras',
      'Sistema de dirección eléctrica',
      'Accesorios instalados en concesionario ',
    ],
  },
  {
    title: 'OPERACIÓN EXTERNA',
    items: [
      'Apertura de tapa de combustible',
      'Seguro de puertas posteriores para niños',
      'Apertura de capot de motor',
      'Apertura de puertas',
      'Verificación de fluidos (aceite, fluido de transmisión automática, freno dirección hidráulica, radiador, niveles de punto de llenado, condiciones de llenado)',
      'Pintura',
      'Carrocería',
      'Aros / Tapacubos',
      'Plumas y brazos',
      'Faros: delanteros, antiniebla, posteriores, luz de retro, guías delanterass y posteriores',
      'Antena',
      'Sistema de alarma',
      'Bateria',
    ],
  },
];

const templateCheckList = (values: VaulesTable) => {
  let itemsCheckListRender = '';
  let itmsCLRender = '';
  itemsCheckList.map((itmsCL) => {
    itmsCL.items.map((itm) => {
      itmsCLRender += `<tr>
          <td style="width: 235px;">${itm}</td>
          <td>
            <div style="display: flex; align-items: center">
              <div
                style="
                  width: 12px;
                  height: 10px;
                  border: 1px solid #5ba5a5;
                  margin-right: 5px;
                "
              ></div>
              <span>No aplica</span>
              <div
                style="
                  width: 12px;
                  height: 10px;
                  border: 1px solid #5ba5a5;
                  margin: 0px 5px;
                "
              ></div>
              <span>Realizado</span>
            </div>
          </td>
          <td></td>
          <td>
            <div style="display: flex; align-items: center">
              <div
                style="
                  width: 12px;
                  height: 10px;
                  border: 1px solid #5ba5a5;
                  margin-right: 5px;
                "
              ></div>
              <span>Explicado</span>
            </div>
          </td>
        </tr>`;
    });
    itemsCheckListRender += `<tr>
      <th style="border-bottom: 1px solid; border-top: 1px solid; width: 235px; text-align: start;">${itmsCL.title}</th>
      <th style="width: 120px; border-bottom: 1px solid; border-top: 1px solid;">Preparación</th>
      <th style="border-bottom: 1px solid; border-top: 1px solid;">Observaciones</th>
      <th style="width: 60px; border-bottom: 1px solid; border-top: 1px solid;">Entrega</th>
      </tr> ${itmsCLRender}`;
  });
  const isRedInterna =
    netType(values.dataGeneral.concesionarioCode).toLowerCase() ===
    'red interna';

  return `
    <table
      style="
        margin: auto;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 10px;
        width: 600px;
        border: 1px solid #222222;
        border-collapse: collapse;
      "
      cellpadding="3"
      border="1"
    >
      <thead>
        <tr>
          <th colspan="2">
          ${
            isRedInterna
              ? `<div
          style="display: flex; flex-direction: column; align-items: center"
        >
          <img
            src="http://corpCRM.com.ec/wp-content/uploads/2018/08/01-logo-CRM-2.png"
            width="170"
            alt="CRM"
          />
          <b>CHECK LIST DE ENTREGA DE VEHÍCULOS</b>
        </div>`
              : ''
          }
            
          </th>
        </tr>
      </thead>
      <!-- Datos Generales -->
      <tbody>
        <tr>
          <td colspan="2">
            <b>Concesionario:</b> ${values.dataGeneral.concesionario}
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <b>Asesor Comercial:</b> ${values.dataGeneral.asesorComercial}
          </td>
        </tr>
        <tr>
          <td>
            <b>Fecha de entrega:</b> ${values.dataGeneral.date}
          </td>
          <td>
            <b>Hora de entrega:</b> ${values.dataGeneral.hours}
          </td>
        </tr>
      </tbody>
      <!-- Datos Cliente -->
      <tbody>
        <tr>
          <th colspan="2" style="background-color: #f1f1f1">
            DATOS DEL CLIENTE
          </th>
        </tr>
        <tr>
          <td>
            <b>Nombre del cliente:</b> ${values.clientData.name}
          </td>
          <td>
            <b>CI/RUC:</b> ${values.clientData.identification}
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <b>Teléfono:</b> ${values.clientData.phone}
          </td>
        </tr>
      </tbody>
      <!-- Datos vehiculo -->
      <tbody>
        <tr>
          <th colspan="2" style="background-color: #f1f1f1">
            DATOS DEL VEHÍCULO
          </th>
        </tr>
        <tr>
          <td>
            <b>Marca:</b> ${values.vehicleData.brand}
          </td>
          <td>
            <b>Modelo:</b> ${values.vehicleData.model}
          </td>
        </tr>
        <tr>
          <td>
            <b>VIN:</b> ${values.vehicleData.VIN}
          </td>
          <td>
            <b>Color:</b> ${values.vehicleData.color}
          </td>
        </tr>
      </tbody>
      <!-- Preparación del vehiculo -->
      <tbody>
        <tr>
          <th colspan="2" style="background-color: #f1f1f1">
            PREPARACIÓN DEL VEHÍCULO
          </th>
        </tr>
        <tr>
          <td colspan="2">
            <table style="width: 100%; font-family: Arial, Helvetica, sans-serif;
            font-size: 10px;">
              <thead>
                <tr>
                  <td></td>
                  <td>
                    <b>Preparación:</b>
                  </td>
                  <td>
                    <b>Entrega:</b>
                  </td>
                </tr>
              </thead>
              <!--FILA PREPARACION VEHICULO-->
              <tr>
                <td>
                  <span>Revisión Final:</span>
                </td>
                <td>
                  <div style="display: flex; align-items: center">
                    <div
                      style="
                        width: 12px;
                        height: 10px;
                        border: 1px solid #5ba5a5;
                        margin-right: 5px;
                      "
                    ></div>
                    <span>Realizado</span>
                  </div>
                </td>
                <td>
                  <div style="display: flex; align-items: center">
                    <div
                      style="
                        width: 12px;
                        height: 10px;
                        border: 1px solid #5ba5a5;
                        margin-right: 5px;
                      "
                    ></div>
                    <span>Explicado</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <span>Instalación de accesorios:</span>
                </td>
                <td>
                  <div style="display: flex; align-items: center">
                    <div
                      style="
                        width: 12px;
                        height: 10px;
                        border: 1px solid #5ba5a5;
                        margin-right: 5px;
                      "
                    ></div>
                    <span>Realizado</span>
                  </div>
                </td>
                <td>
                  <div style="display: flex; align-items: center">
                    <div
                      style="
                        width: 12px;
                        height: 10px;
                        border: 1px solid #5ba5a5;
                        margin-right: 5px;
                      "
                    ></div>
                    <span>Explicado</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <span>Cubre alfombras:</span>
                </td>
                <td>
                  <div style="display: flex; align-items: center">
                    <div
                      style="
                        width: 12px;
                        height: 10px;
                        border: 1px solid #5ba5a5;
                        margin-right: 5px;
                      "
                    ></div>
                    <span>Realizado</span>
                  </div>
                </td>
                <td>
                  <div style="display: flex; align-items: center">
                    <div
                      style="
                        width: 12px;
                        height: 10px;
                        border: 1px solid #5ba5a5;
                        margin-right: 5px;
                      "
                    ></div>
                    <span>Explicado</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <span>Lavado / Limpieza:</span>
                </td>
                <td>
                  <div style="display: flex; align-items: center">
                    <div
                      style="
                        width: 12px;
                        height: 10px;
                        border: 1px solid #5ba5a5;
                        margin-right: 5px;
                      "
                    ></div>
                    <span>Realizado</span>
                  </div>
                </td>
                <td>
                  <div style="display: flex; align-items: center">
                    <div
                      style="
                        width: 12px;
                        height: 10px;
                        border: 1px solid #5ba5a5;
                        margin-right: 5px;
                      "
                    ></div>
                    <span>Explicado</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <span>Combustible (testigo apagado):</span>
                </td>
                <td>
                  <div style="display: flex; align-items: center">
                    <div
                      style="
                        width: 12px;
                        height: 10px;
                        border: 1px solid #5ba5a5;
                        margin-right: 5px;
                      "
                    ></div>
                    <span>Realizado</span>
                  </div>
                </td>
                <td>
                  <div style="display: flex; align-items: center">
                    <div
                      style="
                        width: 12px;
                        height: 10px;
                        border: 1px solid #5ba5a5;
                        margin-right: 5px;
                      "
                    ></div>
                    <span>Explicado</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <span>Segunda llave:</span>
                </td>
                <td>
                  <div style="display: flex; align-items: center">
                    <div
                      style="
                        width: 12px;
                        height: 10px;
                        border: 1px solid #5ba5a5;
                        margin-right: 5px;
                      "
                    ></div>
                    <span>Realizado</span>
                  </div>
                </td>
                <td>
                  <div style="display: flex; align-items: center">
                    <div
                      style="
                        width: 12px;
                        height: 10px;
                        border: 1px solid #5ba5a5;
                        margin-right: 5px;
                      "
                    ></div>
                    <span>Explicado</span>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </tbody>
      <!-- ENTREGA DE DOCUMENTACIÓN Y MANUALES -->
      <tbody>
        <tr>
          <th colspan="2" style="background-color: #f1f1f1">
            ENTREGA DE DOCUMENTACIÓN Y MANUALES
          </th>
        </tr>
        <tr>
          <td style="border-right: 1px solid">
            <table style="width: 100%; font-family: Arial, Helvetica, sans-serif;
            font-size: 10px;">
              <tr>
                <td>
                  <div>
                    <div>Entrega y explicación del manual de uso:</div>
                    <div style="padding: 2px 5px">
                      Equipamiento de seguridad
                    </div>
                    <div style="padding: 2px 5px">
                      Explicación sobre el uso del radio
                    </div>
                    <div style="padding: 2px 5px">
                      Explicación sobre la lectura del manual de uso
                    </div>
                  </div>
                </td>
                <td>
                  <div style="display: flex; align-items: center">
                    <div
                      style="
                        width: 12px;
                        height: 10px;
                        border: 1px solid #5ba5a5;
                        margin-right: 5px;
                      "
                    ></div>
                    <span>Realizado</span>
                  </div>
                </td>
              </tr>
            </table>
          </td>
          <td>
            <table style="width: 100%; font-family: Arial, Helvetica, sans-serif;
            font-size: 10px;">
              <tr>
                <td>
                  <div>
                    <div>Explicacion sobre Asistencia las 24 horas:</div>
                    <div style="padding: 2px 5px">
                      Cobertura de la asistencia
                    </div>
                    <div style="padding: 2px 5px">
                      Condiciones y uso correcto de la asistencia
                    </div>
                    <div style="padding: 2px 5px">Teléfonos de contacto</div>
                    <div style="padding: 2px 5px">Periodo de cobertura</div>
                  </div>
                </td>
                <td>
                  <div style="display: flex; align-items: center">
                    <div
                      style="
                        width: 12px;
                        height: 10px;
                        border: 1px solid #5ba5a5;
                        margin-right: 5px;
                      "
                    ></div>
                    <span>Realizado</span>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="border-right: 1px solid">
            <table style="width: 100%; font-family: Arial, Helvetica, sans-serif;
            font-size: 10px;">
              <tr>
                <td>
                  <div>
                    <div>Explicación sobre la Garantía:</div>
                    <div style="padding: 2px 5px">
                      Condiciones para garantía
                    </div>
                    <div style="padding: 2px 5px">
                      Piezas de desgaste natural
                    </div>
                    <div style="padding: 2px 5px">Cobertura de garantía</div>
                    <div style="padding: 2px 5px">
                      Explicación mantenimiento preventivo
                    </div>
                  </div>
                </td>
                <td>
                  <div style="display: flex; align-items: center">
                    <div
                      style="
                        width: 12px;
                        height: 10px;
                        border: 1px solid #5ba5a5;
                        margin-right: 5px;
                      "
                    ></div>
                    <span>Realizado</span>
                  </div>
                </td>
              </tr>
            </table>
          </td>
          <td>
            <table style="width: 100%; font-family: Arial, Helvetica, sans-serif;
            font-size: 10px;">
              <tr>
                <td>
                  <div>
                    <div>Presentación Post Venta:</div>
                    <div style="padding: 2px 5px">
                      Forma de solicitud de turnos
                    </div>
                    <div style="padding: 2px 5px">
                      Descarga aplicativo de citas
                    </div>
                    <div style="padding: 2px 5px">
                      Horario de Atención / formas de pago
                    </div>
                    <div style="padding: 2px 5px">
                      Tarjetas personales de contacto
                    </div>
                  </div>
                </td>
                <td>
                  <div style="display: flex; align-items: center">
                    <div
                      style="
                        width: 12px;
                        height: 10px;
                        border: 1px solid #5ba5a5;
                        margin-right: 5px;
                      "
                    ></div>
                    <span>Realizado</span>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </tbody>
      <!-- RESPONSABLE DE ENTREGA -->
      <tbody>
        <tr>
          <th colspan="2" style="background-color: #f1f1f1">
            RESPONSABLE DE ENTREGA
          </th>
        </tr>
        <tr>
          <td colspan="2">
            <div style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 70px;
          ">
              <span>Observaciones:</span>
              <span>Firma Asesor Comercial:</span>
            </div>
          </td>
        </tr>
      </tbody>
      <!-- CLIENTE -->
      <tbody>
        <tr>
          <th style="background-color: #f1f1f1" colspan="2">CLIENTE</th>
        </tr>
        <tr>
          <td colspan="2">
            <div style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 70px;
          ">
              <span>Observaciones:</span>
              <span>Firma Cliente:</span>
            </div>
          </td>
        </tr>
        
      </tbody>
    </table>
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <table
      style="
        margin: auto;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 10px;
        width: 600px;
        border: 1px solid #222222;
        border-collapse: collapse;
      "
      cellpadding="3"
      border="1"
    >
      <thead>
        <tr>
          <th colspan="2">
          ${
            isRedInterna
              ? `
          <div
              style="display: flex; flex-direction: column; align-items: center"
            >
              <img
                src="http://corpCRM.com.ec/wp-content/uploads/2018/08/01-logo-CRM-2.png"
                width="170"
                alt="CRM"
              />
              <b>CHECK LIST DE ENTREGA DE VEHÍCULOS</b>
            </div>`
              : ''
          }
            
          </th>
        </tr>
      </thead>
      <!-- Datos Generales -->
      <tbody>
        <tr>
          <td style="width: 50%">
            <b>VIN:</b> ${values.vehicleData.VIN}
          </td>
          <td>
            <b>Color:</b> ${values.vehicleData.color}
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <b>Modelo:</b> ${values.vehicleData.model}
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <b>Marca:</b> ${values.vehicleData.brand}
          </td>
        </tr>
      </tbody>
      <tbody>
        <tr>
        <td colspan="2" style="padding: 0px">
          <table
              style="
                width: 100%;
                font-size: 8px;
                border-collapse: collapse;
                border: none;
              "
              border="1"
            >
              ${itemsCheckListRender}

              <tr>
                <td style="border-top: 1px solid;">Usted desea obtener más información sobre el vehículo?</td>
                <td colspan="3" style="border-top: 1px solid;">
                  <div
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 5px;
                    "
                  >
                    <div
                      style="
                        width: 12px;
                        height: 10px;
                        border: 1px solid #5ba5a5;
                        margin-right: 5px;
                      "
                    ></div>
                    <span>Teléfono</span>
                  </div>
                  <div style="display: flex; align-items: center">
                    <div
                      style="
                        width: 12px;
                        height: 10px;
                        border: 1px solid #5ba5a5;
                        margin-right: 5px;
                      "
                    ></div>
                    <span>Otro</span>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </tbody>

      <tbody>
        <tr>
          <th colspan="2" style="background-color: #f1f1f1">
            RESPONSABLE DE ENTREGA / CLIENTE
          </th>
        </tr>
        <tr>
          <td>
            <div
              style="
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                height: 50px;
              "
            >
              Firma Asesor Comercial
            </div>
          </td>
          <td>
            <div
              style="
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 50px;
              "
            >
              <spa>Observaciones:</spa>
              <spa>Firma Cliente</spa>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    `;
};

const templateExit = (values: VaulesTable) => {
  return `<table
  style="
    margin: auto;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10px;
    width: 600px;
    border: 1px solid #222222;
    border-collapse: collapse;
    line-height: 2;
  "
  cellpadding="3"
  border="1"
>
  <thead>
    <tr>
      <th style="width: 50%">
        <div
          style="display: flex; flex-direction: column; align-items: center"
        >
          <img
            src="http://corpCRM.com.ec/wp-content/uploads/2018/08/01-logo-CRM-2.png"
            width="170"
            alt="CRM"
          />
        </div>
      </th>
      <th>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          "
        >
          <b>DISTRIVEHIC DISTRIBUIDORA DE VEHÍCULOS S.A</b>
          <b>IMPRESIÓN HOJA DE SALIDA VEHÍCULO</b>
        </div>
      </th>
    </tr>
  </thead>
  <!-- Datos Generales -->
  <tbody>
    <tr>
      <td>
        <div style="display: flex; flex-direction: column">
          <div><b>CONCESIONARIO:</b> ${values.dataGeneral.concesionario}</div>
          <div><b>ASESOR COMERCIAL:</b> ${
            values.dataGeneral.asesorComercial
          }</div>
          <div><b>FECHA:</b> ${values.dataGeneral.date}</div>
        </div>
      </td>
      <td>
        <div>
          <div><b># HOJA NEGOCIO:</b></div>
          ${
            values.vehicleInvoice
              ? `<div><b># FACTURA DE VEHÍCULO:</b> ${values.vehicleInvoice}</div> `
              : ''
          }
        </div>
      </td>
    </tr>

    <tr>
      <td>
        <div><b>CLIENTE:</b> ${values.clientData.name}</div>
      </td>
      <td>
        <div><b>CI/RUC:</b> ${values.clientData.identification}</div>
      </td>
    </tr>

    <tr>
      <td>
        <div style="display: flex; flex-direction: column">
          <div><b>MARCA:</b> ${values.vehicleData.brand}</div>
          <div><b>VIN:</b> ${values.vehicleData.VIN}</div>
        </div>
      </td>
      <td>
        <div>
          <div><b>MODELO:</b> ${values.vehicleData.model}</div>
          <div><b>COLOR:</b> ${values.vehicleData.color}</div>
        </div>
      </td>
    </tr>

    <tr>
      <td>
        <div style="display: flex; flex-direction: column">
          <div><b>APROBADO POR:</b> ${values.approvedBy} </div>
          <div><b>FECHA:</b> ${values.dateApproved}</div>
        </div>
      </td>
      <td>
        <div
          style="
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 30px;
          "
        >
          <b>Observaciones:</b>
        </div>
      </td>
    </tr>

    <tr>
      <td>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 60px;
          "
        >
          <div><b>APROBADO GERENTE / JEFE SUCURSAL:</b></div>
          <div style="text-align: center">
            <span>___________________________</span>
          </div>
        </div>
      </td>
      <td>
        <b>Fecha:</b>
      </td>
    </tr>

    <tr>
      <td>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 60px;
          "
        >
          <div><b>RECIBÍ EL VEHÍCULO CONFORME (CLIENTE):</b></div>
          <div style="text-align: center">
            <span>___________________________</span>
          </div>
        </div>
      </td>
      <td>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
        >
          <div><b>NOMBRE TERCERO:</b></div>
          <div><b>FIRMA TERCERO:</b></div>
          <div><b>CI TERCERO:</b></div>
        </div>
      </td>
    </tr>

    <tr>
      <td colspan="2">
        <b>SALIDA SEGURIDAD FÍSICA:</b>
      </td>
    </tr>

    <tr>
      <td colspan="2">
        <div
          style="
            display: flex;
            justify-content: space-around;
            text-align: center;
          "
        >
          <div style="text-align: center; margin-top: 25px">
            <div>________________________</div>
            <div>Nombre</div>
          </div>
          <div style="text-align: center; margin-top: 25px">
            <div>________________________</div>
            <div>Firma</div>
          </div>
          <div style="text-align: center; margin-top: 25px">
            <div>________________________</div>
            <div>Fecha</div>
          </div>
        </div>
      </td>
    </tr>
  </tbody>
</table>`;
};

export { templateCheckList, templateExit };
